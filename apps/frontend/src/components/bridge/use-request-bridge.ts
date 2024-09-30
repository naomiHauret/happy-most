import { SUPPORTED_CHAINS, SupportedChainsAliases } from '@happy/chains'
import tokenList from '@happy/token-lists/bridge'
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi'
import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '~/services/@happy/client'
import abiSimpleERC2O from '@happy/abis/SimpleERC20'
import { parseUnits } from 'viem'

type ValidSelectedToken = keyof typeof tokenList.tokenMap
type BridgeRequestCommonParams = {
  source: SupportedChainsAliases
  destination: SupportedChainsAliases
}

type SubmitBridgeRequestBurnParams = {
  tokenId: ValidSelectedToken
  amount: number
} & BridgeRequestCommonParams

type SubmitBridgeRequestMintParams = {
  hash: `0x${string}`
} & BridgeRequestCommonParams

/**
 * Bridge submission flow hook
 */
function useRequestBridge(args: {tokenBalanceQueryKey: QueryKey}) {
  const queryClient = useQueryClient()
  const accountData = useAccount()
  /**
   * Switch chain mutation
   * @see https://wagmi.sh/react/api/hooks/useSwitchChain
   */
  const mutationSwitchChain = useSwitchChain()

  /**
   * Bridge flow - burn step mutation
   * The user must confirms this transaction in their wallet
   */
  const mutationBurnTokens = useWriteContract({
    mutation: {
      onSuccess() {
        // Refetch balance
        queryClient.invalidateQueries({ queryKey: args.tokenBalanceQueryKey })

      },
    }
  })

  /**
   * Bridge flow - sending request mutation
   * Sends a request to the backend (`POST /bridge`)
   */
  const mutationSendBridgeRequest = useMutation({
    mutationFn: async (args: SubmitBridgeRequestMintParams) => {
      // for some reason types got broken here
      //@ts-ignore
      return await apiClient.bridge.post({
        transaction_hash: args.hash as `0x${string}`,
        source: args.source,
        destination: args.destination,
      })
    },
  })

  /**
   * Complete bridge flow mutation
   * Combines switching chain (if needed), burn request, and sending bridge request to the backend
   */
  const mutationBridgeFlow = useMutation({
    mutationFn: async (args: SubmitBridgeRequestBurnParams) => {
      const sourceChainId = SUPPORTED_CHAINS[args.source].id
      if (
        [
          mutationSwitchChain.status,
          mutationBurnTokens.status,
          mutationSendBridgeRequest.status,
        ].includes('pending')
      )
        return

      // Switch network if necessary
      if (accountData?.chainId !== SUPPORTED_CHAINS[args.source].id) {
        await mutationSwitchChain.switchChainAsync({
          chainId: sourceChainId,
        })
      }

      const tokenToBurn = tokenList.tokenMap[args.tokenId]
      let hash

      /**
       * Avoid re-burning tokens (in case user burned theirs tokens already but the backend failed to process the transaction)
       */
      if (mutationBurnTokens.data) hash = mutationBurnTokens.data
      else {
        hash = await mutationBurnTokens.writeContractAsync({
          abi: abiSimpleERC2O,
          address: tokenToBurn.address as `0x${string}`,
          functionName: 'burn',
          chainId: sourceChainId,
          args: [parseUnits(String(args.amount), tokenToBurn.decimals)],
        })
      }

      if (hash && mutationSendBridgeRequest.status !== 'success') {
        const request = await mutationSendBridgeRequest.mutateAsync({
          source: args.source,
          destination: args.destination,
          hash,
        })
        return request?.data
      }
      throw Error('Burn not proceeded correctly')
    },
    onSuccess() {
      mutationBurnTokens.reset()
      mutationSendBridgeRequest.reset()
    }
  })

  /**
   * Submission flow helper function
   * This function triggers the bridge flow mutation
   */
  async function handleSubmitRequest(args: SubmitBridgeRequestBurnParams) {
    if (mutationBridgeFlow.status === 'pending') return
    else if (
      (args.amount !== mutationBridgeFlow.variables?.amount ||
      args.destination !== mutationBridgeFlow.variables.destination ||
      args.source !== mutationBridgeFlow.variables.source ||
      args.tokenId !== mutationBridgeFlow.variables.tokenId) ||
      mutationBridgeFlow?.status === 'success'
    ) {
      // Reset mutations if args changed or if bridging was successful
      mutationBridgeFlow.reset()
      mutationBurnTokens.reset()
      mutationSendBridgeRequest.reset()
      mutationSwitchChain.reset()
    }
    await mutationBridgeFlow.mutateAsync(args)
  }
  return {
    handleSubmitRequest,
    mutationBridgeFlow,
    mutationBurnTokens,
    mutationSendBridgeRequest,
    mutationSwitchChain,
  }
}

export { useRequestBridge, type ValidSelectedToken }

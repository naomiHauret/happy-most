import abiSimpleERC2O from '@happy/abis/SimpleERC20'
import { SUPPORTED_CHAINS, type SupportedChainsAliases } from '@happy/chains'
import tokenList from '@happy/token-lists/bridge'
import { isAddress, parseEventLogs, type TransactionReceipt } from 'viem'
import { type ValidTokenId } from '../helpers'
import { publicClient } from '../config'
import { mint } from './mint'

/**
 * 1. Get receipt from tx hash and parse the burn event on source chain
 * 2. Mint the amount of the corresponding ERC20 contract on destination chain.
 * 3. Return destination chain transaction hash to the frontend
 */
async function bridgeTokens(args: {
  transaction_hash: `0x${string}`
  source: SupportedChainsAliases
  destination: SupportedChainsAliases
}) {
  const sourceChainId = SUPPORTED_CHAINS[args.source].id as number
  const destinationChainId = SUPPORTED_CHAINS[args.destination].id as number

  const client = publicClient?.[sourceChainId]
  // 1. Get transaction receipt
  const receipt = (await client?.waitForTransactionReceipt({
    hash: args.transaction_hash,
  })) as TransactionReceipt

  // 2. Parse logs. Burn events are just a `Transfer` event with `0x0000000000000000000000000000000000000000` as the receiver
  // @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc20#ERC20-_burn-address-uint256-
  const logs = parseEventLogs({
    abi: abiSimpleERC2O,
    eventName: ['Transfer'],
    logs: receipt?.logs,
    args: {
      to: '0x0000000000000000000000000000000000000000',
    },
  })
  const event = logs?.[0]
  if (event) {
    // Extract params to mint the tokens (destination contract address, amount of tokens)
    const tokenContractAddressOnSourceChain = event?.address
    const sourceTokenId = `${sourceChainId}_${tokenContractAddressOnSourceChain}`
    const tokenSourceChain = tokenList.tokenMap?.[sourceTokenId as ValidTokenId]
    const tokenContractAddressOnDestinationChain = (tokenSourceChain?.extensions?.bridge as any)?.[
      `${destinationChainId}`
    ]?.tokenAddress
    if (isAddress(tokenContractAddressOnDestinationChain)) {
      // this is not really necessary but it adds another layer of verification

      const { from, value } = (event as any)?.args
      const tokenId =
        `${destinationChainId}_${tokenContractAddressOnDestinationChain}` as ValidTokenId
      // 3. Mint the tokens for the user on the destination chain
      return await mint({
        destinationWalletAddress: from, // we assume the receiver is the same wallet to simplify things, but it could be set as a parameter in the request
        tokenId,
        amount: value,
      })
    }
  }
  throw Error("Transaction couldn't be processed")
}

export { bridgeTokens }

import { useAccount, useReadContract } from 'wagmi'
import abiSimpleERC2O from '@happy/abis/SimpleERC20'
import { formatUnits, isAddress } from 'viem'

function useSelectedTokenDetails(args: {
  chainId: number
  selectedToken?: {
    address: `0x${string}`
    decimals: number
  }
  accountAddress?: `0x${string}`
}) {
  const account = useAccount()
  const balanceOf = useReadContract({
    abi: abiSimpleERC2O,
    chainId: args.chainId,
    address: args?.selectedToken?.address,
    functionName: 'balanceOf',
    args: [account?.address],
    query: {
      refetchOnWindowFocus: true,
      select(data): { value: bigint; formatted: string; decimals: number } {
        return {
          value: (data as bigint) ?? 0n,
          formatted: `${formatUnits(data as bigint, args?.selectedToken?.decimals as number)}`,
          decimals: args?.selectedToken?.decimals as number,
        }
      },
      // Only run the query if the contract address is valid and there's an account connected
      enabled: Boolean(isAddress(`${args?.selectedToken?.address}`) && account.isConnected),
    },
  })

  return {
    queryBalanceOf: balanceOf,
  }
}

export { useSelectedTokenDetails }

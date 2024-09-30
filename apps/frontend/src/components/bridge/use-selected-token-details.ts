import { useAccount, useReadContract } from 'wagmi'
import abiSimpleERC2O from '@happy/abis/SimpleERC20'
import { formatUnits, isAddress } from 'viem'
import { useMemo } from 'react'

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
      // Only run the query if the contract address is valid and there's an account connected
      enabled: Boolean(isAddress(`${args?.selectedToken?.address}`) && account.isConnected),
    },
  })

  const formattedBalance = useMemo(() => {
    if (balanceOf?.data) {
      return `${formatUnits(balanceOf?.data as bigint, args?.selectedToken?.decimals as number)}`
    }
    return '0'
  }, [balanceOf?.data])

  return {
    formatted: formattedBalance,
    queryBalanceOf: balanceOf,
  }
}

export { useSelectedTokenDetails }

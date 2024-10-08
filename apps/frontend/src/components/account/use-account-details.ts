import { SUPPORTED_CHAINS } from '@happy/chains'
import { useMemo } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatUnits } from 'viem'

function shortenEthereumAddress(
  address: string,
  showAmountAtStart?: number,
  showAmountAtEnd?: number,
) {
  let shortenedAddress = address
  const shortenedLength = showAmountAtStart ?? 4
  const front = address.substr(0, shortenedLength)
  const mid = '...'
  const final = address.substr(showAmountAtEnd ? showAmountAtEnd * -1 : -2)
  shortenedAddress = front + mid + final
  return shortenedAddress
}

function useAccountDetails() {
  const account = useAccount()
  const balance = useBalance({
    address: account?.address,
    query: {
      select(data) {
        return {
          decimals: data?.decimals,
          value: data?.value,
          symbol: data?.symbol,
          formatted: `${formatUnits(data?.value, data?.decimals)}`,
        }
      },
    },
  })

  const shortenedAddress = useMemo(() => {
    if (!account.address) return ''
    return shortenEthereumAddress(account?.address as `0x${string}`, 3, 4)
  }, [account.address])

  const isSupportedNetwork = useMemo(() => {
    if (!account.chainId) return false
    const supportedChains = Object.values(SUPPORTED_CHAINS).map((chain) => chain.id)
    return supportedChains.includes(account?.chainId)
  }, [account.chainId])

  return { gasBalance: balance, shortenedAddress, isSupportedNetwork }
}

export { useAccountDetails }

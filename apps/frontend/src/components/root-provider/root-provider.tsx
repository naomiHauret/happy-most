import { QueryClientProvider } from '@tanstack/react-query'
import { FC, type PropsWithChildren } from 'react'
import { WagmiProvider } from 'wagmi'
import { tanstackQueryClient, wagmiConfig } from '~/config'

interface RootProviderProps extends PropsWithChildren {}

/**
 * Setup global providers
 */
const RootProvider: FC<RootProviderProps> = (props) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={tanstackQueryClient}>{props.children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export { RootProvider }

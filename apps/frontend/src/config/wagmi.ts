import { http, createConfig } from 'wagmi'
import { SUPPORTED_CHAINS } from '@happy/chains'
import { injected, metaMask } from 'wagmi/connectors'

const config = createConfig({
  chains: [SUPPORTED_CHAINS.happychain_sepolia, SUPPORTED_CHAINS.op_sepolia],
  connectors: [injected(), metaMask()],
  transports: {
    [SUPPORTED_CHAINS.happychain_sepolia.id]: http(),
    [SUPPORTED_CHAINS.op_sepolia.id]: http(),
  },
})

export { config as wagmiConfig }

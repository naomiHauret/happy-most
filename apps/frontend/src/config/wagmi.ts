import { http, createConfig } from 'wagmi'
import { SUPPORTED_CHAINS } from '@happy/chains'

const config = createConfig({
  chains: [SUPPORTED_CHAINS.happyChainSepolia, SUPPORTED_CHAINS.optimismSepolia],
  transports: {
    [SUPPORTED_CHAINS.happyChainSepolia.id]: http(),
    [SUPPORTED_CHAINS.optimismSepolia.id]: http(),
  },
})

export { config as wagmiConfig }

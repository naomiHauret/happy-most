import { optimismSepolia } from 'viem/chains'
import { chain as happyChainSepolia } from './happychain-sepolia'

enum SupportedChainsAliases {
  HappyChainSepolia = 'happychain_sepolia',
  OptimismSepolia = 'op_sepolia',
}
const SUPPORTED_CHAINS = {
  [SupportedChainsAliases.HappyChainSepolia]: happyChainSepolia,
  [SupportedChainsAliases.OptimismSepolia]: optimismSepolia,
}
const SUPPORTED_CHAINS_ICONS = {
  [happyChainSepolia.id]: 'https://chainlist.org/unknown-logo.png',
  [optimismSepolia.id]: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
}
const DEFAULT_CHAIN = happyChainSepolia

export { SUPPORTED_CHAINS, DEFAULT_CHAIN, SUPPORTED_CHAINS_ICONS, SupportedChainsAliases }

import { optimismSepolia } from "viem/chains";
import { chain as happyChainSepolia } from "./happychain-sepolia";

enum SupportedChainsAliases {
  HappyChainSepolia = "happyChainSepolia",
  OptimismSepolia = "optimismSepolia"
}
const SUPPORTED_CHAINS = {
  [SupportedChainsAliases.HappyChainSepolia]: happyChainSepolia,
  [SupportedChainsAliases.OptimismSepolia]: optimismSepolia
};

const DEFAULT_CHAIN = happyChainSepolia;

export { SUPPORTED_CHAINS, DEFAULT_CHAIN };

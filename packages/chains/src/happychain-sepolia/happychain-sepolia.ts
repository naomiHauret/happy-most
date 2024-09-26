import { ChainContract, defineChain } from 'viem'
import { chainConfig } from 'viem/op-stack'
import contracts from './contracts.json'
import rollup from './rollup.json'
import definition from './definition.json'

/**
 * Shameless copy/paste from https://raw.githubusercontent.com/HappyChainDevs/happychain/3b650e7b3674f07219b538c63d97bd03f1ce33cd/packages/sdk-shared/lib/chains/definitions/happyChainSepolia.ts?token=GHSAT0AAAAAACVWD6F2TKUXTYREUNIXF77OZXT55FQ
 * Chain definition should be imported from @happychain/sdk-shared but this package is not published at the moment
 */

const sourceId = rollup.l1_chain_id
const chain = defineChain({
  ...chainConfig,
  id: Number(definition.chainId),
  name: definition.chainName,
  nativeCurrency: definition.nativeCurrency,
  rpcUrls: {
    default: {
      http: definition.rpcUrls.filter((a) => a.startsWith('https')),
      ws: definition.rpcUrls.filter((a) => a.startsWith('ws')),
    },
  },
  blockExplorers: {
    default: {
      name: `${definition.chainName} Explorer`,
      url: definition.blockExplorerUrls[0],
    },
  },
  contracts: {
    ...chainConfig.contracts,
    disputeGameFactory: {
      [sourceId]: {
        address: contracts.DisputeGameFactoryProxy,
      },
    } as ChainContract,
    l2OutputOracle: {
      [sourceId]: {
        address: contracts.L2OutputOracleProxy,
      } as ChainContract,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 4286263,
    },
    portal: {
      [sourceId]: {
        address: contracts.OptimismPortalProxy,
      } as ChainContract,
    },
    l1StandardBridge: {
      [sourceId]: {
        address: contracts.L1StandardBridgeProxy,
      } as ChainContract,
    },
  },
  sourceId,
})

export { chain }

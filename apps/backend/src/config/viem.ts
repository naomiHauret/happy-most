import { SUPPORTED_CHAINS } from '@happy/chains'
import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const controllerAccount = privateKeyToAccount(import.meta.env.PRIVATE_KEY_MANAGER as `0x${string}`)

/**
 * Creates public and wallet clients for all supported chains.
 * @returns A tuple containing two objects:
 *   1. An object mapping chain IDs to PublicClients
 *   2. An object mapping chain IDs to WalletClients
 */
function createMultichainClients(): {
  publicClient: Record<number, PublicClient>
  controllerWalletClient: Record<number, WalletClient>
} {
  const publicClient: Record<number, PublicClient> = {}
  const controllerWalletClient: Record<number, WalletClient> = {}

  for (const [, chain] of Object.entries(SUPPORTED_CHAINS)) {
    publicClient[chain.id] = createPublicClient({
      chain,
      transport: http(),
    })

    controllerWalletClient[chain.id] = createWalletClient({
      account: controllerAccount,
      chain,
      transport: http(),
    })
  }

  return { publicClient, controllerWalletClient }
}

const { publicClient, controllerWalletClient } = createMultichainClients()

export { controllerWalletClient, publicClient, controllerAccount }

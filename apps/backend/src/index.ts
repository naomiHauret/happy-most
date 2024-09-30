import { Elysia, error } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { SUPPORTED_CHAINS, SupportedChainsAliases } from '@happy/chains'
import { BridgeRequestParametersSchema, MakeItRainRequestParametersSchema } from './helpers'
import { mint } from './features/mint'
import { publicClient } from './config'
import { bridgeTokens } from './features/bridge'

const transactions: Record<SupportedChainsAliases, Array<string>> = {
  [SupportedChainsAliases.HappyChainSepolia]: [],
  [SupportedChainsAliases.OptimismSepolia]: [],
}

/**
 *  We need to create this extra type since there's currently an issue with Elysia recognizing unions
 *  @see issue https://github.com/elysiajs/elysia/issues/848
 * @todo remove this when the issue is solved
 * */
type BridgeRequestPayload = {
  body: {
    transaction_hash: string
    source: SupportedChainsAliases
    destination: SupportedChainsAliases
  }
}

const app = new Elysia()
  .use(cors())
  .use(swagger())

  .post(
    '/bridge',
    async ({ body: { transaction_hash, source, destination } }) => {
      const txRequest = await bridgeTokens({
        transaction_hash: transaction_hash as `0x${string}`,
        source,
        destination,
      })

      if (!txRequest?.hash || !txRequest?.chain) throw new Error('Operation failed')

      return {
        mint: {
          transaction_hash: txRequest.hash,
          block_explorer: SUPPORTED_CHAINS[destination as SupportedChainsAliases].blockExplorers?.default
        },
        burn: {
          transaction_hash: transaction_hash,
          block_explorer: SUPPORTED_CHAINS[source as SupportedChainsAliases].blockExplorers?.default
        },
      }
    },
    {
      beforeHandle({ body }: BridgeRequestPayload) {
        // check the transaction wasn't processed already
        if (transactions[body.source].includes(body.transaction_hash))
          return error(409, 'Transaction already processed')
        if (body?.source && body?.transaction_hash)
          transactions[body?.source].push(body?.transaction_hash)
      },
      body: BridgeRequestParametersSchema,
    },
  )
  .post(
    '/make-it-rain',
    /**
     * Get test tokens to try the bridge
     */
    async ({ body: { receiver_wallet_address, token_id } }) => {
      const txRequest = await mint({
        destinationWalletAddress: receiver_wallet_address as `0x${string}`,
        tokenId: token_id,
        amount: 10,
      })
      if (!txRequest?.hash || !txRequest?.chain) throw new Error('Operation failed')
      const receipt = await publicClient[txRequest.chain]?.waitForTransactionReceipt({
        hash: txRequest.hash,
      })

      return {
        transaction_hash: receipt?.transactionHash,
      }
    },
    {
      body: MakeItRainRequestParametersSchema,
    },
  )
  .listen(process.env.PORT ?? 3000)

console.log(`Elysia server running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app

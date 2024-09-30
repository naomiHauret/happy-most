import { SupportedChainsAliases } from '@happy/chains'
import tokenList from '@happy/token-lists/bridge'
import { t } from 'elysia'

type ValidTokenId = keyof typeof tokenList.tokenMap

// Transaction Hash
const TransactionHashType = t.String({
  pattern: '^0x[a-fA-F0-9]{64}$',
  errorMessage: 'Invalid transaction hash format',
})

// All valid token symbols
const ValidTokenIdType = t.Union(
  Object.keys(tokenList.tokenMap).map((key) => t.Literal(key)),
  {
    errorMessage: {
      type: 'Invalid token. Please provide a valid token from the supported list.',
    },
  },
)

// Ethereum address validation
const EthereumAddressType = t.String({
  pattern: '^0x[a-fA-F0-9]{40}$',
  errorMessage: 'Invalid Ethereum address format',
})

/**
 * Return a schema of all possible bidirectional combinations of supported chains
 */
function createBidirectionalChainCombinations() {
  const chains = Object.values(SupportedChainsAliases)
  return chains.flatMap((chain1, index) =>
    chains.slice(index + 1).flatMap((chain2) => [
      t.Object({
        source: t.Literal(chain1),
        destination: t.Literal(chain2),
        transaction_hash: TransactionHashType,
      }),
      t.Object({
        source: t.Literal(chain2),
        destination: t.Literal(chain1),
        transaction_hash: TransactionHashType,
      }),
    ]),
  )
}

const BridgeRequestParametersSchema = t.Union(createBidirectionalChainCombinations())
const MakeItRainRequestParametersSchema = t.Object({
  receiver_wallet_address: EthereumAddressType,
  token_id: ValidTokenIdType,
})

export { BridgeRequestParametersSchema, MakeItRainRequestParametersSchema, type ValidTokenId }

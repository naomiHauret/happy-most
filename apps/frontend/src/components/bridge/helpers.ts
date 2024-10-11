import tokenList from '@happy/token-lists/bridge'

enum BridgeSearchParams {
  SourceChain = 'bridge-source',
  DestinationChain = 'bridge-destination',
  QueryToken = 'bridge-query-search-token',
  SelectedToken = 'bridge-selected-token',
  SelectedTokenAmount = 'bridge-selected-token-amount',
}

type ValidSelectedToken = keyof typeof tokenList.tokenMap
type TokenInfo = (typeof tokenList.tokenMap)[ValidSelectedToken]

export { BridgeSearchParams, type TokenInfo, type ValidSelectedToken }

import { SUPPORTED_CHAINS, SupportedChainsAliases } from '@happy/chains'
import { type FC } from 'react'
import { type Config, type Connector, type UseConnectReturnType, useAccount } from 'wagmi'
import { ConnectWallet } from './connect-wallet'
import { AccountMobile } from './account-mobile'
import { AccountDesktop } from './account-desktop'

interface AccountProps {
  preferredChainUrlSearchParamKey?: string // allow us to connect to a specific chain based on url searchparam
}
/**
 * Renders either the connection button or the account popover, based on the connection status.
 */
const Account: FC<AccountProps> = (props) => {
  const account = useAccount()
  const { preferredChainUrlSearchParamKey } = props
  if (account.isDisconnected || account?.isConnecting)
    return (
      <ConnectWallet
        connectWithChain={(args: {
          connection: UseConnectReturnType<Config, unknown>
          connector: Connector
        }) => {
          let chainId = SUPPORTED_CHAINS.happychain_sepolia.id

          if (props?.preferredChainUrlSearchParamKey) {
            let chain = new URLSearchParams(window.location.search).get(
              preferredChainUrlSearchParamKey as string,
            )
            chainId = SUPPORTED_CHAINS[chain as SupportedChainsAliases].id
          }
          args.connection.connect({ connector: args.connector, chainId })
        }}
      />
    )
  if (account.isConnected || account.isReconnecting)
    return (
      <>
        <div className="sm:hidden">
          <AccountMobile />
        </div>
        <div className="hidden z-10 sm:block">
          <AccountDesktop />
        </div>
      </>
    )
}

export { Account }

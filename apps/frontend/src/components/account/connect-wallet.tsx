import { useState, type FC } from 'react'
import { Button, Dialog } from '@happy/uikit-react'
import {
  type Config,
  type Connector,
  type UseConnectReturnType,
  useAccount,
  useAccountEffect,
  useConnect,
} from 'wagmi'
import { cva } from 'class-variance-authority'

const recipeIconWalletWrapper = cva('absolute h-7 start-2 top-1/2 -translate-y-1/2', {
  variants: {
    status: {
      idle: '',
      pending: 'opacity-0',
    },
    icon: {
      default: '',
      none: 'bg-neutral-11/10 aspect-square rounded-lg',
    },
  },
  defaultVariants: {
    status: 'idle',
  },
})
interface ConnectWalletProps {
  connectWithChain: (args: {
    connection: UseConnectReturnType<Config, unknown>
    connector: Connector
  }) => void
}
/**
 * Connect wallet modal
 */
const ConnectWallet: FC<ConnectWalletProps> = (props) => {
  const { connectWithChain } = props
  const account = useAccount()
  const connection = useConnect()
  const visibility = useState(false)
  const [, setIsConnectModalOpen] = visibility
  useAccountEffect({
    onConnect() {
      setIsConnectModalOpen(false)
    },
    onDisconnect() {},
  })
  return (
    <>
      <Button
        intent="outline"
        className="text-sm min-h-8"
        isLoading={account.status === 'connecting'}
        onClick={() => {
          setIsConnectModalOpen(true)
        }}
      >
        Sign-in
      </Button>
      <Dialog
        visibility={visibility}
        title="Connect your wallet"
        scale="small"
        description="Click on a your preferred wallet to continue."
      >
        <ul className="text-[1.25em] grid gap-3">
          {connection.connectors.map((connector) => {
            const actionConnector = connection.variables?.connector as Connector
            const isLoading =
              connection.status === 'pending' && actionConnector?.uid === connector.uid
            return (
              <li className="relative" key={connector.uid}>
                <div
                  className={recipeIconWalletWrapper({
                    status: isLoading ? 'pending' : 'idle',
                    icon: connector?.icon ? 'default' : 'none',
                  })}
                >
                  {connector?.icon && (
                    <img className="h-full object-contain" src={connector?.icon} />
                  )}
                </div>
                <Button
                  data-widget="wallet"
                  className={`overflow-ellipsis ${isLoading ? '[&_[data-loader]]:-translate-x-2' : ''} w-full min-h-12`}
                  aria-disabled={connection.status === 'pending'}
                  isLoading={isLoading}
                  intent={isLoading ? 'ghost-primary' : 'outline'}
                  onClick={() => {
                    if (connection.status === 'pending') return
                    connectWithChain({ connector, connection })
                  }}
                >
                  {/**
                   * Trick to avoid layout shift
                   */}
                  <span className="opacity-0 max-w-3/4" aria-hidden="true">
                    {' '}
                    {connector.uid === 'injected' ? 'Browser extension' : connector.name}
                  </span>
                  <span className="absolute top-1/2 start-12 max-w-3/4 -translate-y-1/2">
                    {connector.uid === 'injected' ? 'Browser extension' : connector.name}
                  </span>
                </Button>
              </li>
            )
          })}
        </ul>
      </Dialog>
    </>
  )
}

export { ConnectWallet }

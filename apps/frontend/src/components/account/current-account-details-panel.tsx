import { Clipboard, Collapsible } from '@ark-ui/react'
import { Button, recipeBox, recipeButton, type ButtonVariantsProps } from '@happy/uikit-react'
import { type FC } from 'react'
import { BiCheck, BiCopy, BiLinkExternal, BiPowerOff, BiSolidError } from 'react-icons/bi'
import { useAccount, useBalance, useSwitchChain } from 'wagmi'
import { disconnect } from 'wagmi/actions'
import { wagmiConfig } from '~/config'
import { useAccountDetails } from './use-account-details'
import { SUPPORTED_CHAINS_ICONS } from '@happy/chains'

interface AccountDetailsPanelProps {
  switchButtonVariantsProps?: ButtonVariantsProps
  id: string
}

/**
 * Displays currently connect wallet account information (address, balance)
 * Allow user to switch network
 * Allow user to copy their wallet address
 * Allow user to view their account details on the chain explorer
 */
const AccountDetailsPanel: FC<AccountDetailsPanelProps> = (props) => {
  const account = useAccount()
  const mutationSwitchChain = useSwitchChain()
  const balance = useBalance({
    address: account.address,
  })
  const { isSupportedNetwork, shortenedAddress, formattedBalance } = useAccountDetails()
  return (
    <div className="flex flex-col gap-2 sm:gap-1">
      <div className="relative gap-2 leading-tight flex flex-col">
        <div className="flex gap-2 pe-[12ex] w-full text-sm sm:text-xs">
          <div className="w-5 aspect-square">
            {isSupportedNetwork ? (
              <>
                <img
                  className="w-full h-auto"
                  width="20"
                  height="20"
                  loading="lazy"
                  src={SUPPORTED_CHAINS_ICONS[account?.chain?.id as number]}
                  alt={account.chain?.name}
                />
              </>
            ) : (
              <span className="text-negative-9 text-[1.25rem] sm:text-root">
                <BiSolidError />
                <span className="sr-only">This network is not supported.</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-neutral-11 font-bold">
              {isSupportedNetwork && account?.chain?.name ? (
                <>{account?.chain?.name}</>
              ) : (
                <>Unsupported network</>
              )}
            </span>
            <span
              className={`text-neutral-11/60 text-xs ${balance?.status === 'pending' && isSupportedNetwork ? 'animate-pulse' : ''}`}
            >
              {isSupportedNetwork && account?.chain?.name ? (
                <>
                  {formattedBalance && (
                    <>
                      <span className="sr-only">Your balance:</span>{' '}
                      {new Intl.NumberFormat(navigator.languages[0], {
                        maximumFractionDigits: 10,
                      }).format(+formattedBalance)}{' '}
                      {balance.data?.symbol}
                    </>
                  )}
                  {account.address && balance?.status === 'pending' && <>Fetching balance...</>}
                  {balance?.status === 'error' && (
                    <>
                      Couldn't fetch your {account?.chain?.nativeCurrency?.symbol ?? 'token'}{' '}
                      balance.
                    </>
                  )}
                </>
              ) : (
                <>Please switch to a supported network</>
              )}
            </span>
          </div>
        </div>
        <Collapsible.Root defaultOpen={!isSupportedNetwork} className="w-full">
          <Collapsible.Trigger
            className={recipeButton({
              intent: 'neutral',
              class: `absolute text-xs end-0 top-0 ${mutationSwitchChain?.isPending ? 'animate-pulse' : ''}`,
              ...props.switchButtonVariantsProps,
            })}
          >
            Switch
          </Collapsible.Trigger>
          <Collapsible.Content className="motion-safe:[&[data-state=closed]]:animate-collapseUp motion-safe:[&[data-state=open]]:animate-collapseDown">
            <ul className="list-none flex flex-col gap-2">
              {mutationSwitchChain.chains.map((supportedChain) => (
                <li
                  className="focus-within:ring-2 focus-within:ring-primary-9/25 rounded-lg"
                  key={`switch-to-${supportedChain.id}-${props.id}`}
                >
                  <Button
                    isLoading={
                      mutationSwitchChain.isPending &&
                      supportedChain.id === mutationSwitchChain.variables.chainId
                    }
                    aria-disabled={
                      mutationSwitchChain.isPending || supportedChain.id === account?.chainId
                    }
                    onClick={async () => {
                      if (mutationSwitchChain.isPending || supportedChain.id === account?.chainId)
                        return
                      mutationSwitchChain.reset()
                      await mutationSwitchChain.switchChain({
                        chainId: supportedChain.id,
                      })
                    }}
                    intent="outline"
                    className="min-h-10 gap-2 w-full text-sm"
                  >
                    <span className="flex w-4 sm:w-3 aspect-square">
                      <img
                        className="w-full h-auto"
                        width="20"
                        height="20"
                        loading="lazy"
                        src={SUPPORTED_CHAINS_ICONS[account?.chain?.id as number]}
                        alt={account.chain?.name}
                      />
                    </span>
                    <span>{supportedChain.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
      <div
        className={recipeBox({
          layer: '2',
          demarcation: 'strong',
          scale: 'small',
          class: 'ps-2 py-1.5 pe-1.5 flex flex-col gap-3 sm:gap-1.5',
        })}
      >
        {account?.connector?.name && (
          <div className="px-1">
            <p className="text-sm sm:text-xs text-neutral-11/60">
              Connected with {account?.connector?.name}
            </p>
          </div>
        )}
        <p className="font-bold px-1 overflow-ellipsis overflow-hidden max-w-3/4 text-sm sm:text-xs text-neutral-11">
          {account?.address}
        </p>
        <div className="grid grid-cols-2 sm:flex items-center gap-4 flex-wrap">
          <Clipboard.Root timeout={1500} value={account?.address}>
            <Clipboard.Label className="sr-only">Copy your Ethereum address</Clipboard.Label>
            <Clipboard.Control>
              <Clipboard.Trigger className="rounded-md focus:outline-none p-1 sm:py-0.5 sm:pe-2 hover:bg-mix-amount-5 hover:bg-mix-neutral-11 focus:bg-mix-amount-8 focus:bg-mix-neutral-11 flex w-full min-h-8 text-neutral-11/60 items-center gap-1">
                <Clipboard.Indicator copied={<BiCheck />}>
                  <BiCopy />
                </Clipboard.Indicator>
                <span className="text-xs sm:text-2xs text-neutral-11">Copy address</span>
              </Clipboard.Trigger>
            </Clipboard.Control>
          </Clipboard.Root>
          <div>
            {isSupportedNetwork && (
              <a
                href={`${account?.chain?.blockExplorers?.default?.url}/address/${account?.address}`}
                className="flex items-center focus:outline-none p-1 sm:py-0.5 sm:pe-2 rounded-md hover:bg-mix-amount-5 hover:bg-mix-neutral-11 focus:bg-mix-amount-8 focus:bg-mix-neutral-11 text-neutral-11/60 gap-1 min-h-8"
                target="_blank"
                rel="nofollow noopener"
              >
                <BiLinkExternal />
                <span className="text-xs sm:text-2xs text-neutral-11">View on explorer</span>
              </a>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          disconnect(wagmiConfig)
        }}
        className="text-negative-9 leading-none rounded-lg py-2 px-3 flex items-center gap-2 hover:bg-negative-9/10 focus:bg-negative-9/15 focus:outline-none focus:ring-4 text-xs focus:ring-negative-9/10"
      >
        <BiPowerOff />
        <span className="text-sm sm:text-xs">Disconnect</span>
      </button>
    </div>
  )
}

export { AccountDetailsPanel }

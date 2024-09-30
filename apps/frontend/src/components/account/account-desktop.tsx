import { Popover } from '@ark-ui/react'
import { recipePopover } from '@happy/uikit-react'
import { cva } from 'class-variance-authority'
import { type FC } from 'react'
import { useBalance, useAccount } from 'wagmi'
import { BiChevronDown, BiSolidError } from 'react-icons/bi'
import { AccountDetailsPanel } from './current-account-details-panel'
import { useAccountDetails } from './use-account-details'
import { SUPPORTED_CHAINS_ICONS } from '@happy/chains'

const label = cva('p-2.5 hidden lg:flex items-center text-xs', {
  variants: {
    status: {
      idle: '',
      pending: 'animate-pulse',
    },
    network: {
      default: 'text-neutral-11/60',
      unsupported: 'text-negative-9',
    },
  },
  defaultVariants: {
    status: 'idle',
  },
})

/**
 * Trigger and view element for account detail on desktop
 */
const AccountDesktop: FC = () => {
  const account = useAccount()
  const balance = useBalance({
    address: account.address,
  })
  const { formattedBalance, shortenedAddress, isSupportedNetwork } = useAccountDetails()
  return (
    <Popover.Root>
      <Popover.Trigger className="flex items-stretch gap-1.5 lg:gap-3 [&[data-state=open]_[data-part=account-address]]:border-neutral-11/10 [&[data-state=open]_[data-part=account-address]]:text-neutral-11 [&[data-state=open]_[data-part=account-address]]:bg-mix-neutral-11 [&[data-state=open]_[data-part=account-address]]:bg-mix-amount-5">
        <span
          data-part="account-address"
          className="flex gap-2 text-xs py-1.5 items-center ps-2 pe-3 rounded-md border text-neutral-11/60 border-transparent bg-neutral-1/80"
        >
          {shortenedAddress}
          <Popover.Indicator className="[&[data-state=open]]:rotate-180">
            <BiChevronDown />
          </Popover.Indicator>
        </span>
        <span className="flex text-xs rounded-md border text-neutral-11/60 border-transparent bg-neutral-1/80">
          <span className="w-9 flex items-center rounded-md lg:rounded-e-none justify-center bg-mix-neutral-11 bg-mix-amount-10 aspect-square">
            <span className="flex justify-center items-center w-5 aspect-square">
              {!isSupportedNetwork ? (
                <span className="text-negative-9 text-lg">
                  <BiSolidError />
                  <span className="sr-only">This network is not supported.</span>
                </span>
              ) : (
                <img
                  className="w-full h-auto"
                  width="20"
                  height="20"
                  loading="lazy"
                  src={SUPPORTED_CHAINS_ICONS[account?.chain?.id as number]}
                  alt={account.chain?.name}
                />
              )}
            </span>
          </span>
          <span
            className={label({
              status: balance?.status === 'pending' ? 'pending' : 'idle',
              network: isSupportedNetwork ? 'default' : 'unsupported',
            })}
          >
            {isSupportedNetwork && account?.address ? (
              <>
                {formattedBalance && (
                  <>
                    <span className="sr-only">Your balance:</span>{' '}
                    {new Intl.NumberFormat(navigator.languages[0], {
                      maximumSignificantDigits: 2,
                    }).format(+formattedBalance)}{' '}
                    {balance?.data?.symbol}
                  </>
                )}
                {!balance?.data && balance?.status === 'pending' && (
                  <>
                    <span className="sr-only">Fetching balance...</span>
                  </>
                )}
                {balance?.status === 'error' && (
                  <>
                    <span className="sr-only">Something went wrong.</span>
                  </>
                )}
              </>
            ) : (
              <>Not connected</>
            )}
          </span>
        </span>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content className={`${recipePopover({ class: 'sm:p-1.5' })}`}>
          <Popover.Title className="sr-only">My account</Popover.Title>
          <Popover.Description className="sr-only">
            Information and actions you can perform with your connected account will be displayed
            here.
          </Popover.Description>
          <AccountDetailsPanel
            id="desktop"
            switchButtonVariantsProps={{
              scale: 'small',
            }}
          />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

export { AccountDesktop }

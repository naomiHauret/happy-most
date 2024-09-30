import { Dialog, Portal } from '@ark-ui/react'
import { type FC } from 'react'
import { recipeDialog } from '@happy/uikit-react'
import { AccountDetailsPanel } from './current-account-details-panel'
import { useAccountDetails } from './use-account-details'

/**
 * Trigger and view element for account detail on mobile
 */
const AccountMobile: FC = () => {
  const { shortenedAddress } = useAccountDetails()

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger className="focus:outline-none focus:ring-4 focus:ring-neutral-12 focus:ring-opacity-10 text-xs py-1.5 ps-2 pe-3 rounded-md border text-neutral-11/60 border-transparent [&[data-state=open]]:border-neutral-11/10 bg-neutral-1/80  [&[data-state=open]]:bg-mix-neutral-11 [&[data-state=open]]:bg-mix-amount-5">
          {shortenedAddress}
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[99] bg-base/75 motion-safe:[&[data-state=open]]:animate-fadeIn motion-safe:[&[data-state=closed]]:animate-fadeOut" />
          <Dialog.Positioner className="flex items-end sm:items-center justify-center h-dvh w-dvw fixed z-[99] inset-0">
            <Dialog.Content className={`px-2 pt-2 pb-6 ${recipeDialog({})}`}>
              <Dialog.Title className="sr-only">My account</Dialog.Title>
              <Dialog.Description className="sr-only">
                Information and actions you can perform with your connected account will be
                displayed here.
              </Dialog.Description>
              <Dialog.CloseTrigger className="sr-only">Close</Dialog.CloseTrigger>
              <AccountDetailsPanel id="mobile" />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}

export { AccountMobile }

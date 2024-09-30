import { Dialog as ArkDialog, Portal } from '@ark-ui/react'
import { type VariantProps, cva, cx } from 'class-variance-authority'
import { type FC, type ComponentProps } from 'react'
import { recipePanel } from '../panel'

const recipeDialogBase = cva(
  [
    'relative overflow-y-auto  w-full',
    '[&[data-state=open]]:flex flex-col',
    // animation
    'motion-safe:[&[data-state=open]]:animate-growIn',
    'motion-safe:[&[data-state=closed]]:animate-growOut',
  ],
  {
    variants: {
      scale: {
        default: 'max-sm:rounded-b-none max-h-[90vh] pb-3 sm:pb-0 sm:max-w-xl',
        small: 'max-sm:rounded-b-none max-h-[90vh] pb-3 sm:pb-0 sm:max-w-sm',
      },
    },
    defaultVariants: {
      scale: 'default',
    },
  },
)
type DialogPanelVariantsProps = VariantProps<typeof recipeDialogBase>

interface DialogPanelProps extends DialogPanelVariantsProps {}

/**
 * Brand styling for any UI element that implements a modal-like behaviour
 */
const recipeDialog = (props: DialogPanelProps) =>
  cx(recipePanel({ presentation: 'overlayed', scale: 'large' }), recipeDialogBase(props))

type DialogVariantsProps = VariantProps<typeof recipeDialog>

interface DialogProps extends ComponentProps<typeof ArkDialog.Root>, DialogVariantsProps {
  visibility: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  title: React.ReactNode
  description: string
  actions?: React.ReactNode
}

/**
 * An overlayed modal window that appears on top of the main content.
 */
const Dialog: FC<DialogProps> = (props) => {
  const { scale, ...modalProps } = props
  const { children, title, description, actions, visibility, ...arkModalApiProps } = modalProps
  const [isOpen, setIsOpen] = visibility
  return (
    <ArkDialog.Root open={isOpen} onOpenChange={() => setIsOpen(false)} {...arkModalApiProps}>
      <Portal>
        <ArkDialog.Backdrop className="fixed inset-0 z-[99] bg-base/75 motion-safe:[&[data-state=open]]:animate-fadeIn motion-safe:[&[data-state=closed]]:animate-fadeOut" />
        <ArkDialog.Positioner className="flex items-end sm:items-center justify-center h-dvh w-dvw fixed z-[99] inset-0">
          <ArkDialog.Content
            className={recipeDialog({
              scale,
            })}
          >
            <div className="z-10 border-inherit border-b bg-inherit flex justify-between gap-4 sticky top-0">
              <ArkDialog.Title className="py-4 px-4 lg:px-5 font-bold text-neutral-12 text-lg inline-flex gap-3">
                {title}
              </ArkDialog.Title>
            </div>
            <ArkDialog.Description className="sr-only">{description}</ArkDialog.Description>

            <div className="p-4 lg:p-5 text-sm text-neutral-11 min-h-fit">{children}</div>
            {actions && (
              <div className="sticky bg-inherit bottom-[-1px] border-t border-neutral-11/10">
                {actions}
              </div>
            )}
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
Dialog.displayName = 'Dialog'
export { Dialog, recipeDialog, type DialogProps, type DialogVariantsProps }

import { type HTMLArkProps } from '@ark-ui/react'
import { cva, cx, type VariantProps } from 'class-variance-authority'
import { recipePanel } from '../panel'

/**
 * Brand styling for any UI element that implements a dropdown behaviour (select, dropdown, menu, combobox...)
 */
const recipeBaseDropdown = cva(
  [
    // Use group to target specific children element (in this case, [data-part=item-indicator])
    'group',
    // Clear
    '[&:is([aria-multiselectable=true]:not(:has([data-state=checked])))_[data-part=clear-trigger]]:font-bold',
    '[&:is([aria-multiselectable=true]:not(:has([data-state=checked])))_[data-part=clear-trigger]]:text-neutral-11',
    // List of dropdown options
    '[&_[data-part=item-group]]:flex [&_[data-part=item-group]]:flex-col',
    // Animation
    'motion-safe:[&[data-state=open]]:animate-appear motion-safe:[&[data-state=closed]]:animate-exit',
  ],
  {
    variants: {
      scale: {
        default: [
          'text-xs',
          'p-1',
          '[&_[data-part=clear-trigger]]:mb-1 [&_[data-part=item-group]]:gap-y-1',
          // Indicator (when dropdown has multi choice enabled)
          '[&:is([aria-multiselectable=true] [data-part=item-indicator])]:border',
          '[&:is([aria-multiselectable=true] [data-part=item-indicator])]:rounded-sm',
          '[&:is([aria-multiselectable=true] [data-part=item-indicator])]:w-5 [&:is([aria-multiselectable=true] [data-part=item-indicator])]:h-5',
        ],
      },
    },
    defaultVariants: {
      scale: 'default',
    },
  },
)
interface DropdownPanelProps extends VariantProps<typeof recipeBaseDropdown> {}
const recipeDropdown = (props: DropdownPanelProps) => cx(recipePanel(), recipeBaseDropdown(props))

/**
 * Styling recipe for any UI element that implements a selectable option behaviour
 */
const recipeDropdownItem = cva(
  [
    // Dropdown option/item
    'peer min-h-9 sm:min-h-[unset] flex items-center justify-between gap-4',
    'cursor-pointer [&:is(:disabled,[aria-disabled=true])]:cursor-not-allowed [&:is(:disabled,[aria-disabled=true])]:opacity-50',
    // Item indicator
    '[&_[data-part=item-indicator]]:flex [&_[data-part=item-indicator]]:flex [&_[data-part=item-indicator]]:justify-center [&_[data-part=item-indicator]]:items-center',
    '[&[data-state=checked]_[data-part=item-indicator]]:flex',
    '[&[data-state=unchecked]_[data-part=item-indicator]]:text-transparent',
    'group-[&:not([aria-multiselectable=true])]:[&[data-state=unchecked]_[data-part=item-indicator]]:opacity-0',
  ],
  {
    variants: {
      intent: {
        default: [
          // Dropdown option/item
          'text-neutral-11',
          '[&[data-highlighted]]:bg-primary-9/80 hover:bg-primary-9/10 [&[data-highlighted]]:text-neutral-1',
          '[&[data-highlighted][data-state=checked]_[data-part=item-indicator]]:text-neutral-1 [&[data-state=checked]_[data-part=item-indicator]]:text-primary-9',
          // Item indicator background (multiple choice only)
          'group-[[aria-multiselectable=true]]:[&[data-state=checked]]:[&_[data-part=item-indicator]]:bg-primary-9 group-[[aria-multiselectable=true]]:[&[data-state=checked]]:[&_[data-part=item-indicator]]:text-neutral-1',
          'group-[[aria-multiselectable=true]]:[&[data-state=unchecked]]:[&_[data-part=item-indicator]]:bg-primary-9/10',
          // Item indicator borders (multiple choice only)
          'group-[[aria-multiselectable=true]]:[&[data-state=checked]]:[&_[data-part=item-indicator]]:border-primary-11/75',
          'group-[[aria-multiselectable=true]]:[&[data-state=unchecked]]:[&_[data-part=item-indicator]]:border-primary-11/20',
        ],
      },
      scale: {
        default: [
          // Dropdown option/item
          'rounded-lg',
          'text-xs',
          'py-1.5 ps-3 pe-1.5',
          // Indicator
          '[&_[data-part=item-indicator]]:w-5',
          '[&_[data-part=item-indicator]]:h-5',
          // Indicator (multi only)
          'group-[[aria-multiselectable=true]]:[&_[data-part=item-indicator]]:border',
          'group-[[aria-multiselectable=true]]:[&_[data-part=item-indicator]]:rounded',
        ],
      },
    },
    defaultVariants: {
      intent: 'default',
      scale: 'default',
    },
  },
)

type DropdownVariantsProps = VariantProps<typeof recipeBaseDropdown>
type DropdownItemVariantsProps = VariantProps<typeof recipeDropdownItem>

interface DropdownProps extends HTMLArkProps<'div'>, DropdownVariantsProps {
  className?: string
}

interface DropdownItem extends DropdownItemVariantsProps {
  label: string
  value: any
  disabled?: boolean
}

export {
  recipeDropdown,
  recipeDropdownItem,
  type DropdownProps,
  type DropdownItem,
  type DropdownVariantsProps,
  type DropdownItemVariantsProps,
}

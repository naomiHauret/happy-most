import { type VariantProps, cva, cx } from 'class-variance-authority'
import { recipePanel } from '../panel'

const recipePopoverBase = cva('', {
  variants: {
    size: {
      default: 'p-1 text-xs',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type PopoverPanelVariantsProps = VariantProps<typeof recipePopoverBase>
interface PopoverPanelProps extends PopoverPanelVariantsProps {
  class: string
}

/**
 * Brand styling for any UI element that implements a popover-like behaviour
 */
const recipePopover = (props: PopoverPanelProps) =>
  cx(
    recipePanel(),
    recipePopoverBase(props),
    'motion-safe:[&[data-state=open]]:animate-appear motion-safe:[&[data-state=closed]]:animate-exit',
  )

type PopoverVariantsProps = VariantProps<typeof recipePopover>

export { recipePopover, type PopoverVariantsProps }

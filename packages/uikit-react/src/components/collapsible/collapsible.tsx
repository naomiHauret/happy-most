import { type FC, type ComponentProps } from 'react'
import { Collapsible as ArkCollapsible } from '@ark-ui/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { recipeButton } from '../button'

/**
 * Brand styling for any UI element that implements a collapsible behaviour
 */
const recipeCollapsible = cva(
  [
    // Content (reveal animation)
    'motion-safe:[&_[data-part=content][data-state=open]]:animate-collapseDown',
    'motion-safe:[&_[data-part=content][data-state=closed]]:animate-collapseUp',
  ],
  {
    variants: {
      intent: {
        default: [],
      },
      scale: {
        default: [
          // Content
          '[&_[data-part=content]]:py-2',
        ],
      },
    },
    defaultVariants: {
      intent: 'default',
      scale: 'default',
    },
  },
)

type CollapsibleVariantsProps = VariantProps<typeof recipeCollapsible>

interface CollapsibleProps
  extends ComponentProps<typeof ArkCollapsible.Root>,
    CollapsibleVariantsProps {
  label: JSX.Element
}

/**
 * A interactive wrapping element that can expand to reveal more content.
 */

const Collapsible: FC<CollapsibleProps> = (props) => {
  const { intent, scale, label, className, children, ...apiProps } = props

  return (
    <ArkCollapsible.Root
      {...apiProps}
      className={recipeCollapsible({ intent, scale, class: className ?? '' })}
    >
      <ArkCollapsible.Trigger
        className={recipeButton({
          class: 'relative w-full text-start',
        })}
      >
        {label}
        <span />
      </ArkCollapsible.Trigger>
      <ArkCollapsible.Content>{children}</ArkCollapsible.Content>
    </ArkCollapsible.Root>
  )
}

Collapsible.displayName = 'Collapsible'
export { Collapsible, type CollapsibleProps, type CollapsibleVariantsProps }

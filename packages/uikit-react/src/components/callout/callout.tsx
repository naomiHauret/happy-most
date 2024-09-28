import { ark, HTMLArkProps } from '@ark-ui/react'
import { type VariantProps, cva } from 'class-variance-authority'
import { type FC } from 'react'

/**
 * Brand styling for any UI element that implements a callout behaviour
 */
const recipeCallout = cva(['w-full flex flex-wrap items-center justify-center'], {
  variants: {
    intent: {
      warning: [
        'bg-warning-9/10 text-neutral-11',
        // icon
        '[&_[data-part=icon]]:text-warning-9',
      ],
    },
    scale: {
      default: [
        'rounded-md p-2 text-xs gap-2',
        // icon
        '[&_[data-part=icon]]:text-lg',
      ],
    },
  },
  defaultVariants: {
    intent: 'warning',
    scale: 'default',
  },
})

type CalloutVariantsProps = VariantProps<typeof recipeCallout>

interface CalloutProps extends CalloutVariantsProps, HTMLArkProps<'div'> {}
/**
 * An inline-text that provides contextual feedback messages for user actions
 */
const Callout: FC<CalloutProps> = (props) => {
  const { scale, intent, children, className, ...divProps } = props

  return (
    <ark.div
      className={recipeCallout({ scale, intent, class: className ?? '' })}
      role="alert"
      {...divProps}
    >
      {intent === 'warning' && (
        <div data-part="icon">
          <svg
            fill="none"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            style={{ overflow: 'visible', color: 'currentcolor' }}
            height="1em"
            width="1em"
          >
            <path d="M7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2z"></path>
            <path d="M12 8 12 12"></path>
            <path d="M12 16 12.01 16"></path>
          </svg>
        </div>
      )}
      <div>{children}</div>
    </ark.div>
  )
}

Callout.displayName = 'Callout'
export { Callout, recipeCallout, type CalloutProps, type CalloutVariantsProps }

import { type HTMLArkProps, ark } from '@ark-ui/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

/**
 * Brand styling for any UI element that implements a button-like appearance/behaviour (button, link)
 */
const recipeButton = cva(
  [
    'inline-flex items-center cursor-pointer no-underline font-body',
    '[&:is([aria-disabled=true],:disabled)]:opacity-50 [&:is([aria-disabled=true],:disabled)]:cursor-not-allowed',
    'focus:outline-none',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-primary-9',
          'text-neutral-1',
          'border-primary-9',
          'hover:bg-mix-amount-15 hover:bg-mix-neutral-1 focus:bg-mix-neutral-12 focus:bg-mix-amount-10',
          'active:bg-mix-base active:bg-mix-amount-5',
          'focus:outline-none focus:border-opacity-50 focus:ring-primary-9 focus:ring-4 focus:ring-opacity-25',
        ],
        neutral: [
          'bg-inherit bg-mix-amount-80 bg-mix-neutral-1',
          'text-neutral-12',
          'hover:bg-mix-amount-100 focus:bg-mix-amount-80',
          'active:bg-mix-amount-50',
          'border-neutral-11/20 bg-inherit shadow-[0_2px_2px_0_#FFFFFF0A_inset,0_-4px_5px_0_#0000001A_inset,0_2px_2px_0_#FFFFFF0D_inset,0_2px_5px_0_#00000040]',
          // User activity: focus
          'focus:ring-primary-9 focus:ring-4 focus:ring-opacity-25 focus:shadow-[0_2px_2px_0_#FFFFFF0A_inset,0_-4px_5px_0_#0000001A_inset,0_2px_2px_0_#FFFFFF0D_inset,0_2px_5px_0_#00000040,0_0_0_3px_#F2F2F233]',
          // User activity: clicking/active
          'active:shadow-[0_2px_2px_0_#FFFFFF0A_inset,0_-4px_5px_0_#0000001A_inset,0_2px_2px_0_#FFFFFF0D_inset,0_2px_5px_0_#00000040]',
        ],
        outline: [
          'text-neutral-11',
          'bg-transparent border-neutral-11/10',
          'hover:bg-neutral-11/5',
          'focus:ring-neutral-12',
        ],
        ghost: [
          'bg-transparent border-transparent text-neutral-11',
          'hover:bg-neutral-11/5',
          'focus:ring-neutral-12 focus:bg-neutral-11/15',
        ],
        'ghost-primary': [
          'bg-transparent border-transparent text-primary-9',
          'hover:bg-primary-9/5',
          'focus:ring-primary-9 focus:bg-primary-9/15',
        ],
      },
      scale: {
        default: 'px-[1em] py-[0.1em] rounded-md border',
      },
      label: {
        default: 'font-semibold',
      },
    },
    defaultVariants: {
      intent: 'primary',
      scale: 'default',
      label: 'default',
    },
  },
)

type ButtonVariantsProps = VariantProps<typeof recipeButton>
interface ButtonProps extends ButtonVariantsProps, HTMLArkProps<'button'> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ scale, intent, className, ...rest }, ref) => {
    return <ark.button className={recipeButton({ scale, intent, className })} ref={ref} {...rest} />
  },
)

Button.displayName = 'Button'
export { recipeButton, Button, type ButtonVariantsProps }

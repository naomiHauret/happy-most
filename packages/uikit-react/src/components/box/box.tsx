import { type VariantProps, cva } from 'class-variance-authority'

/**
 * A basic styling recipe for inline container elements that display other elements/content in a compact and/or organized way.
 * Boxes are always visible
 */
const recipeBox = cva('', {
  variants: {
    layer: {
      default: '',
      '0': 'bg-base',
      '1': 'bg-neutral-1',
      '2': 'bg-neutral-11/5',
      '3': 'bg-neutral-11/10',
    },
    demarcation: {
      default: ['border-transparent'],
      subtle: ['border-neutral-11/10'],
      strong: ['border-neutral-11/15'],
    },
    scale: {
      small: ['border rounded-md'],
      default: ['border rounded-lg'],
      large: ['border rounded-xl'],
    },
  },
  defaultVariants: {
    layer: 'default',
    scale: 'default',
    demarcation: 'default',
  },
})

type BoxVariantsProps = VariantProps<typeof recipeBox>

export { recipeBox, type BoxVariantsProps }

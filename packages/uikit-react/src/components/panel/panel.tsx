import { type VariantProps, cva } from 'class-variance-authority'

/**
 * A basic styling recipe for container elements attached to another element ;
 * panels display other interactive elements for complex user actions ;
 * panels are not visible by default and appears after being triggered by a user action.
 */
const recipePanel = cva('border', {
  variants: {
    // Whether or not the panel covers the majority of the main screen or not (default behavuour)
    coverage: {
      majority: 'bg-base',
      default: 'bg-neutral-1',
    },
    // Whether or not the panel is displayed on top of an overlay, attached (default behaviour) or detached from its trigger element
    presentation: {
      default: 'border-neutral-11/15',
      overlayed: 'border-neutral-11/10',
      detached: 'border-transparent',
    },
    scale: {
      small: ['rounded-md'],
      default: ['rounded-lg'],
      large: ['rounded-xl'],
      screen: ['rounded-none'],
    },
  },
  defaultVariants: {
    coverage: 'default',
    presentation: 'default',
    scale: 'default',
  },
})

type PanelVariantsProps = VariantProps<typeof recipePanel>

export { recipePanel, type PanelVariantsProps }

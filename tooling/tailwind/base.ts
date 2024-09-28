import type { Config } from 'tailwindcss'
import pluginForms from '@tailwindcss/forms'
import pluginContainerQueries from '@tailwindcss/container-queries'
//@ts-expect-error
import pluginColorMix from 'tailwindcss-color-mix'

const config: Omit<Config, 'content'> = {
  theme: {
    extend: {
      /**
       * Palette tip:
       * 1- darkest (lightest if light theme)
       * 9- brightest (highest chroma ; when the color has the least black/white mixed in)
       * 12- lightest  (darkest if light theme)
       */
      colors: {
        base: '#FDFDFD',
        neutral: {
          1: '#FCFCFC',
          2: '#F9F9F9',
          3: '#F0F0F0',
          11: '#646464',
          12: '#202020',
        },
        primary: {
          9: '#0090FF',
          10: '#0588F0',
          11: '#0D74CE',
          12: '#113264',
        },
        accent: {
          9: '#202020',
        },
        positive: {
          9: '#3ac96f',
        },
        negative: {
          9: '#E54D2E',
        },
        warning: {
          9: '#FFC53D',
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        collapseDown: {
          from: {
            opacity: 0.01,
            height: 0,
          },
          to: {
            opacity: 1,
            height: 'var(--height)',
          },
        },
        collapseUp: {
          from: {
            opacity: 1,
            height: 'var(--height)',
          },
          to: {
            opacity: 0.01,
            height: 0,
          },
        },
        growIn: {
          from: {
            transform: 'translateY(25%)',
            opacity: 0,
          },
          to: {
            transform: 'translateY(0%)',
            opacity: 1,
          },
        },
        growOut: {
          to: {
            transform: 'translateY(25%)',
            opacity: 0,
          },
        },
        appear: {
          from: {
            opacity: 0,
            transform: 'translateY(-2.5%)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        exit: {
          to: {
            opacity: 0,
            transform: 'translateY(-2.5%)',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 250ms ease-out',
        fadeOut: 'fadeOut 300ms ease-in',
        appear: 'appear 200ms ease-out',
        exit: 'exit 200ms ease-in',
        collapseDown: 'collapseDown 110ms cubic-bezier(0, 0, 0.38, 0.9)',
        collapseUp: 'collapseUp 110ms cubic-bezier(0, 0, 0.38, 0.9)',
        growIn: 'growIn 250ms ease-out',
        growOut: 'growOut 200ms ease-in',
      },
    },
  },
  plugins: [
    /**
     * @see https://github.com/JavierM42/tailwindcss-color-mix
     */
    pluginColorMix(),
    /**
     * @see https://github.com/tailwindlabs/tailwindcss-container-queries
     */
    pluginContainerQueries,
    /**
     * @see https://github.com/tailwindlabs/tailwindcss-forms
     */
    pluginForms({
      strategy: 'class',
    }),
  ],
}

export default config

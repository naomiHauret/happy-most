import type { Config } from "tailwindcss";
import pluginForms from "@tailwindcss/forms";
import pluginContainerQueries from "@tailwindcss/container-queries";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      /**
       * Palette tip:
       * 1- darkest
       * 9- brightest (highest chroma ; when the color has the least black/white mixed in)
       * 12- lightest
       */
      colors: {
        neutral: {},
        primary: {},
        accent: {},
        positive: {},
        negative: {},
        warning: {},
      },
    },
  },
  plugins: [
    /**
     * @see https://github.com/tailwindlabs/tailwindcss-container-queries
     */
    pluginContainerQueries,
    /**
     * @see https://github.com/tailwindlabs/tailwindcss-forms
     */
    pluginForms({
      strategy: "class",
    }),
  ],
};

export default config;

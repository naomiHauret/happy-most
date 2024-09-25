# @happy/tailwind

> This repository is used by internal packages.

[TailwindCSS](https://tailwindcss.com/) configuration used across `happy` apps and UI packages.

## Plugins

- [tailwindcss-container-queries ](https://github.com/tailwindlabs/tailwindcss-container-queries): provides utilities for [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) for projects using Tailwind CSS v3.2+
- [tailwindcss-forms](https://github.com/tailwindlabs/tailwindcss-forms): provides a basic reset for form styles that makes form elements easy to override with utilities.

## Usage

### Installation

In your project folder, add `"@happy/tailwind": "workspace:*"` to the `devDependecies` of your `package.json` (ensure `tailwindcss` and `postcss` are also installed as a `devDepencies`)

### Additional setup

In your project create a  `postcss.config.js` file along with a `tailwind.config.ts` file. Add the following to your Tailwind configuration file :

```ts
import type { Config } from 'tailwindcss'
import baseConfig from '@happy/tailwind/base'
const config: Config = {
  content: [], // Add the paths to all of your HTML templates, JS components, and any other files that contain Tailwind class names. For instance `./src/**/*.{ts,tsx,js,jsx,html,svelte,vue}
  presets: [baseConfig],
}
export default config
```

This will ensure you can use the customized Tailwind classes in your project.
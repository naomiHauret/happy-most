import { type Config } from 'tailwindcss'
import baseConfig from '@happy/tailwind/base'
const config: Config = {
  content: [
    './src/**/*{.js,.ts,.jsx,.tsx}',
    './index.html',
    '../../packages/uikit-react/src/components/**/*{.js,.ts,.jsx,.tsx}',
  ],
  presets: [baseConfig],
}

export default config

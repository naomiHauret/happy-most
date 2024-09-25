# @happy/uikit-react

> This repository is an internal package.

UI element used across Happy web apps.

## Usage

### Installation

In your project folder: 

1. Add `"@happy/uikit-react": "workspace:*"` to the `devDependecies` of your `package.json` (ensure `@happy/tailwind` and its dependencies are also installed as `devDepencies`).


2. Create `app.css` file (or `base.css`, `styles.css`... whatever name suits your preferences).

3. Import your previously created CSS file in your app entrypoint (eg: `main.tsx`, `app.tsx`...), along with the custom fonts declaration.

Example :

```tsx
import '/path/to/app.css' // eg: ./app.css
import '@happy/uikit-react/fonts.css'
```

### Use the components

1. Import the component you need

```tsx
import { MyCoolComponent } from '@happy/uikit-react'
```

2. Use it in your template

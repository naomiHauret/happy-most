# @happy/connector

> This repository is an internal package.

Connector to provide end-to-end type safety between front-end apps and the [Elysia](https://elysiajs.com/) backend. Powered by [Eden](https://elysiajs.com/eden/overview.html).

> Eden is a RPC-like client to connect Elysia end-to-end type safety using only TypeScript's type inference instead of code generation.

## Usage

### Installation

In your project folder: 

1. Add `"@happy/connector": "workspace:*"` to the `devDependecies` of your `package.json` (ensure `@happy/tailwind` and its dependencies are also installed as `devDepencies`).


### Use the connector

1. Import the component you need

```tsx
import { api } from '@happy/connector'
```

2. Use it in your template

```tsx
const { data, error } = await app.ping.get()
```

> Refer to `apps/backend` for complete API routes reference.
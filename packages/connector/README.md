# @happy/connector

> This repository is an internal package.

Connector to provide end-to-end type safety between front-end apps and the [Elysia](https://elysiajs.com/) backend. Powered by [Eden](https://elysiajs.com/eden/overview.html).

> Eden is a RPC-like client to connect Elysia end-to-end type safety using only TypeScript's type inference instead of code generation.

## Usage

### Installation

In your project folder:

1. Add `"@happy/connector": "workspace:*"` to the `dependencies` of your `package.json`.

### Use the connector

1. Create the connector

```ts
import { createApiConnector } from '@happy/connector'

const apiClient = createApiConnector('<backend endpoint>')
```

2. Use it in your code

```ts
const { data, error } = await app.ping.get() // `GET  <backend endpoint>/ping`
```

> Refer to `apps/backend` for complete API routes reference.

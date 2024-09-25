# @happy

Monorepo for happy products. Relies on [pnpm workspaces](https://pnpm.io/workspaces).

Includes the following workspaces :

1. **Tooling** (`tooling/`)

- `@happy/tailwind`: [TailwindCSS](https://tailwindcss.com/) config

2. **Internal packages** (`packages/`)

- `@happy/ui-react`: custom design recipes built with [cva](https://cva.style/docs) + React primitive UI elements built on top of [Ark UI](https://ark-ui.com/react/docs/overview/introduction)
- `@happy/chains`: supported chains
- `@happy/connector`: end-to-end type safety between the front-end and backend (provided by [Eden](https://elysiajs.com/eden/overview.html))

3. **Applications and products** (`apps/`)

- `@happy/contracts`: smart contracts ([Foundry](https://book.getfoundry.sh/))
- `@happy/backend`: backend ([Elysia](https://elysiajs.com/))
- `@happy/frontend`: dapp (Vite + React + [tanstack/router](https://tanstack.com/router/latest))

# Get started

> Pre-requisites: have `node` (>=21.5.0), `pnpm` installed, `bun` installed

1. Install dependencies: `pnpm install`
2. Launch apps: `pnpm run dev`

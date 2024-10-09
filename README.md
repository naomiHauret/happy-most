# @happy

Monorepo for happy products. Relies on [pnpm workspaces](https://pnpm.io/workspaces).

Includes the following workspaces :

1. **Tooling** (`tooling/`)

- `@happy/tailwind`: [TailwindCSS](https://tailwindcss.com/) config
- `@happy/tsconfig`: Typescript configuration files

2. **Internal packages** (`packages/`)

- `@happy/abis`: custom ABIs
- `@happy/chains`: supported chains
- `@happy/connector`: end-to-end type safety between the front-end and backend (provided by [Eden](https://elysiajs.com/eden/overview.html))
- `@happy/token-lists`: supported tokens (based on [Uniswap Tokens List configuration](https://github.com/Uniswap/token-lists))
- `@happy/ui-react`: custom design recipes built with [cva](https://cva.style/docs) + React primitive UI elements built on top of [Ark UI](https://ark-ui.com/react/docs/overview/introduction)

3. **Applications and products** (`apps/`)

- `@happy/contracts`: smart contracts ([Foundry](https://book.getfoundry.sh/))
- `@happy/backend`: backend ([Elysia](https://elysiajs.com/))
- `@happy/frontend`: dapp (Vite + React + [tanstack/router](https://tanstack.com/router/latest) + wagmi)

# Get started

> Pre-requisites: have `node` (>=21.5.0), `pnpm` installed, `bun` installed

1. Install dependencies: `pnpm install`
2. In `apps/frontend` and `apps/backend`, create a `.env.local` file (or `.env.dev`, `.env`...), paste the content of `.env.dist` and replace its values with your own.
3. Launch apps: `pnpm run dev`. The frontend app should be accessible at `localhost:5173`, the backend at `localhost:3000`.

## Get test tokens

A list of ERC20 tokens deployed on Optimism Sepolia and Happy Chain Testnet can be found in `packages/token-lists`.
To get those test tokens, you can use the [dedicated endpoint in the backend](https://backend-misty-rain-4542.fly.dev/swagger#tag/default/POST/make-it-rain).


## Deployment

> You'll need to : have Fly.io CLI installed and configured ; configure the secrets (environment variables) of each apps via your Fly.io project dashboard or `fly secrets set ...`

- Run `pnpm deploy:backend` to deploy `apps/backend` ;
- Run `pnpm deploy:frontend` to deploy `apps/frontend`

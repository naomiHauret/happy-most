# @happy/chains

> This repository is an internal package.

Chains supported accross Happy products. Made to be used with [viem](https://viem.sh/)-based library (eg: [wagmi](https://wagmi.sh/)).

## Usage

### Installation

In your project folder, add `"@happy/chains": "workspace:*"` to the `dependecies` of your `package.json`.

### Additional setup

```ts
import { SUPPORTED_CHAINS } from '@happy/chains'
import { http, createConfig } from 'wagmi'

const config = createConfig({
  chains: [SUPPORTED_CHAINS.happyChainSepolia, SUPPORTED_CHAINS.optimismSepolia],
  transports: {
    [SUPPORTED_CHAINS.happyChainSepolia.id]: http(),
    [SUPPORTED_CHAINS.optimismSepolia.id]: http(),
  },
})
```

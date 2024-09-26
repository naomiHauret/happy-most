> This repository is an internal package.

Custom smart contract ABIs used in Happy products.

## Usage

### Installation

In your project folder, add `"@happy/abis": "workspace:*"` to the `dependecies` of your `package.json`

### How to use

You can import the required ABI as so :

```ts
import abi from '@happy/abis/SimpleERC20'
import { readContract } from '@wagmi/core' // use the appropriate library depending on your platform, here we showcase wagmi/core for simplicitiy
import { config } from '/path/to/wagmiconfig'

const result = await readContract(config, {
  abi,
  chainId: '<deployed contract chainId>',
  address: '<my deployed contract address>',
  functionName: 'totalSupply',
})
```

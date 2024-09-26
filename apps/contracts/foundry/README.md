# @happy/contracts/foundry

## Deploy smart contract

> For reference, check [Foundry docs](https://book.getfoundry.sh/forge/deploying#deploying).

In your terminal, type :

```bash
forge create --rpc-url "<rpc url>" \
    --constructor-args "<token name>" "<token symbol>" "<controller wallet address>" \
    --private-key "<deployer wallet private key>" \
    src/SimpleERC20.sol:SimpleERC20
```

## Deploy list of tokens from terminal (via script)

In your terminal, type :

```bash
forge script script/DeployList.s.sol:DeployTokensList
```

## Generate contract ABI

### Print in terminal

To generate and display the ABI of a specific smart contract, in your terminal, run :

```bash
forge inspect src/contract-filename.sol:ContractName abi
```

For instance:

```bash
forge inspect src/SimpleERC20.sol:SimpleERC20 abi
```

### Export to JSON file

To generate the ABI specific smart contract and export it to JSON, in your terminal, run :

```bash
forge inspect src/contract-filename.sol:ContractName abi > your-filename.json
```

For instance:

```bash
forge inspect src/SimpleERC20.sol:SimpleERC20 abi > simpleERC20.json
```

---

> Bootstrapped using `forge init`.

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

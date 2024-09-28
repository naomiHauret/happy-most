# @happy/contracts

Happy products smart contracts. Built with Foundry. Head to `foundry/README.md` for more details.

## Generate ABI

Let's say you need to generate the ABI of `foundry/src/SimpleERC20.sol` and export it a JSON file.

To achieve this, run this in your terminal :

```bash
cd foundry # make sure your're in the right folder !
forge inspect src/SimpleERC20.sol:SimpleERC20 abi > simpleERC20Abi.json
```

## Deploy list of predefined tokens

A list of predefined tokens is ready to be deployed. You can deploy these tokens to Optimism Sepolia and Happy Chain Sepolia via the script defined in `foundry/script/List.s.sol`. To do so, run this in your terminal :

```bash
cd foundry # make sure your're in the right folder !
forge script script/List.s.sol:Deploy --broadcast # optionally, add --slow
```

You can then head to `foundry/broadcast/multi/List.s.sol-latest/run.json` to check all deployment details (addresses the contracts were deployed to etc.)

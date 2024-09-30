import tokenList from '@happy/token-lists/bridge'
import abiSimpleERC2O from '@happy/abis/SimpleERC20'
import { controllerAccount, controllerWalletClient, publicClient } from '../config/viem'
import { parseUnits } from 'viem'
import { type ValidTokenId } from '../helpers'

async function mint(args: {
  destinationWalletAddress: `0x${string}`
  tokenId: ValidTokenId
  amount: bigint | number
}) {
  const [chain, contractAddress] = args.tokenId.split('_') as [string, string]
  const chainId = Number(chain)
  const mintToken = await publicClient[chainId]!!.simulateContract({
    address: contractAddress as `0x${string}`,
    abi: abiSimpleERC2O,
    account: controllerAccount,
    functionName: 'mint',
    args: [
      args.destinationWalletAddress,
      typeof args.amount === 'number'
        ? parseUnits(String(args.amount), tokenList.tokenMap[args.tokenId].decimals)
        : args.amount,
    ],
  })
  console.log(
    args.destinationWalletAddress,
    typeof args.amount === 'number'
      ? parseUnits(String(args.amount), tokenList.tokenMap[args.tokenId].decimals)
      : args.amount,
  )
  const txHash = await controllerWalletClient[chainId]!!.writeContract(mintToken.request)
  return {
    hash: txHash,
    chain: chainId,
  }
}

export { mint }

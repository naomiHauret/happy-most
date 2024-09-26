// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SimpleERC20.sol";

/**
 * Deploy a list of predefined tokens to OP Sepolia and Happy Chain Sepolia
 */
contract Deploy is Script {
    function deployTokensListOnChain(
        string memory chainName,
        address ownerAddress,
        uint256 deployerPrivateKey
    ) internal {
        vm.startBroadcast(deployerPrivateKey);

        SimpleERC20 red = new SimpleERC20("Red Coin", "RED", ownerAddress);

        SimpleERC20 blue = new SimpleERC20("Blue Coin", "BLUE", ownerAddress);

        SimpleERC20 green = new SimpleERC20("Green Coin", "GRN", ownerAddress);

        SimpleERC20 yellow = new SimpleERC20(
            "Yellow Coin",
            "YLW",
            ownerAddress
        );

        SimpleERC20 purple = new SimpleERC20(
            "Purple Coin",
            "PRPL",
            ownerAddress
        );

        vm.stopBroadcast();

        console.log("Deployed on", chainName);
        console.log("$RED => ", address(red));
        console.log("$BLUE => ", address(blue));
        console.log("$YLW => ", address(yellow));
        console.log("$GRN => ", address(green));
        console.log("$PRPL => ", address(purple));
    }

    function run() external {
        address ownerAddress = vm.envAddress("OWNER_WALLET_ADDRESS");
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");

        // Deploy tokens on Optimism Sepolia
        vm.createSelectFork(vm.envString("OP_SEPOLIA_RPC_URL"));
        deployTokensListOnChain(
            "Optimism Sepolia",
            ownerAddress,
            deployerPrivateKey
        );

        // Deploy tokens on Happy Chain Sepolia
        vm.createSelectFork(vm.envString("HAPPYCHAIN_SEPOLIA_RPC_URL"));
        deployTokensListOnChain(
            "Happy Chain Sepolia",
            ownerAddress,
            deployerPrivateKey
        );

        console.log("Minting/Burning controlled by:", ownerAddress);
    }
}

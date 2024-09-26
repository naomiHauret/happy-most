// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract SimpleERC20 is ERC20, ERC20Burnable, Ownable {
    /**
     * @dev Initializes the contract, setting the deployer as the owner
     * @param name - Token name
     * @param symbol - Token symbol
     * @param initialOwner - Address that receives owner permissions
     * `initialOwner` will be able to call functions with the onlyOwner modifier
     */
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {}

    /**
     * @dev Allows the owner (bridge) to mint tokens.
     * @param to - Wallet address that will receive the minted tokens
     * @param amount - Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Allows the owner (bridge) to burn tokens
     * @param from - Wallet address from which to burn tokens from
     * @param amount  - Aamount of tokens to burn
     */
    function bridgeBurn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

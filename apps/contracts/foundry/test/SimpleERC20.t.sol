// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import {Test, console} from "forge-std/Test.sol";
import {SimpleERC20} from "../src/SimpleERC20.sol";

contract SimpleERC20Test is Test {
    SimpleERC20 public token;
    address public owner;
    address public user1;
    address public user2;

    uint256 public constant INITIAL_SUPPLY = 1000000 * 10 ** 18; // a lot of tokens

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        token = new SimpleERC20("Simple Token", "BASIC", owner);
    }

    /**
     * -> The token is created with the assigned params
     */
    function testBootstrapsToken() public view {
        assertEq(token.name(), "Simple Token");
        assertEq(token.symbol(), "BASIC");
        assertEq(token.totalSupply(), 0);
        assertEq(token.owner(), owner);
    }

    /**
     * -> The owner can mint tokens
     * -> Total supply gets updated
     * -> User balance gets updated
     */
    function testOwnerCanMint() public {
        token.mint(user1, INITIAL_SUPPLY);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(user1), INITIAL_SUPPLY);
    }

    /**
     * -> ONLY the owner can mint
     */
    function testNonOwnerFailsMint() public {
        uint256 amountToMint = 100 * 10 ** 18;
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                user1
            )
        );
        token.mint(user1, amountToMint);

        assertEq(token.balanceOf(user1), 0);
    }

    /**
     * -> User can burn their own tokens
     * -> User's underlying balance gets updated
     * -> Total supply gets updated
     */
    function testCanBurn() public {
        uint256 amountToBurn = 100 * 10 ** 18;
        token.mint(user1, INITIAL_SUPPLY);
        vm.prank(user1);
        token.burn(amountToBurn);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - amountToBurn);
        assertEq(token.balanceOf(user1), INITIAL_SUPPLY - amountToBurn);
    }

    /**
     * -> User can't burn more than their balance
     */
    function testBurnMoreThanBalanceFails() public {
        uint256 amountToBurn = INITIAL_SUPPLY;
        uint256 balance = amountToBurn - 1;

        token.mint(user1, balance);
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSignature(
                "ERC20InsufficientBalance(address,uint256,uint256)",
                user1,
                balance,
                amountToBurn
            )
        );
        token.burn(amountToBurn);
    }

    /**
     * -> User can burn allowed token amount from designated wallet
     * -> Updates designated wallet underlying balance
     * -> Updates total supply
     */
    function testBurnFrom() public {
        uint256 amountToBurn = 10 * 10 ** 18;
        token.mint(user1, INITIAL_SUPPLY);
        vm.prank(user1);
        token.approve(user2, amountToBurn);
        vm.prank(user2);
        token.burnFrom(user1, amountToBurn);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - amountToBurn);
        assertEq(token.balanceOf(user1), INITIAL_SUPPLY - amountToBurn);
    }

    /**
     * -> User can't burn if did not receive spending approval
     */
    function testBurnWithoutApprovalFails() public {
        uint256 amountToBurn = 100;
        uint256 balance = 1000;

        token.mint(user1, balance);
        vm.prank(user2);
        vm.expectRevert(
            abi.encodeWithSignature(
                "ERC20InsufficientAllowance(address,uint256,uint256)",
                user2,
                0,
                amountToBurn
            )
        );
        token.burnFrom(user1, amountToBurn);
    }

    /**
     * -> User can't burn more than their received spending approval
     */
    function testBurnMoreThanApprovalFails() public {
        uint256 balance = 100;
        uint256 amountToBurn = 1000;
        uint256 granted = 10;

        token.mint(user1, balance);
        vm.prank(user1);
        token.approve(user2, granted);
        vm.prank(user2);
        vm.expectRevert(
            abi.encodeWithSignature(
                "ERC20InsufficientAllowance(address,uint256,uint256)",
                user2,
                granted,
                amountToBurn
            )
        );
        token.burnFrom(user1, amountToBurn);
    }

    /**
     * -> Bridge can burn
     */
    function testBridgeBurn() public {
        uint256 amountToBurn = 100 * 10 ** 18;
        token.mint(user1, INITIAL_SUPPLY);
        token.bridgeBurn(user1, amountToBurn);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - amountToBurn);
        assertEq(token.balanceOf(user1), INITIAL_SUPPLY - amountToBurn);
    }

    /**
     * -> Bridge can't burn  more than user balance
     */
    function testBridgeBurnMoreThanBalanceFails() public {
        uint256 amountToBurn = 2;
        uint256 balance = 1;
        token.mint(user1, balance);
        vm.expectRevert(
            abi.encodeWithSignature(
                "ERC20InsufficientBalance(address,uint256,uint256)",
                user1,
                balance,
                amountToBurn
            )
        );
        token.bridgeBurn(user1, amountToBurn);
    }

    /**
     * -> Only bridge can call bridgeBurn
     */
    function testBridgeBurnFailsForNonOwner() public {
        uint256 amountToBurn = 100 * 10 ** 18;
        token.mint(user1, INITIAL_SUPPLY);
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                user1
            )
        );
        token.bridgeBurn(user1, amountToBurn);
    }

    /**
     * -> User can transfer
     */
    function testTransfer() public {
        uint256 amountToTransfer = 10 * 10 ** 18;
        token.mint(user1, INITIAL_SUPPLY);
        vm.prank(user1);
        token.transfer(user2, amountToTransfer);
        assertEq(token.balanceOf(user1), INITIAL_SUPPLY - amountToTransfer);
        assertEq(token.balanceOf(user2), amountToTransfer);
    }

    /**
     * -> User can't transfer more than their balance
     */
    function testTransferMoreThanBalanceFails() public {
        uint256 amountToTransfer = INITIAL_SUPPLY + 1;
        uint256 balance = INITIAL_SUPPLY - 1;
        token.mint(user1, balance);
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSignature(
                "ERC20InsufficientBalance(address,uint256,uint256)",
                user1,
                balance,
                amountToTransfer
            )
        );
        token.transfer(user2, amountToTransfer);
    }
}

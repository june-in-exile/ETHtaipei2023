// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Lock {
    address owner;
    mapping(address => mapping(address => uint256)) balances;

    constructor() {
        owner = msg.sender;
    }

    function deposit(address token, uint256 amount) external {
        balances[msg.sender][token] += amount;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(address token, uint256 amount) external {
        balances[msg.sender][token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
    }

    function balanceOf(
        address account,
        address token
    ) external view returns (uint256) {
        return balances[account][token];
    }
}

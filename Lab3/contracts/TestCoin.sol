pragma solidity ^0.8.18;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestCoin is ERC20 {
    constructor() ERC20("TCoin", "Test Coin") {
        _mint(msg.sender, 5000);
    }
}

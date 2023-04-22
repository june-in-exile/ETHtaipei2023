// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DriverPayment {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    address _owner;
    address private immutable uniswapRouter;
    address private immutable usdcToken;
    uint256 public _REWARD_RATE;
    uint256 public _STATION_SERVICE_FEE_RATE;
    uint256 public _INTEREST_RATE;
    uint256 User_count;
    uint256 Station_count;
    mapping(address => uint256) Station_balances; //machi, not usdc
    mapping(address => uint256) User_balances;
    mapping(bytes32 => address) licenseToAddress;

    constructor(address _uniswapRouter, address _usdcToken) {
        _owner = msg.sender;
        uniswapRouter = _uniswapRouter;
        usdcToken = _usdcToken;
        User_count = 0;
        Station_count = 0;
        _REWARD_RATE = 0.05 ether; // 5%
        _INTEREST_RATE = 0.1 ether; // 10%
        _STATION_SERVICE_FEE_RATE = 0.02 ether; // 2%
    }

    //if function with this modifier should satisfy owner check
    modifier onlyOwner() {
        require(msg.sender == _owner, "You are not owner");
        _;
    }

    function depositWETH(address token, uint256 amount) external {
        //amount進來前就要*10^18
        address[] memory path = new address[](2);
        path[0] = IUniswapV2Router02(uniswapRouter).WETH();
        path[1] = usdcToken;
        uint256 deadline = block.timestamp + 300; // 5 minute deadline

        // Call the Uniswap router's swapExactETHForTokens function to convert ETH to token
        uint256[] memory amounts = IUniswapV2Router02(uniswapRouter)
            .swapExactETHForTokens{value: msg.value}(
            amount,
            path,
            address(this),
            deadline
        );
        User_balances[msg.sender] += amounts[1];
    }

    function pay(
        string memory license,
        address gasStation,
        uint256 amount
    ) public onlyOwner {
        bytes32 license_Hash = keccak256(abi.encodePacked(license));
        address driver_address = licenseToAddress[license_Hash];
        require(User_balances[driver_address] >= amount);
        User_balances[driver_address] -= amount;
        User_balances[gasStation] += amount;
        uint256 _reward = (amount * _REWARD_RATE) / 1e18;
        User_balances[driver_address] += _reward;
    }

    function pay_interest() public onlyOwner {
        for (uint i = 0; i < User_balances.length; i++) {
            User_balances[i] *= _INTEREST_RATE / 1e18;
        }
    }

    function registerCar(
        string memory license,
        address user_address
    ) public onlyOwner {
        bytes32 licenseHash = keccak256(abi.encodePacked(license));
        licenseToAddress[licenseHash] = user_address;
    }

    function user_balanceOf() external view returns (uint256) {
        return User_balances[msg.sender];
    }

    function Station_balanceOf() external view returns (uint256) {
        return Station_balances[msg.sender];
    }

    function Station_withdrawUsdc(uint256 amount) external {
        require(Station_balances[msg.sender] >= amount);
        Station_balances[msg.sender] -= amount;
        amount *= _STATION_SERVICE_FEE_RATE / 1e18;
        IERC20(usdcToken).safeTransfer(msg.sender, amount);
    }
}

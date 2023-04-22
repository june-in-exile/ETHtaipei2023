// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DriverPayment is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    address owner;
    address private immutable uniswapRouter;
    address private immutable usdcToken;
    uint256 public interestRate = 10; // the interest that Autopass pay to driver
    uint256 public rewardRate = 5; // the reward that Autopass pay to driver
    uint256 public serviceFeeRate = 2; // the gas station pays Autopass for using the service
    uint256 public payInterestPeriod = 30 * 24 * 60 * 60; //month;
    mapping(address => uint256) private stationBalances; //machi, not usdc
    mapping(address => uint256) private driverBalances;
    mapping(bytes32 => address) private plateToAddress;
    mapping(address => uint256) private timestamp;

    constructor(address _uniswapRouter, address _usdcToken) {
        owner = msg.sender;
        uniswapRouter = _uniswapRouter;
        usdcToken = _usdcToken;
    }

    function depositWETH(uint256 amount) public payable onlyOwner {
        //amount進來前就要*10^18
        address[] memory path = new address[](2);
        path[0] = IUniswapV2Router02(uniswapRouter).WETH();
        path[1] = usdcToken;
        uint256 deadline = block.timestamp + 300; // 5 minute deadline

        // Call the Uniswap router's swapExactETHForTokens function to convert ETH to token
        // jason: not sure how this functions work?
        uint256[] memory amounts = IUniswapV2Router02(uniswapRouter)
            .swapExactETHForTokens{value: msg.value}(
            amount,
            path,
            address(this),
            deadline
        );
        // jason: what are the items inside of amounts?
        driverBalances[msg.sender] += amounts[1];
    }

    function payInterest(address _driver, uint times) internal onlyOwner {
        for (uint i = times; i > 0; i--) {
            driverBalances[_driver] *= interestRate / 100;
        }
        timestamp[_driver] = block.timestamp;
    }

    function updateDriverBalance(address _driver) internal onlyOwner {
        uint times = (timestamp[_driver] - block.timestamp) / payInterestPeriod;
        if (times > 0) {
            payInterest(_driver, times);
        }
    }

    function getDriverBalance(address _driver) public onlyOwner {
        updateDriverBalance(_driver);
        return driverBalances[_driver];
    }

    function pay(
        string memory _plate,
        address _gasStation,
        uint256 _amount
    ) public onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        address driverAddress = plateToAddress[plateHash];
        require(driverBalances[driverAddress] >= _amount);
        driverBalances[driverAddress] -= _amount;
        driverBalances[_gasStation] += _amount;
        uint256 _reward = (_amount * rewardRate) / 100;
        driverBalances[driverAddress] += _reward;
    }

    function createRegistry(
        string memory _plate,
        address _driver
    ) external onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        plateToAddress[plateHash] = _driver;
    }

    function readRegistry(string memory _plate) external view onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        return plateToAddress[plateHash];
    }

    function updateRegistry(
        string memory _plate,
        address _driver
    ) external onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        plateToAddress[plateHash] = _driver;
    }

    function deleteRegistry() external onlyOwner {
        delete plateToAddress[plateHash];
    }

    function driverBalanceOf() external view returns (uint256) {
        return driverBalances[msg.sender];
    }

    function stationBalanceOf() external view returns (uint256) {
        return stationBalances[msg.sender];
    }

    function stationWithdrawUSDC(uint256 amount) external {
        require(stationBalances[msg.sender] >= amount);
        stationBalances[msg.sender] -= amount;
        amount *= serviceFeeRate / 100;
        IERC20(usdcToken).safeTransfer(msg.sender, amount);
    }
}

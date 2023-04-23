// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DriverPayment is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address public usdcToken;
    uint256 public interestRate = 0.1 * 10e18; // the interest that Autopass pay to driver
    uint256 public rewardRate = 0.05 * 10e18; // the reward that Autopass pay to driver
    uint256 public serviceFeeRate = 0.02 * 10e18; // the gas station pays Autopass for using the service
    uint256 public payInterestPeriod = 30 * 24 * 60 * 60; //month;

    mapping(address => uint256) public stationBalances; //machi, not usdc
    mapping(address => uint256) public driverBalances;
    mapping(bytes32 => address) private registry;
    mapping(address => uint256) public timestamps;
    mapping(address => mapping(address => amount)) public driverDepositedToken;
    constructor(address _usdcToken) {
        transferOwnership(msg.sender);
        usdcToken = _usdcToken;
    }

    function createEntry(string memory _plate) external {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        registry[plateHash] = msg.sender;
    }

    function viewEntry(
        string memory _plate
    ) public view onlyOwner returns (address) {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        return registry[plateHash];
    }

    function deleteEntry(string memory _plate) external onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        delete registry[plateHash];
    }

    //amount進來前就要*10^18
    function depositUSDC(uint256 amount) external payable {
        driverBalances[msg.sender] += amount;
        IERC20(usdcToken).transferFrom(msg.sender, address(this), amount);
        timestamps[msg.sender] = block.timestamp;
    }

    function deposit(uint256 amount, address token) external payable{
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        driverDepositedToken[msg.sender][token] += amount;
    }

    function registerUSDCForUser(uint256 amount, address token, address user){
        driverDepositedToken[user][token] = 0;
        driverBalances[user] += amount;
    }

    function payInterest(address _driver, uint times) internal onlyOwner {
        for (uint i = times; i > 0; i--) {
            driverBalances[_driver] *= (interestRate + 10e18);
            driverBalances[_driver] /= 10e18;
        }
        timestamps[_driver] = block.timestamp;
    }

    function updateDriverBalance(address _driver) internal onlyOwner {
        uint times = (block.timestamp - timestamps[_driver]) /
            payInterestPeriod;
        if (times > 0) {
            payInterest(_driver, times);
        }
    }

    function getDriverBalance(
        address _driver
    ) public onlyOwner returns (uint256) {
        console.log("block.timestamp: %s", block.timestamp);
        updateDriverBalance(_driver);
        console.log("driverBalances[_driver]: %s", driverBalances[_driver]);
        return driverBalances[_driver];
    }

    function pay(
        string memory _plate,
        address _station,
        uint256 _amount
    ) public onlyOwner {
        address driver = viewEntry(_plate);
        updateDriverBalance(driver);
        require(driverBalances[driver] >= _amount);
        driverBalances[driver] -= _amount;
        stationBalances[_station] += _amount;
        uint256 _reward = (_amount * rewardRate) / 10e18;
        driverBalances[driver] += _reward;
    }

    function createStation() external {
        stationBalances[msg.sender] = 0;
    }

    function deleteStation(address station) external {
        delete stationBalances[station];
    }

    function viewStationBalance(
        address station
    ) external view returns (uint256) {
        return stationBalances[station];
    }

    function stationWithdrawUSDC(uint256 amount) external payable {
        require(stationBalances[msg.sender] >= amount);
        stationBalances[msg.sender] -= amount;
        amount *= (10e18 - serviceFeeRate) / 10e18;
        IERC20(usdcToken).safeTransfer(msg.sender, amount);
    }
}

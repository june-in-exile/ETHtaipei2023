// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DriverPayment is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address public constant routerAddress =
        0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);
    address private immutable usdcToken;
    address private immutable ethToken;
    uint24 public constant poolFee = 3000;

    uint256 public interestRate = 0.1 * 1e18; // the interest that Autopass pay to driver
    uint256 public rewardRate = 0.05 * 1e18; // the reward that Autopass pay to driver
    uint256 public serviceFeeRate = 0.02 * 1e18; // the gas station pays Autopass for using the service
    uint256 public payInterestPeriod = 30 * 24 * 60 * 60; //month;

    mapping(address => uint256) private stationBalances;
    mapping(address => uint256) private driverBalances;
    mapping(bytes32 => address) private registry;
    mapping(address => uint256) private timestamps;

    constructor(address _usdcToken, address _ethToken) {
        transferOwnership(msg.sender);
        usdcToken = _usdcToken;
        ethToken = _ethToken;
    }

    function createEntry(
        string memory _plate,
        address _driver
    ) external onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        registry[plateHash] = _driver;
    }

    function viewEntry(
        string memory _plate
    ) public view onlyOwner returns (address) {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        return registry[plateHash];
    }

    function updateEntry(
        string memory _plate,
        address _driver
    ) external onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        registry[plateHash] = _driver;
    }

    function deleteEntry(string memory _plate) external onlyOwner {
        bytes32 plateHash = keccak256(abi.encodePacked(_plate));
        delete registry[plateHash];
    }

    function swapExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal returns (uint256 amountOut) {
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        amountOut = swapRouter.exactInputSingle(params);
    }

    function depositWETH(uint256 amountIn) public payable {
        uint256 amountOut = swapExactInputSingle(ethToken, usdcToken, amountIn);
        driverBalances[msg.sender] += amountOut;
    }

    function payInterest(address _driver, uint times) internal onlyOwner {
        for (uint i = times; i > 0; i--) {
            driverBalances[_driver] *= (interestRate / 1e18 + 1);
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
        updateDriverBalance(_driver);
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
        uint256 _reward = (_amount * rewardRate) / 1e18;
        driverBalances[driver] += _reward;
    }

    function createStation(address station) external {
        stationBalances[station] = 0;
    }

    function deleteStation(address station) external {
        delete stationBalances[station];
    }

    function viewStationBalance(
        address station
    ) external view returns (uint256) {
        return stationBalances[station];
    }

    function stationWithdrawUSDC(uint256 amount) external {
        require(stationBalances[msg.sender] >= amount);
        stationBalances[msg.sender] -= amount;
        amount *= (1e18 - serviceFeeRate) / 1e18;
        IERC20(usdcToken).safeTransfer(msg.sender, amount);
    }
}

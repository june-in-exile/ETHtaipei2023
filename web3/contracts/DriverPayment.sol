// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DriverPayment is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IUniswapV2Router02 public uniswapRouter;
    address private immutable usdcToken;
    address private immutable ethToken;
    uint256 public interestRate = 0.1 * 1e18; // the interest that Autopass pay to driver
    uint256 public rewardRate = 0.05 * 1e18; // the reward that Autopass pay to driver
    uint256 public serviceFeeRate = 0.02 * 1e18; // the gas station pays Autopass for using the service
    uint256 public payInterestPeriod = 30 * 24 * 60 * 60; //month;
    mapping(address => uint256) private stationBalances; //machi, not usdc
    mapping(address => uint256) private driverBalances;
    mapping(bytes32 => address) private registry;
    mapping(address => uint256) private timestamps;

    constructor(address _uniswapRouter, address _usdcToken) {
        transferOwnership(msg.sender);
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
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

    //amount進來前就要*10^18
    function depositWETH(uint256 amount) public payable {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
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

        (uint256 tokenReceived, uint256 ethRemained) = uniswapRouter
            .swapExactETHForTokens{value: msg.value}(
            amount,
            path,
            address(this),
            deadline
        );
        require(ethRemained == 0, "too much ETH"");
        driverBalances[msg.sender] += tokenReceived;
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

    function getDriverBalance(address _driver) public onlyOwner {
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

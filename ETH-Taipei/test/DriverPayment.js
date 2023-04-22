// test/DriverPayment.test.js

const { expect } = require("chai");

describe("DriverPayment", function () {
    let owner, driver, gasStation;
    let DriverPayment, driverPayment, usdcToken, uniswapRouter;

    beforeEach(async function () {
        [owner, driver, gasStation] = await ethers.getSigners();

        // Deploy the necessary contracts
        usdcToken = await ethers.getContractAt("IERC20", "0x6B175474E89094C44Da98b954EedeAC495271d0F");
        uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

        DriverPayment = await ethers.getContractFactory("DriverPayment");
        driverPayment = await DriverPayment.deploy(uniswapRouter.address, usdcToken.address);

        // Register the driver's car
        await driverPayment.connect(owner).registerCar("LICENSE123", driver.address);

        // Deposit some USDC for the driver
        const amount = ethers.utils.parseUnits("100", 6);
        await driver.sendTransaction({ value: ethers.utils.parseEther("1") });
        await driverPayment.depositWETH(usdcToken.address, amount);
    });

    it("should allow driver to pay gas station", async function () {
        const amount = ethers.utils.parseUnits("10", 6);
        await driverPayment.connect(driver).pay("LICENSE123", gasStation.address, amount);

        expect(await driverPayment.user_balanceOf()).to.equal(ethers.utils.parseUnits("85", 6));
        expect(await driverPayment.Station_balanceOf()).to.equal(amount);
    });

    it("should not allow driver to pay gas station more than their balance", async function () {
            const amount = ethers.utils.parseUnits("200", 6);
        await expect(driverPayment.connect(driver).pay("LICENSE123", gasStation.address, amount)).to.be.revertedWith("revert");
    });

    it("should allow gas station to withdraw USDC", async function () {
        const amount = ethers.utils.parseUnits("10", 6);
        await driverPayment.connect(driver).pay("LICENSE123", gasStation.address, amount);

        const initialBalance = await usdcToken.balanceOf(gasStation.address);
        await driverPayment.connect(gasStation).Station_withdrawUsdc(amount);
        const finalBalance = await usdcToken.balanceOf(gasStation.address);

        expect(finalBalance.sub(initialBalance)).to.equal(amount.mul(98).div(100)); // Check that the service fee was deducted correctly
    });

    it("should not allow gas station to withdraw more than their balance", async function () {
        const amount = ethers.utils.parseUnits("10", 6);
        await driverPayment.connect(driver).pay("LICENSE123", gasStation.address, amount);

        const balance = await driverPayment.Station_balanceOf();
        await expect(driverPayment.connect(gasStation).Station_withdrawUsdc(balance.add(amount))).to.be.revertedWith("revert");
    });

    it("should allow owner to pay interest to all users", async function () {
        const amount = ethers.utils.parseUnits("100", 6);
        await driverPayment.connect(driver).pay("LICENSE123", gasStation.address, amount);

        const initialBalances = await Promise.all([driverPayment.user_balanceOf(), driverPayment.Station_balanceOf()]);
        await driverPayment.connect(owner).pay_interest();
        const finalBalances = await Promise.all([driverPayment.user_balanceOf(), driverPayment.Station_balanceOf()]);

        expect(finalBalances[0]).to.be.gt(initialBalances[0]); // Check that the driver's balance increased
    });
});
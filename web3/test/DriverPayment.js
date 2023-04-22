// test/DriverPayment.test.js

const { expect } = require("chai");

describe("DriverPayment", function () {
    let owner, driver, gasStation;
    let DriverPayment, driverPayment, usdcToken, uniswapRouter;

    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory("Token");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const hardhatToken = await Token.deploy();

        await hardhatToken.deployed();

        // Fixtures can return anything you consider useful for your tests
        return { Token, hardhatToken, owner, addr1, addr2 };
    }

    beforeEach(async function () {
        [owner, driver, gasStation, signer] = await ethers.getSigners();

        // Deploy the necessary contracts
        uniswapRouter = "0x4648a43b2c14da09fdf82b161150d3f634f40491";
        usdcToken = await ethers.getContractAt("IERC20", "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c");
        ethToken = await ethers.getContractAt("IERC20", "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6");

        DriverPayment = await ethers.getContractFactory("DriverPayment");
        driverPayment = await DriverPayment.deploy(uniswapRouter, usdcToken.address, ethToken.address);

        // Register the driver's car
        await driverPayment.connect(owner).registerCar("LICENSE123", driver.address);

        // Deposit some USDC for the driver
        // const amountUSDC = ethers.utils.parseUnits("1000", 6); // 1000 USDC，小數點位數為 6
        // const amountWETH = ethers.utils.parseUnits("1", 18); // 1 WETH，小數點位數為 18
        // const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; // WETH 合約地址
        // const USDC_ADDRESS = "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b"; // USDC 合約地址
        // const WETH_ABI = require("./WETH_ABI.json");
        // const USDC_ABI = require("./USDC_ABI.json");
        // const USDC = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer); // 使用你的 signer
        // const WETH = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer); // 使用你的 signer

        // await USDC.transfer(driver.address, amountUSDC); // 將 1000 USDC 轉移到指定地址
        // await WETH.transfer(driver.address, amountWETH); // 將 1 WETH 轉移到指定地址
        // const balanceUSDC = await USDC.balanceOf(driver.address); // 確認指定地址的 USDC 餘額
        // console.log("cc");
        // const balanceWETH = await WETH.balanceOf(driver.address); // 確認指定地址的 WETH 餘額
        // assert(balanceUSDC.eq(amountUSDC), "USDC 轉移失敗");
        // assert(balanceWETH.eq(amountWETH), "WETH 轉移失敗");
        // await driver.sendTransaction({ value: ethers.utils.parseEther("1") });

        const amount = ethers.utils.parseUnits("1", 18); // 1 WETH，小數點位數為 18
        console.log("cc");
        await driverPayment.depositWETH(amount);
        console.log("cc");
    });

    it("should allow driver to pay gas station", async function () {
        const amount = ethers.utils.parseUnits("10", 6);
        await driverPayment.connect(owner).pay("LICENSE123", gasStation.address, amount);
        console.log("cc");
        console.log(await driverPayment.connect(driver.address).user_balanceOf());
        expect(await driverPayment.connect(driver.address).user_balanceOf()).to.equal(ethers.utils.parseUnits("85", 6));
        expect(await driverPayment.connect(gasStation.address).Station_balanceOf()).to.equal(amount);
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
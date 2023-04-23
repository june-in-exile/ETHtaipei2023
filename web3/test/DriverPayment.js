const sinon = require('sinon');
const { expect } = require("chai");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("DriverPayment", function () {
    async function deployFixture() {
        const [autopass, driver, station] = await hre.ethers.getSigners();

        const DriverPayment = await hre.ethers.getContractFactory("DriverPayment");
        const Token = await hre.ethers.getContractFactory("Token");

        const token = await Token.deploy();
        await token.deployed();

        const driverPayment = await DriverPayment.deploy(token.address);
        await driverPayment.deployed();

        await token.transfer(driver.address, 10000);
        await token.connect(driver).approve(driverPayment.address, 10000);

        return { autopass, driver, station, driverPayment, token };
    }

    describe("Constructor", function () {
        it("Should set the correct owner and token address", async function () {
            const { autopass, driverPayment, token } = await loadFixture(deployFixture);

            expect(await driverPayment.owner()).to.equal(autopass.address);
            expect(await driverPayment.usdcToken()).to.equal(token.address);
        });
    });

    describe("PlateOperation", function () {
        it("Should be abled to be created, viewed, and deleted boundings of plate to address", async function () {
            const { autopass, driver, driverPayment, token } = await loadFixture(deployFixture);

            await driverPayment.connect(driver).createEntry("ABC123");
            expect(await driverPayment.connect(autopass).viewEntry("ABC123")).to.equal(driver.address);

            await driverPayment.connect(autopass).deleteEntry("ABC123");
            expect(await driverPayment.connect(autopass).viewEntry("ABC123")).to.equal("0x0000000000000000000000000000000000000000");
        });
    });

    describe("EntryOperation", function () {
        it("Should be abled to create, viewe, and delete entry in registry", async function () {
            const { autopass, driver, driverPayment } = await loadFixture(deployFixture);

            await driverPayment.connect(driver).createEntry("ABC123");
            expect(await driverPayment.connect(autopass).viewEntry("ABC123")).to.equal(driver.address);

            await driverPayment.connect(autopass).deleteEntry("ABC123");
            expect(await driverPayment.connect(autopass).viewEntry("ABC123")).to.equal("0x0000000000000000000000000000000000000000");
        });
    });

    describe("Deposit", function () {
        it("Should increase the driver's balance to the correct ammount", async function () {
            const { driver, driverPayment } = await loadFixture(deployFixture);

            await driverPayment.connect(driver).depositUSDC(10000);
            expect(await driverPayment.driverBalances(driver.address)).to.equal(10000);
        });

        it("Should deposit the correct ammount of usdcTokens into the contract", async function () {
            const { driver, driverPayment, token } = await loadFixture(deployFixture);

            await driverPayment.connect(driver).depositUSDC(500);
            expect(await token.balanceOf(driverPayment.address)).to.equal(500);
        });

        it("Should set the timestamps to the current time", async function () {
            const { driver, driverPayment } = await loadFixture(deployFixture);

            await driverPayment.connect(driver).depositUSDC(1);
            const now = new Date();
            const currentTime = Math.floor(now.getTime() / 1000);
            let diff = await driverPayment.timestamps(driver.address) - currentTime
            expect(diff).to.greaterThan(0);
            expect(diff).to.lessThan(5);
        });
    });

    describe("getDriverBalance", function () {
        it("Should be reverted if not called by owner", async function () {
            const { driver, driverPayment } = await loadFixture(deployFixture);

            await expect(driverPayment.connect(driver).getDriverBalance(driver.address)).to.be.reverted;
        });

        it("Should instantly pay the interests to the drivers according to time", async function () {
            const { autopass, driver, driverPayment } = await loadFixture(deployFixture);

            await driverPayment.connect(driver).depositUSDC(100);
            expect(await driverPayment.connect(autopass).callStatic.getDriverBalance(driver.address)).to.equal(100);

            await ethers.provider.send("evm_increaseTime", [61 * 24 * 60 * 60])
            expect(await driverPayment.connect(autopass).callStatic.getDriverBalance(driver.address)).to.equal(121);
            await ethers.provider.send("evm_mine", [])
        });
    });
});


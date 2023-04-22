const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock", function () {
  let lock;
  let tcoin;
  let owner;

  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners(); //獲取部署合約的帳號
    Lock = await ethers.getContractFactory("Lock", owner);
    TestCoin = await ethers.getContractFactory("TestCoin", wallet1);  //ERC20 Token
    lock = await Lock.deploy();
    tcoin = await TestCoin.deploy();

    tcoin.connect(wallet1).transfer(wallet2.address, 100)  //default: wallet1: 5000, wallet2: 0
    
    await tcoin.connect(wallet1).approve(lock.address, 4900)  //set approve amount to maximum to test contract
    await tcoin.connect(wallet2).approve(lock.address, 100)
  });

  describe("deployment", function () {  //test if init value is correct
    it("Should mint tokens to wallet 1", async function () {
      expect(await tcoin.balanceOf(wallet1.address)).to.equal(4900);
      });

    it("Should mint tokens to wallet 2", async function () {
      expect(await tcoin.balanceOf(wallet2.address)).to.equal(100);
      });
  });

  describe("depositFunction", function () {
    it("should deposit TCoin Token into Lock", async function () {
      await lock.connect(wallet1).deposit(tcoin.address, 80);  //wallet1 deposit 80 to Lock
      await lock.connect(wallet2).deposit(tcoin.address, 50);  //wallet2 deposit 50 to Lock

      expect(await tcoin.balanceOf(wallet1.address)).to.equal(4820);  //check the balance of the Tcoin in addr1 outside Lock is as same as design
      expect(await tcoin.balanceOf(wallet2.address)).to.equal(50);  //check the balance of the Tcoin in addr2 outside Lock is as same as design
      expect(await lock.balanceOf(wallet1.address, tcoin.address)).to.equal(80);  //check the balance of the Tcoin in addr1 in Lock is as same as design
      expect(await lock.balanceOf(wallet2.address, tcoin.address)).to.equal(50);  //check the balance of the Tcoin in addr2 in Lock is as same as design
    });
  });
  
  describe("withdrawFunction", function () {
    it("should withdraw TCoin Token from Lock", async function () {
      await lock.connect(wallet1).deposit(tcoin.address, 1500);  
      await lock.connect(wallet1).withdraw(tcoin.address, 700);
      expect(await tcoin.balanceOf(wallet1.address)).to.equal(4100);  //outside Lock: 4900 - 1500 + 700
      expect(await lock.balanceOf(wallet1.address, tcoin.address)).to.equal(800);  //in Lock: 1500 - 700
    });
  });
});
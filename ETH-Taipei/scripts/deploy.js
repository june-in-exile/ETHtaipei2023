const { network, ethers } = require("hardhat");

async function main() {
  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy();

  console.log('Deploying Lock...');
  await lock.deployed();
  console.log("Contract Address:", lock.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

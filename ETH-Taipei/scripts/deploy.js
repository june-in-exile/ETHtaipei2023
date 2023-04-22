const { network, ethers } = require("hardhat");

async function main() {
  const DriverPayment = await ethers.getContractFactory("DriverPayment");
  const driverPayment = await DriverPayment.deploy();

  console.log('Deploying DriverPayment...');
  await driverPayment.deployed();
  console.log("Contract Address:", driverPayment.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { network, ethers } = require("hardhat");

async function main() {
  const DriverPayment = await ethers.getContractFactory("DriverPayment");
  const driverPayment = await DriverPayment.deploy('0x9637b74190bf2FAb40f0EC50f0a7944Fc00E93b6');

  console.log('Deploying DriverPayment...');
  await driverPayment.deployed();
  console.log("Contract Address:", driverPayment.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

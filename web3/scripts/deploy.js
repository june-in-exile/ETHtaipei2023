const { network, ethers } = require("hardhat");

async function main() {
  const DriverPayment = await ethers.getContractFactory("DriverPayment");
  const driverPayment = await DriverPayment.deploy('0x4648a43b2c14da09fdf82b161150d3f634f40491', '0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c', '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6');

  console.log('Deploying DriverPayment...');
  await driverPayment.deployed();
  console.log("Contract Address:", driverPayment.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

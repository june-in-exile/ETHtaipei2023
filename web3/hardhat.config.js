require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const { API_URL, GOERLI_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    goerli: {
      url: API_URL,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  }
};

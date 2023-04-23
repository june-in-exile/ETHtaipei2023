// require('dotenv').config();
// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");

// const { API_URL, GOERLI_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.18",
//   defaultNetwork: "gnosis",
//   networks: {
//     hardhat: {},
//     goerli: {
//       url: API_URL,
//       accounts: [`0x${GOERLI_PRIVATE_KEY}`]
//     },
//     gnosis: {
//       url: "https://rpc.gnosischain.com",
//       accounts: accounts,
//     },
//     chiado: {
//       url: "https://rpc.chiadochain.net",
//       gasPrice: 1000000000,
//       accounts: accounts,
//     },
//   },
//   etherscan: {
//     apiKey: ETHERSCAN_API_KEY,
//   }
// };

require("@nomicfoundation/hardhat-toolbox");

//https://hardhat.org/hardhat-runner/docs/config#json-rpc-based-networks

//Note: keep your mnemonic and private keys securely
//Read more: https://hardhat.org/hardhat-runner/docs/config#hd-wallet-config
//1) You can configure private keys or mnemonic:
//let accounts = ["your private key here"]
let accounts = { mnemonic: "your mnemonic here", }

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  //2) select the default network "gnosis" or "chiado"
  defaultNetwork: "gnosis",
  networks: {
    hardhat: {
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: accounts,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: accounts,
    },
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      chiado: "your key",
      gnosis: "your key",
    },
  }
};
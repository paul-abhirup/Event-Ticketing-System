// const { config } = require("hardhat");

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    }, // Local Hardhat network
    mumbai: {
      url: process.env.POLYGON_RPC_URL, // Polygon RPC URL
      accounts: [process.env.PRIVATE_KEY], // Private key for deployment
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY, // or ETHEREUMSCAN_API_KEY
  },
};

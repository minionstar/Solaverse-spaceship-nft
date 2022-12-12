const dotenv = require("dotenv");
dotenv.config();
const { task } = require("hardhat/config");
const utils = require("ethers").utils;
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("solidity-coverage");
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");

const chainIds = {
  ethereum: 1,
  bsc: 56,
  avalanche: 43114,
  polygon: 137,
  arbitrumOne: 42161,
  optimism: 10,

  goerli: 5,
  hardhat: 1337,
  mumbai: 80001,
  "bsc-testnet": 97,
  fuji: 43113,
  "arbitrum-rinkeby": 421611,
  "optimism-kovan": 69,
  "fantom-testnet": 4002,
};

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
    },
    ethereum: {
      url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
      chainId: chainIds.ethereum,
      accounts: [process.env.PRIVATEKEY],
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/_1kiLW42XlD7zAYXBppStM1eBaqOS0FD", // public infura endpoint
      chainId: chainIds.goerli,
      accounts: [process.env.PRIVATEKEY],
    },
    bsc: {
      url: "https://bsc-dataseed1.binance.org",
      chainId: chainIds.bsc,
      accounts: [process.env.PRIVATEKEY],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: chainIds.avalanche,
      accounts: [process.env.PRIVATEKEY],
    },
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: chainIds.polygon,
      accounts: [process.env.PRIVATEKEY],
    },
    arbitrumOne: {
      url: "https://rpc.ankr.com/arbitrum",
      chainId: chainIds.arbitrumOne,
      accounts: [process.env.PRIVATEKEY],
    },
    optimism: {
      url: "https://mainnet.optimism.io",
      chainId: chainIds.optimism,
      accounts: [process.env.PRIVATEKEY],
    },

    "bsc-testnet": {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: chainIds["bsc-testnet"],
      accounts: [process.env.PRIVATEKEY],
    },
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      chainId: chainIds.fuji,
      accounts: [process.env.PRIVATEKEY],
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      chainId: chainIds.mumbai,
      accounts: [process.env.PRIVATEKEY],
    },
    "arbitrum-rinkeby": {
      url: `https://rinkeby.arbitrum.io/rpc`,
      chainId: chainIds["arbitrum-rinkeby"],
      accounts: [process.env.PRIVATEKEY],
    },
    "optimism-kovan": {
      url: `https://kovan.optimism.io/`,
      chainId: chainIds["optimism-kovan"],
      accounts: [process.env.PRIVATEKEY],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      // binance smart chain
      bsc: process.env.BSCSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      // fantom mainnet
      opera: process.env.FTMSCAN_API_KEY,
      ftmTestnet: process.env.FTMSCAN_API_KEY,
      // // optimism
      // optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
      // optimisticKovan: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
      // polygon
      polygon: process.env.POLYGONSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      // arbitrum
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      arbitrumTestnet: process.env.ARBISCAN_API_KEY,
      // avalanche
      avalanche: process.env.SNOWTRACE_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 21,
    coinmarketcap: 'bcba2286-adc3-4174-824f-1208435ab098',
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: true,
              yulDetails: {
                stackAllocation: true,
                optimizerSteps: "dhfoDgvulfnTUtnIf",
              },
            },
          },
          viaIR: true,
        },
      },
    ],
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
};

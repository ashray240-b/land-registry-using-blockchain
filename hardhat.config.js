require("@nomicfoundation/hardhat-toolbox"); // ⚠ very important

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gas: 12000000,
      gasPrice: 20000000000
    }
  }
};
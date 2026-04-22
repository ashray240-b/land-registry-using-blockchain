const hre = require("hardhat");

async function main() {
  console.log("Deploying LandRegistry contract...");

  // Get contract factory
  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");

  // Deploy contract
  const landRegistry = await LandRegistry.deploy();

  // Wait until deployment is mined (v6 syntax)
  await landRegistry.waitForDeployment();

  // Get deployed contract address
  const address = await landRegistry.getAddress();

  console.log("======================================");
  console.log("LandRegistry deployed successfully!");
  console.log("Contract Address:", address);
  console.log("======================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
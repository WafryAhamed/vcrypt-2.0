import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const VehicleRegistry = await ethers.getContractFactory("VehicleRegistry");
  const registry = await VehicleRegistry.deploy();

  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log("VehicleRegistry deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

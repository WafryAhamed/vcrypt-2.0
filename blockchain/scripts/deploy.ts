import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const VehicleRegistry = await ethers.getContractFactory("VehicleRegistry");
  const registry = await VehicleRegistry.deploy();
  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log("VehicleRegistry deployed to:", address);

  // Update frontend contracts.ts automatically
  const contractsFilePath = path.join(__dirname, "../../client/src/config/contracts.ts");
  if (fs.existsSync(contractsFilePath)) {
    let fileContent = fs.readFileSync(contractsFilePath, "utf8");
    fileContent = fileContent.replace(
      /VEHICLE_REGISTRY:\s*"0x[a-fA-F0-9]{40}"/,
      `VEHICLE_REGISTRY: "${address}"`
    );
    fs.writeFileSync(contractsFilePath, fileContent);
    console.log("Successfully updated frontend contracts.ts with new address!");
  } else {
    console.log("contracts.ts not found at expected path, skipping auto-update.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

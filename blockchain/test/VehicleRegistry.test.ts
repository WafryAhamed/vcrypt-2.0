import { expect } from "chai";
import { ethers } from "hardhat";

describe("VehicleRegistry", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const VehicleRegistry = await ethers.getContractFactory("VehicleRegistry");
    const registry = await VehicleRegistry.deploy();

    return { registry, owner, otherAccount };
  }

  it("Should register a vehicle and verify it", async function () {
    const { registry, owner } = await deployFixture();

    const tx = await registry.registerVehicle("VIN123", "ipfs://metadata");
    await tx.wait();

    // Verify
    const isVerified = await registry.verifyVehicle("VIN123");
    expect(isVerified).to.be.true;

    // Get Vehicle Struct
    const vehicle = await registry.getVehicle(1);
    expect(vehicle.vin).to.equal("VIN123");
    expect(vehicle.owner).to.equal(owner.address);
    expect(vehicle.isActive).to.be.true;
  });

  it("Should prevent duplicate VIN registration", async function () {
    const { registry } = await deployFixture();

    await registry.registerVehicle("VIN123", "ipfs://metadata");

    await expect(
      registry.registerVehicle("VIN123", "ipfs://metadata2")
    ).to.be.revertedWith("Vehicle with this VIN already registered");
  });

  it("Should transfer ownership correctly", async function () {
    const { registry, owner, otherAccount } = await deployFixture();

    await registry.registerVehicle("VIN123", "ipfs://metadata");
    
    const tx = await registry.transferVehicle(1, otherAccount.address);
    await tx.wait();

    const vehicle = await registry.getVehicle(1);
    expect(vehicle.owner).to.equal(otherAccount.address);
  });

  it("Should prevent non-owners from transferring", async function () {
    const { registry, otherAccount } = await deployFixture();

    await registry.registerVehicle("VIN123", "ipfs://metadata");
    
    // Connect as otherAccount to attempt transfer
    await expect(
      registry.connect(otherAccount).transferVehicle(1, otherAccount.address)
    ).to.be.revertedWith("Not the owner");
  });
});

const { ethers } = require("ethers");
const { prisma } = require("../db/prismaClient");
const path = require("path");
const fs = require("fs");

let contractABI = [];
try {
  const artifactPath = path.resolve(__dirname, "../../../blockchain/artifacts/contracts/VehicleRegistry.sol/VehicleRegistry.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    contractABI = artifact.abi;
  } else {
    contractABI = [
      "event VehicleRegistered(uint256 indexed tokenId, string vin, address owner)",
      "event VehicleTransferred(uint256 indexed tokenId, address from, address to)"
    ];
  }
} catch (e) {
  contractABI = [
      "event VehicleRegistered(uint256 indexed tokenId, string vin, address owner)",
      "event VehicleTransferred(uint256 indexed tokenId, address from, address to)"
  ];
}

function startEventListener() {
  const rpcUrl = process.env.RPC_WEBSOCKET_URL || process.env.ALCHEMY_RPC_URL || "ws://127.0.0.1:8545"; 
  const provider = new ethers.WebSocketProvider(rpcUrl).catch(() => new ethers.JsonRpcProvider(rpcUrl));
  
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.warn("⚠️ No CONTRACT_ADDRESS provided in environment. Blockchain event listener is disabled.");
    return;
  }

  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  console.log(`🎧 Listening for blockchain events on contract: ${contractAddress}`);

  contract.on("VehicleRegistered", async (tokenId, vin, ownerAddress, event) => {
    try {
      const txHash = event.log ? event.log.transactionHash : event.transactionHash;
      console.log(`✅ [Event] VehicleRegistered | VIN: ${vin} | Tx: ${txHash}`);
      
      const vehicle = await prisma.vehicle.findUnique({ where: { vin } });
      if (vehicle) {
        // Vehicle was created as PENDING by the frontend submission, let's confirm it
        await prisma.vehicle.update({
          where: { vin },
          data: { status: "ACTIVE", txHash }
        });

        // Update the transaction status on our end
        await prisma.transaction.updateMany({
          where: { vehicleId: vehicle.id, txHash, type: "REGISTRATION" },
          data: { status: "CONFIRMED" }
        });
      }
    } catch (err) {
      console.error(`❌ Error processing VehicleRegistered event:`, err.message);
    }
  });

  contract.on("VehicleTransferred", async (tokenId, from, to, event) => {
    try {
      const txHash = event.log ? event.log.transactionHash : event.transactionHash;
      console.log(`✅ [Event] VehicleTransferred | TokenID: ${tokenId} | To: ${to} | Tx: ${txHash}`);
      
      // Need to map tokenId to Vehicle somehow. Let's find pending transfers with this txHash
      const pendingTx = await prisma.transaction.findUnique({
        where: { txHash },
        include: { vehicle: true }
      });

      if (pendingTx && pendingTx.type === "TRANSFER") {
        await prisma.transaction.update({
          where: { id: pendingTx.id },
          data: { status: "CONFIRMED" }
        });

        // Make sure the vehicle status is active again after transfer
        await prisma.vehicle.update({
          where: { id: pendingTx.vehicleId },
          data: { status: "ACTIVE" } // Assuming ownership was updated safely
        });
      }
    } catch (err) {
      console.error(`❌ Error processing VehicleTransferred event:`, err.message);
    }
  });
}

module.exports = { startEventListener };

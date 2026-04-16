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

async function startEventListener() {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.warn("⚠️ [Event Listener] No CONTRACT_ADDRESS provided in environment. Blockchain listener safely disabled.");
      return;
    }

    const wssUrl = process.env.WSS_RPC_URL;
    const httpUrl = process.env.RPC_URL || process.env.ALCHEMY_RPC_URL || "http://127.0.0.1:8545";

    let provider;
    
    // 1. SAFELY INITIALIZE PROVIDER WITH FALLBACK
    if (wssUrl) {
      try {
        console.log(`🌐 [Event Listener] Attempting WebSocket connection to: ${wssUrl}`);
        provider = new ethers.WebSocketProvider(wssUrl);
        
        // 2. HANDLE PROVIDER WEBSOCKET ERRORS
        if (provider.websocket) {
          provider.websocket.on("error", (error) => {
            console.warn("⚠️ [Event Listener] WebSocket error occurred:", error.message);
          });
          provider.websocket.on("close", () => {
            console.warn("⚠️ [Event Listener] WebSocket connection closed unexpectedly.");
          });
        }
        console.log("✅ [Event Listener] Using WebSocket provider.");
      } catch (err) {
        console.warn(`⚠️ [Event Listener] WebSocketProvider setup failed: ${err.message}. Falling back to JsonRpcProvider.`);
        provider = new ethers.JsonRpcProvider(httpUrl);
        console.log(`✅ [Event Listener] Using fallback JsonRpcProvider: ${httpUrl}`);
      }
    } else {
      provider = new ethers.JsonRpcProvider(httpUrl);
      console.log(`✅ [Event Listener] Using JsonRpcProvider: ${httpUrl}`);
    }

    // 3. HANDLE PROVIDER-LEVEL ERRORS
    provider.on("error", (error) => {
      console.warn("⚠️ [Event Listener] Ethers Provider Network Error:", error.message);
    });

    // 4. ATTEMPT NETWORK CONNECTION BEFORE CONTRACT INIT
    try {
      await provider.getNetwork();
    } catch (networkErr) {
      console.warn("⚠️ [Event Listener] Blockchain network is currently unavailable or refusing connection.");
      console.warn("⚠️ [Event Listener] Listener disabled to prevent server crashes.");
      return; // Safely return without crashing the server
    }

    // 5. CAREFULLY INIT CONTRACT
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log(`🎧 [Event Listener] Successfully listening on contract: ${contractAddress}`);

    contract.on("VehicleRegistered", async (tokenId, vin, ownerAddress, event) => {
      try {
        const txHash = event?.log?.transactionHash || event?.transactionHash || "UnknownTx";
        console.log(`🚗✅ [Event] VehicleRegistered | VIN: ${vin} | Tx: ${txHash}`);
        
        const vehicle = await prisma.vehicle.findUnique({ where: { vin } });
        if (vehicle) {
          await prisma.vehicle.update({
            where: { vin },
            data: { status: "ACTIVE", txHash }
          });

          await prisma.transaction.updateMany({
            where: { vehicleId: vehicle.id, txHash, type: "REGISTRATION" },
            data: { status: "CONFIRMED" }
          });
        }
      } catch (err) {
        console.error(`❌ [Event] Error processing VehicleRegistered:`, err.message);
      }
    });

    contract.on("VehicleTransferred", async (tokenId, from, to, event) => {
      try {
        const txHash = event?.log?.transactionHash || event?.transactionHash || "UnknownTx";
        console.log(`🔄✅ [Event] VehicleTransferred | TokenID: ${tokenId} | To: ${to} | Tx: ${txHash}`);
        
        const pendingTx = await prisma.transaction.findUnique({
          where: { txHash },
          include: { vehicle: true }
        });

        if (pendingTx && pendingTx.type === "TRANSFER") {
          await prisma.transaction.update({
            where: { id: pendingTx.id },
            data: { status: "CONFIRMED" }
          });

          await prisma.vehicle.update({
            where: { id: pendingTx.vehicleId },
            data: { status: "ACTIVE" }
          });
        }
      } catch (err) {
        console.error(`❌ [Event] Error processing VehicleTransferred:`, err.message);
      }
    });

  } catch (fatalError) {
    // 6. ULTIMATE CATCH-ALL TO PREVENT CRASHES
    console.error("🚨 [Event Listener] Fatal setup error properly caught:", fatalError.message);
  }
}

module.exports = { startEventListener };

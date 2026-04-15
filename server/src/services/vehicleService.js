const { prisma } = require("../db/prismaClient");
const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

let contractABI = [];
try {
  const artifactPath = path.resolve(__dirname, "../../../blockchain/artifacts/contracts/VehicleRegistry.sol/VehicleRegistry.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    contractABI = artifact.abi;
  } else {
    // Basic ABI if not compiled yet
    contractABI = [
      "function registerVehicle(string vin, string metadataURI)",
      "function transferVehicle(uint256 tokenId, address to)",
      "function verifyVehicle(string vin) view returns (bool, address, string)"
    ];
  }
} catch (e) {
  console.log("Could not load contract ABI, using fallback");
  contractABI = [
      "function registerVehicle(string vin, string metadataURI)",
      "function transferVehicle(uint256 tokenId, address to)",
      "function verifyVehicle(string vin) view returns (bool, address, string)"
  ];
}

const getContract = () => {
    const rpcUrl = process.env.ALCHEMY_RPC_URL || "https://rpc-amoy.polygon.technology";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // For verify (read-only)
    const readContract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS || ethers.ZeroAddress,
      contractABI,
      provider
    );

    // For register/transfer (write)
    const privateKey = process.env.BACKEND_PRIVATE_KEY;
    let writeContract = null;
    if (privateKey) {
        const wallet = new ethers.Wallet(privateKey, provider);
        writeContract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS || ethers.ZeroAddress,
          contractABI,
          wallet
        );
    }
    
    return { readContract, writeContract };
}

async function registerVehicleService(userId, data) {
  const { vin, make, model, year, color, registrationNumber, txHash } = data;

  const existingVin = await prisma.vehicle.findUnique({ where: { vin } });
  if (existingVin) throw new Error("A vehicle with this VIN already exists.");

  const existingReg = await prisma.vehicle.findUnique({ where: { registrationNumber } });
  if (existingReg) throw new Error("A vehicle with this registration number already exists.");

  let finalTxHash = txHash;

  // Blockchain interaction (if writeContract is configured and no txHash was provided by frontend)
  const { writeContract } = getContract();
  if (writeContract && !finalTxHash) {
     try {
       const tx = await writeContract.registerVehicle(vin, `ipfs://${vin}`); // placeholder metadataURI
       const receipt = await tx.wait();
       finalTxHash = receipt.hash;
     } catch (err) {
       console.error("Blockchain registration failed:", err.message);
       // We can decide to throw or proceed depending on strictness. Let's throw to enforce blockchain sync.
       throw new Error("Blockchain registration failed: " + err.message);
     }
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      vin, make, model, year: parseInt(year, 10), color, registrationNumber,
      ownerId: userId,
      txHash: finalTxHash || null,
      status: "ACTIVE",
    },
    include: {
      owner: {
        select: { id: true, email: true, walletAddress: true },
      },
    },
  });

  if (finalTxHash) {
    await prisma.transaction.create({
      data: {
        vehicleId: vehicle.id,
        fromUserId: userId,
        toUserId: userId,
        txHash: finalTxHash,
        type: "REGISTRATION",
        status: "CONFIRMED",
      },
    });
  }

  return vehicle;
}

async function getMyVehiclesList(userId) {
  return await prisma.vehicle.findMany({
    where: { ownerId: userId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, txHash: true, type: true, status: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getVehicleDetailsByVin(vin) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { vin },
    include: {
      owner: { select: { id: true, email: true, walletAddress: true, role: true } },
      transactions: {
        orderBy: { createdAt: "desc" },
        include: {
          fromUser: { select: { id: true, email: true, walletAddress: true } },
          toUser: { select: { id: true, email: true, walletAddress: true } },
        },
      },
    },
  });
  
  if (!vehicle) throw new Error("Vehicle not found.");
  return vehicle;
}

async function transferVehicleService(userId, { vin, toUserId, txHash }) {
  const vehicle = await prisma.vehicle.findUnique({ where: { vin } });
  if (!vehicle) throw new Error("Vehicle not found.");
  
  if (vehicle.ownerId !== userId) {
    throw new Error("You are not the owner of this vehicle.");
  }

  const toUser = await prisma.user.findUnique({ where: { id: parseInt(toUserId, 10) } });
  if (!toUser) throw new Error("Recipient user not found.");

  let finalTxHash = txHash;

  // Blockchain interaction if no txHash provided
  const { writeContract } = getContract();
  if (writeContract && !finalTxHash) {
      try {
        // Assume tokenId is the vehicle ID 
        const tx = await writeContract.transferVehicle(vehicle.id, toUser.walletAddress || ethers.ZeroAddress);
        const receipt = await tx.wait();
        finalTxHash = receipt.hash;
      } catch(err) {
        throw new Error("Blockchain transfer failed: " + err.message);
      }
  }

  const [updatedVehicle, transaction] = await prisma.$transaction([
    prisma.vehicle.update({
      where: { vin },
      data: {
        ownerId: parseInt(toUserId, 10),
        status: "TRANSFERRED",
        txHash: finalTxHash,
      },
      include: {
        owner: { select: { id: true, email: true, walletAddress: true } },
      },
    }),
    prisma.transaction.create({
      data: {
        vehicleId: vehicle.id,
        fromUserId: userId,
        toUserId: parseInt(toUserId, 10),
        txHash: finalTxHash || "0x0", // TxHash is required by Prisma schema potentially, better have it
        type: "TRANSFER",
        status: "CONFIRMED",
      },
    }),
  ]);

  return { vehicle: updatedVehicle, transaction };
}

async function verifyVehicleService(vin) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { vin },
    include: {
      owner: { select: { id: true, email: true, walletAddress: true, role: true } },
      transactions: {
        orderBy: { createdAt: "asc" },
        include: {
          fromUser: { select: { id: true, email: true, walletAddress: true } },
          toUser: { select: { id: true, email: true, walletAddress: true } },
        },
      },
    },
  });

  if (!vehicle) throw new Error("Vehicle not found. Verification failed.");

  const { readContract } = getContract();
  let onChainVerified = false;
  if(readContract && process.env.CONTRACT_ADDRESS) {
      try {
          // This calls verifyVehicle on the blockchain
          const result = await readContract.verifyVehicle(vin);
          // result depending on tuple returned
          onChainVerified = result; 
      } catch (e) {
          console.error("On-chain verification error (ignoring for now):", e.message);
      }
  }

  return {
    verified: true, // DB verified
    onChainVerified: !!onChainVerified,
    vehicle,
    transactionCount: vehicle.transactions.length,
    currentOwner: vehicle.owner,
    history: vehicle.transactions,
  };
}

module.exports = {
  registerVehicleService,
  getMyVehiclesList,
  getVehicleDetailsByVin,
  transferVehicleService,
  verifyVehicleService,
};

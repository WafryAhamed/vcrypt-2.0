const { prisma } = require("../db/prismaClient");

async function createTransaction({ vehicleId, fromUserId, toUserId, txHash, type }) {
  const validTypes = ["REGISTRATION", "TRANSFER", "VERIFICATION"];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid transaction type. Must be one of: ${validTypes.join(", ")}.`);
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(vehicleId, 10) },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found.");
  }

  const toUser = await prisma.user.findUnique({
    where: { id: parseInt(toUserId, 10) },
  });

  if (!toUser) {
    throw new Error("Recipient user not found.");
  }

  const transaction = await prisma.transaction.create({
    data: {
      vehicleId: parseInt(vehicleId, 10),
      fromUserId,
      toUserId: parseInt(toUserId, 10),
      txHash,
      type,
      status: "PENDING",
    },
    include: {
      vehicle: {
        select: {
          id: true,
          vin: true,
          make: true,
          model: true,
          registrationNumber: true,
        },
      },
      fromUser: { select: { id: true, email: true, walletAddress: true } },
      toUser: { select: { id: true, email: true, walletAddress: true } },
    },
  });

  return transaction;
}

async function getTransactionsByVehicleCode(vehicleId) {
  return await prisma.transaction.findMany({
    where: { vehicleId: parseInt(vehicleId, 10) },
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: {
        select: {
          id: true,
          vin: true,
          make: true,
          model: true,
          registrationNumber: true,
        },
      },
      fromUser: { select: { id: true, email: true, walletAddress: true } },
      toUser: { select: { id: true, email: true, walletAddress: true } },
    },
  });
}

async function getMyTransactionsList(userId) {
  return await prisma.transaction.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: {
        select: {
          id: true,
          vin: true,
          make: true,
          model: true,
          registrationNumber: true,
        },
      },
      fromUser: { select: { id: true, email: true, walletAddress: true } },
      toUser: { select: { id: true, email: true, walletAddress: true } },
    },
  });
}

async function updateTransactionStatusRecord({ txHash, status }) {
  const validStatuses = ["PENDING", "CONFIRMED", "FAILED"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}.`);
  }

  const existingTransaction = await prisma.transaction.findUnique({
    where: { txHash },
  });

  if (!existingTransaction) {
    throw new Error("Transaction not found.");
  }

  const transaction = await prisma.transaction.update({
    where: { txHash },
    data: { status },
    include: {
      vehicle: {
        select: {
          id: true,
          vin: true,
          make: true,
          model: true,
          registrationNumber: true,
        },
      },
      fromUser: { select: { id: true, email: true, walletAddress: true } },
      toUser: { select: { id: true, email: true, walletAddress: true } },
    },
  });

  return transaction;
}

module.exports = {
  createTransaction,
  getTransactionsByVehicleCode,
  getMyTransactionsList,
  updateTransactionStatusRecord,
};

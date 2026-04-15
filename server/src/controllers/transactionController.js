// ──────────────────────────────────────────────
// vcrypt — Transaction Controller
// ──────────────────────────────────────────────

const { prisma } = require("../db/prismaClient");

/**
 * POST /api/transactions
 * Create a new transaction record.
 */
async function createTransaction(req, res) {
  try {
    const { vehicleId, toUserId, txHash, type } = req.body;

    // Validate required fields
    if (!vehicleId || !toUserId || !txHash || !type) {
      return res.status(400).json({
        success: false,
        error: "vehicleId, toUserId, txHash, and type are required.",
      });
    }

    // Validate type enum
    const validTypes = ["REGISTRATION", "TRANSFER", "VERIFICATION"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid transaction type. Must be one of: ${validTypes.join(", ")}.`,
      });
    }

    // Verify the vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId, 10) },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found.",
      });
    }

    // Verify the recipient user exists
    const toUser = await prisma.user.findUnique({
      where: { id: parseInt(toUserId, 10) },
    });

    if (!toUser) {
      return res.status(404).json({
        success: false,
        error: "Recipient user not found.",
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        vehicleId: parseInt(vehicleId, 10),
        fromUserId: req.user.id,
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
        fromUser: {
          select: { id: true, email: true, walletAddress: true },
        },
        toUser: {
          select: { id: true, email: true, walletAddress: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    // Handle duplicate txHash
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "A transaction with this hash already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create transaction.",
    });
  }
}

/**
 * GET /api/transactions/vehicle/:vehicleId
 * Get all transactions for a specific vehicle.
 */
async function getTransactionsByVehicle(req, res) {
  try {
    const { vehicleId } = req.params;

    const transactions = await prisma.transaction.findMany({
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
        fromUser: {
          select: { id: true, email: true, walletAddress: true },
        },
        toUser: {
          select: { id: true, email: true, walletAddress: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions by vehicle error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch transactions.",
    });
  }
}

/**
 * GET /api/transactions/my
 * Get all transactions involving the authenticated user.
 */
async function getMyTransactions(req, res) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ fromUserId: req.user.id }, { toUserId: req.user.id }],
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
        fromUser: {
          select: { id: true, email: true, walletAddress: true },
        },
        toUser: {
          select: { id: true, email: true, walletAddress: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get my transactions error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch transactions.",
    });
  }
}

/**
 * PATCH /api/transactions/status
 * Update a transaction's status by txHash.
 */
async function updateTransactionStatus(req, res) {
  try {
    const { txHash, status } = req.body;

    if (!txHash || !status) {
      return res.status(400).json({
        success: false,
        error: "txHash and status are required.",
      });
    }

    // Validate status enum
    const validStatuses = ["PENDING", "CONFIRMED", "FAILED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}.`,
      });
    }

    // Find the transaction
    const existingTransaction = await prisma.transaction.findUnique({
      where: { txHash },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found.",
      });
    }

    // Update the status
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
        fromUser: {
          select: { id: true, email: true, walletAddress: true },
        },
        toUser: {
          select: { id: true, email: true, walletAddress: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Update transaction status error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update transaction status.",
    });
  }
}

module.exports = {
  createTransaction,
  getTransactionsByVehicle,
  getMyTransactions,
  updateTransactionStatus,
};

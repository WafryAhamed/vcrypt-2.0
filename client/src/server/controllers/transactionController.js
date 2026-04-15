import prisma from '../db/prismaClient.js';

/**
 * POST /api/transactions
 * Create a new transaction record.
 */
const createTransaction = async (req, res) => {
  try {
    const { vehicleId, toUserId, txHash, type } = req.body;

    if (!vehicleId || !txHash || !type) {
      return res.status(400).json({
        success: false,
        error: 'vehicleId, txHash, and type are required.',
      });
    }

    const validTypes = ['REGISTRATION', 'TRANSFER', 'VERIFICATION'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found.',
      });
    }

    // Check for duplicate txHash
    const existingTx = await prisma.transaction.findUnique({
      where: { txHash },
    });

    if (existingTx) {
      return res.status(409).json({
        success: false,
        error: 'A transaction with this hash already exists.',
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        vehicleId,
        fromUserId: req.user.id,
        toUserId: toUserId || req.user.id,
        txHash,
        type,
        status: 'PENDING',
      },
      include: {
        vehicle: true,
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
  } catch (err) {
    console.error('Create transaction error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create transaction.',
    });
  }
};

/**
 * GET /api/transactions/vehicle/:vehicleId
 * Get all transactions for a specific vehicle.
 */
const getTransactionsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const transactions = await prisma.transaction.findMany({
      where: { vehicleId },
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
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.error('Get transactions by vehicle error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions.',
    });
  }
};

/**
 * GET /api/transactions/my
 * Get all transactions where the authenticated user is sender or receiver.
 * Also supports ?walletAddress= for backward compatibility.
 */
const getMyTransactions = async (req, res) => {
  try {
    let userId = req.user.id;

    // Support legacy walletAddress query param
    const { walletAddress } = req.query;
    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
      });
      if (user) {
        userId = user.id;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
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
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.error('Get my transactions error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions.',
    });
  }
};

/**
 * PATCH /api/transactions/status
 * Update a transaction's status by txHash.
 */
const updateTransactionStatus = async (req, res) => {
  try {
    const { txHash, status } = req.body;

    if (!txHash || !status) {
      return res.status(400).json({
        success: false,
        error: 'txHash and status are required.',
      });
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'FAILED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { txHash },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found.',
      });
    }

    const updated = await prisma.transaction.update({
      where: { txHash },
      data: { status },
      include: {
        vehicle: true,
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
      data: updated,
    });
  } catch (err) {
    console.error('Update transaction status error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update transaction status.',
    });
  }
};

export {
  createTransaction,
  getTransactionsByVehicle,
  getMyTransactions,
  updateTransactionStatus,
};
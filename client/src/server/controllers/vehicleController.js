import prisma from '../db/prismaClient.js';

/**
 * POST /api/vehicles/register
 * Register a new vehicle linked to the authenticated user.
 */
const registerVehicle = async (req, res) => {
  try {
    const {
      vin,
      make,
      model,
      year,
      color,
      registrationNumber,
      txHash,
      ownerAddress,
      licensePlate,
      chassisNumber,
      engineNumber,
    } = req.body;

    // Support both new field names and legacy field names from frontend
    const finalVin = vin || chassisNumber;
    const finalRegNumber = registrationNumber || licensePlate;

    if (!finalVin || !make || !model || !year || !finalRegNumber) {
      return res.status(400).json({
        success: false,
        error: 'VIN, make, model, year, and registration number are required.',
      });
    }

    // Check for duplicate VIN or registration number
    const existing = await prisma.vehicle.findFirst({
      where: {
        OR: [{ vin: finalVin }, { registrationNumber: finalRegNumber }],
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'A vehicle with this VIN or registration number already exists.',
      });
    }

    // Resolve owner: use authenticated user, or look up by wallet address
    let ownerId = req.user.id;
    if (ownerAddress && ownerAddress !== req.user.walletAddress) {
      const ownerUser = await prisma.user.findUnique({
        where: { walletAddress: ownerAddress },
      });
      if (ownerUser) {
        ownerId = ownerUser.id;
      }
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vin: finalVin,
        make,
        model,
        year: parseInt(year, 10),
        color: color || null,
        registrationNumber: finalRegNumber,
        ownerId,
        status: 'ACTIVE',
        txHash: txHash || null,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
            role: true,
          },
        },
      },
    });

    // Create a REGISTRATION transaction if txHash is provided
    if (txHash) {
      await prisma.transaction.create({
        data: {
          vehicleId: vehicle.id,
          fromUserId: ownerId,
          toUserId: ownerId,
          txHash,
          type: 'REGISTRATION',
          status: 'CONFIRMED',
        },
      });
    }

    return res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error('Register vehicle error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to register vehicle.',
    });
  }
};

/**
 * GET /api/vehicles/my
 * Get all vehicles owned by the authenticated user.
 * Also supports ?walletAddress= query param for backward compatibility.
 */
const getMyVehicles = async (req, res) => {
  try {
    let ownerId = req.user.id;

    // Support legacy walletAddress query param
    const { walletAddress } = req.query;
    if (walletAddress) {
      const ownerUser = await prisma.user.findUnique({
        where: { walletAddress },
      });
      if (ownerUser) {
        ownerId = ownerUser.id;
      }
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
            role: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (err) {
    console.error('Get my vehicles error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicles.',
    });
  }
};

/**
 * GET /api/vehicles/:vin
 * Get a single vehicle by VIN, including owner and transactions.
 */
const getVehicleByVin = async (req, res) => {
  try {
    const { vin } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { vin },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
            role: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          include: {
            fromUser: {
              select: { id: true, email: true, walletAddress: true },
            },
            toUser: {
              select: { id: true, email: true, walletAddress: true },
            },
          },
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error('Get vehicle by VIN error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle.',
    });
  }
};

/**
 * POST /api/vehicles/transfer
 * Transfer vehicle ownership to another user.
 */
const transferVehicle = async (req, res) => {
  try {
    const { vehicleId, recipientAddress, txHash, currentOwnerAddress, vin } =
      req.body;

    // Find the vehicle by ID or VIN
    let vehicle = null;
    if (vehicleId) {
      vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });
    } else if (vin) {
      vehicle = await prisma.vehicle.findUnique({
        where: { vin },
      });
    }

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found.',
      });
    }

    // Verify the current user owns the vehicle
    if (vehicle.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You are not the owner of this vehicle.',
      });
    }

    if (!recipientAddress) {
      return res.status(400).json({
        success: false,
        error: 'Recipient wallet address is required.',
      });
    }

    // Find or create the recipient user
    let recipient = await prisma.user.findUnique({
      where: { walletAddress: recipientAddress },
    });

    if (!recipient) {
      recipient = await prisma.user.create({
        data: {
          walletAddress: recipientAddress,
          role: 'owner',
        },
      });
    }

    // Perform transfer in a transaction
    const [updatedVehicle, transaction] = await prisma.$transaction([
      prisma.vehicle.update({
        where: { id: vehicle.id },
        data: {
          ownerId: recipient.id,
          status: 'TRANSFERRED',
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              walletAddress: true,
              role: true,
            },
          },
        },
      }),
      prisma.transaction.create({
        data: {
          vehicleId: vehicle.id,
          fromUserId: req.user.id,
          toUserId: recipient.id,
          txHash: txHash || `transfer_${Date.now()}`,
          type: 'TRANSFER',
          status: txHash ? 'CONFIRMED' : 'PENDING',
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        vehicle: updatedVehicle,
        transaction,
      },
    });
  } catch (err) {
    console.error('Transfer vehicle error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to transfer vehicle.',
    });
  }
};

/**
 * GET /api/vehicles/verify/:vin
 * Verify a vehicle by VIN — returns vehicle data + full transaction history.
 * This is a public endpoint (no auth required).
 */
const verifyVehicle = async (req, res) => {
  try {
    const { vin } = req.params;

    // Also support legacy route: /api/vehicles/verify/:searchType/:searchValue
    const searchValue = req.params.searchValue || vin;
    const searchType = req.params.searchType || 'vin';

    let vehicle = null;

    if (searchType === 'vin' || searchType === 'chassisNumber') {
      vehicle = await prisma.vehicle.findUnique({
        where: { vin: searchValue },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              walletAddress: true,
              role: true,
            },
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
            include: {
              fromUser: {
                select: { id: true, email: true, walletAddress: true },
              },
              toUser: {
                select: { id: true, email: true, walletAddress: true },
              },
            },
          },
        },
      });
    } else if (
      searchType === 'registrationNumber' ||
      searchType === 'licensePlate'
    ) {
      vehicle = await prisma.vehicle.findUnique({
        where: { registrationNumber: searchValue },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              walletAddress: true,
              role: true,
            },
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
            include: {
              fromUser: {
                select: { id: true, email: true, walletAddress: true },
              },
              toUser: {
                select: { id: true, email: true, walletAddress: true },
              },
            },
          },
        },
      });
    }

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error('Verify vehicle error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify vehicle.',
    });
  }
};

/**
 * GET /api/vehicles (admin)
 * Get all vehicles — for backward compatibility with useMongoDB hook's getAllVehicles().
 */
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (err) {
    console.error('Get all vehicles error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicles.',
    });
  }
};

/**
 * PUT /api/vehicles/:vehicleId/status
 * Update the status of a vehicle — for backward compatibility.
 */
const updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'TRANSFERRED', 'FLAGGED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error('Update vehicle status error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update vehicle status.',
    });
  }
};

export {
  registerVehicle,
  getMyVehicles,
  getVehicleByVin,
  transferVehicle,
  verifyVehicle,
  getAllVehicles,
  updateVehicleStatus,
};
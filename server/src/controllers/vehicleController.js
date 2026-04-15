// ──────────────────────────────────────────────
// vcrypt — Vehicle Controller
// ──────────────────────────────────────────────

const { prisma } = require("../db/prismaClient");

/**
 * POST /api/vehicles/register
 * Register a new vehicle linked to the authenticated user.
 */
async function registerVehicle(req, res) {
  try {
    const { vin, make, model, year, color, registrationNumber, txHash } =
      req.body;

    // Validate required fields
    if (!vin || !make || !model || !year || !color || !registrationNumber) {
      return res.status(400).json({
        success: false,
        error:
          "All vehicle fields are required: vin, make, model, year, color, registrationNumber.",
      });
    }

    // Check for duplicate VIN
    const existingVin = await prisma.vehicle.findUnique({
      where: { vin },
    });

    if (existingVin) {
      return res.status(409).json({
        success: false,
        error: "A vehicle with this VIN already exists.",
      });
    }

    // Check for duplicate registration number
    const existingReg = await prisma.vehicle.findUnique({
      where: { registrationNumber },
    });

    if (existingReg) {
      return res.status(409).json({
        success: false,
        error: "A vehicle with this registration number already exists.",
      });
    }

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        vin,
        make,
        model,
        year: parseInt(year, 10),
        color,
        registrationNumber,
        ownerId: req.user.id,
        txHash: txHash || null,
        status: "ACTIVE",
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
          },
        },
      },
    });

    // Create a REGISTRATION transaction record
    if (txHash) {
      await prisma.transaction.create({
        data: {
          vehicleId: vehicle.id,
          fromUserId: req.user.id,
          toUserId: req.user.id,
          txHash,
          type: "REGISTRATION",
          status: "CONFIRMED",
        },
      });
    }

    return res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Register vehicle error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to register vehicle.",
    });
  }
}

/**
 * GET /api/vehicles/my
 * Get all vehicles owned by the authenticated user.
 */
async function getMyVehicles(req, res) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: req.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            txHash: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Get my vehicles error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch vehicles.",
    });
  }
}

/**
 * GET /api/vehicles/:vin
 * Get a vehicle by VIN, including owner and transactions.
 */
async function getVehicleByVin(req, res) {
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
          orderBy: { createdAt: "desc" },
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
        error: "Vehicle not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Get vehicle by VIN error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch vehicle.",
    });
  }
}

/**
 * POST /api/vehicles/transfer
 * Transfer vehicle ownership to another user.
 */
async function transferVehicle(req, res) {
  try {
    const { vin, toUserId, txHash } = req.body;

    if (!vin || !toUserId || !txHash) {
      return res.status(400).json({
        success: false,
        error: "vin, toUserId, and txHash are required.",
      });
    }

    // Find the vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { vin },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found.",
      });
    }

    // Verify ownership
    if (vehicle.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "You are not the owner of this vehicle.",
      });
    }

    // Verify the recipient exists
    const toUser = await prisma.user.findUnique({
      where: { id: parseInt(toUserId, 10) },
    });

    if (!toUser) {
      return res.status(404).json({
        success: false,
        error: "Recipient user not found.",
      });
    }

    // Perform transfer within a transaction
    const [updatedVehicle, transaction] = await prisma.$transaction([
      // Update vehicle owner and status
      prisma.vehicle.update({
        where: { vin },
        data: {
          ownerId: parseInt(toUserId, 10),
          status: "TRANSFERRED",
          txHash,
        },
        include: {
          owner: {
            select: { id: true, email: true, walletAddress: true },
          },
        },
      }),
      // Create transfer transaction record
      prisma.transaction.create({
        data: {
          vehicleId: vehicle.id,
          fromUserId: req.user.id,
          toUserId: parseInt(toUserId, 10),
          txHash,
          type: "TRANSFER",
          status: "CONFIRMED",
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
  } catch (error) {
    console.error("Transfer vehicle error:", error);

    // Handle duplicate txHash
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "A transaction with this hash already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to transfer vehicle.",
    });
  }
}

/**
 * GET /api/vehicles/verify/:vin
 * Verify a vehicle — return full data + transaction history.
 */
async function verifyVehicle(req, res) {
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
          orderBy: { createdAt: "asc" },
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
        error: "Vehicle not found. Verification failed.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        verified: true,
        vehicle,
        transactionCount: vehicle.transactions.length,
        currentOwner: vehicle.owner,
        history: vehicle.transactions,
      },
    });
  } catch (error) {
    console.error("Verify vehicle error:", error);
    return res.status(500).json({
      success: false,
      error: "Verification failed.",
    });
  }
}

module.exports = {
  registerVehicle,
  getMyVehicles,
  getVehicleByVin,
  transferVehicle,
  verifyVehicle,
};

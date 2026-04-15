// ──────────────────────────────────────────────
// vcrypt — User Controller
// ──────────────────────────────────────────────

const bcrypt = require("bcryptjs");
const { prisma } = require("../db/prismaClient");
const { generateToken } = require("../utils/jwt");

/**
 * POST /api/users/register
 * Register a new user.
 */
async function register(req, res) {
  try {
    const { email, password, role, walletAddress } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "A user with this email already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || "USER",
        walletAddress: walletAddress || null,
      },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
}

/**
 * POST /api/users/login
 * Authenticate user and return JWT.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateToken(user);

    // Return user without passwordHash
    const { passwordHash, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Login failed. Please try again.",
    });
  }
}

/**
 * GET /api/users/profile
 * Get authenticated user's profile including their vehicles.
 */
async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        vehicles: {
          select: {
            id: true,
            vin: true,
            make: true,
            model: true,
            year: true,
            color: true,
            registrationNumber: true,
            status: true,
            txHash: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch profile.",
    });
  }
}

/**
 * PATCH /api/users/wallet
 * Update wallet address for authenticated user.
 */
async function updateWallet(req, res) {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: "Wallet address is required.",
      });
    }

    // Check if wallet address is already in use by another user
    const existingWallet = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existingWallet && existingWallet.id !== req.user.id) {
      return res.status(409).json({
        success: false,
        error: "This wallet address is already linked to another account.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { walletAddress },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update wallet error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update wallet address.",
    });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateWallet,
};

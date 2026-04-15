import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate a JWT token for a user.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Strip sensitive fields from a user object before sending to client.
 */
const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

/**
 * POST /api/users/register
 * Register a new user with email and password.
 */
const register = async (req, res) => {
  try {
    const { email, password, walletAddress, role, username } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required.',
      });
    }

    // Check if user already exists by email or walletAddress
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(walletAddress ? [{ walletAddress }] : []),
          ...(username ? [{ email: username }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email or wallet address already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email || username || null,
        passwordHash,
        walletAddress: walletAddress || null,
        role: role || 'owner',
      },
    });

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    return res.status(201).json({
      success: true,
      data: {
        token,
        role: user.role,
        _id: user.id,
        walletAddress: user.walletAddress,
        ...safeUser,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to register user.',
    });
  }
};

/**
 * POST /api/users/login
 * Login with email/username + password, or with walletAddress alone.
 */
const login = async (req, res) => {
  try {
    const { email, password, walletAddress, username } = req.body;

    let user = null;

    // Wallet-based login (no password needed)
    if (walletAddress && !password) {
      user = await prisma.user.findUnique({
        where: { walletAddress },
      });

      if (!user) {
        // Auto-register wallet user
        user = await prisma.user.create({
          data: {
            walletAddress,
            role: 'owner',
          },
        });
      }

      const token = generateToken(user);
      const safeUser = sanitizeUser(user);

      return res.status(200).json({
        success: true,
        data: {
          token,
          role: user.role,
          _id: user.id,
          walletAddress: user.walletAddress,
          ...safeUser,
        },
        // Also return at top level for backward compatibility
        token,
        role: user.role,
        _id: user.id,
        walletAddress: user.walletAddress,
      });
    }

    // Email/username + password login
    const loginIdentifier = email || username;
    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email/username and password are required.',
      });
    }

    user = await prisma.user.findFirst({
      where: { email: loginIdentifier },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: 'This account uses wallet login. No password set.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      data: {
        token,
        role: user.role,
        _id: user.id,
        walletAddress: user.walletAddress,
        ...safeUser,
      },
      // Also return at top level for backward compatibility
      token,
      role: user.role,
      _id: user.id,
      walletAddress: user.walletAddress,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Login failed.',
    });
  }
};

/**
 * GET /api/users/profile
 * Get the authenticated user's full profile including their vehicles.
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        vehicles: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    const safeUser = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile.',
    });
  }
};

/**
 * PATCH /api/users/wallet
 * Update the walletAddress for the authenticated user.
 */
const updateWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required.',
      });
    }

    // Check if wallet address is already taken by another user
    const existing = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({
        success: false,
        error: 'This wallet address is already linked to another account.',
      });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { walletAddress },
    });

    const safeUser = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (err) {
    console.error('Update wallet error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update wallet address.',
    });
  }
};

/**
 * GET /api/users (admin)
 * Get all users — for backward compatibility with useMongoDB hook's getAllUsers().
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const safeUsers = users.map(sanitizeUser);

    return res.status(200).json({
      success: true,
      data: safeUsers,
    });
  } catch (err) {
    console.error('Get all users error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users.',
    });
  }
};

export { register, login, getProfile, updateWallet, getAllUsers };
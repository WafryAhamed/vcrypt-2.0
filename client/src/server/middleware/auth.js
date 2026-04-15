import jwt from 'jsonwebtoken';
import prisma from '../db/prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

/**
 * Authentication middleware.
 * Verifies JWT from the Authorization header and attaches the decoded user
 * (fetched from DB) to req.user.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.',
      });
    }

    // Attach user to request (exclude passwordHash)
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired.',
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Authentication failed.',
    });
  }
};

/**
 * Role-based authorization middleware factory.
 * Usage: requireRole('admin') or requireRole('officer')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires '${role}' role.`,
      });
    }

    next();
  };
};

export { auth, requireRole };
export default auth;
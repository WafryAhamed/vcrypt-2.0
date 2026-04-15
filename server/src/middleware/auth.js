// ──────────────────────────────────────────────
// vcrypt — Auth Middleware
// ──────────────────────────────────────────────

const { verifyToken } = require("../utils/jwt");
const { prisma } = require("../db/prismaClient");

/**
 * Authenticate middleware — verifies JWT from Authorization header.
 * Attaches the full user (minus passwordHash) to req.user.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Fetch the full user from DB to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token has expired.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Authentication failed.",
    });
  }
}

/**
 * Role-based authorization middleware factory.
 * @param  {...string} roles - Allowed roles (e.g., "ADMIN", "OFFICER")
 * @returns {Function} Express middleware
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }

    next();
  };
}

module.exports = { authenticate, requireRole };

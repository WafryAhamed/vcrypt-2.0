// ──────────────────────────────────────────────
// vcrypt — JWT Utility
// ──────────────────────────────────────────────

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "vcrypt_fallback_secret";
const JWT_EXPIRES_IN = "7d";

/**
 * Generate a signed JWT for a user.
 * @param {object} user - User object (must have id, email, role)
 * @returns {string} Signed JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify and decode a JWT.
 * @param {string} token - JWT string
 * @returns {object} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };

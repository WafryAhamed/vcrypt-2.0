// ──────────────────────────────────────────────
// vcrypt — User Routes
// ──────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth");
const {
  register,
  login,
  getProfile,
  updateWallet,
} = require("../controllers/userController");

// ─── Public Routes ───────────────────────────

// POST /api/users/register — Register a new user
router.post("/register", register);

// POST /api/users/login — Login and get JWT
router.post("/login", login);

// ─── Protected Routes ────────────────────────

// GET /api/users/profile — Get authenticated user's profile
router.get("/profile", authenticate, getProfile);

// PATCH /api/users/wallet — Update wallet address
router.patch("/wallet", authenticate, updateWallet);

module.exports = router;

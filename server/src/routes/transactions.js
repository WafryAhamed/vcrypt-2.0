// ──────────────────────────────────────────────
// vcrypt — Transaction Routes
// ──────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth");
const {
  createTransaction,
  getTransactionsByVehicle,
  getMyTransactions,
  updateTransactionStatus,
} = require("../controllers/transactionController");

// ─── All routes require authentication ───────

// POST /api/transactions — Create a new transaction
router.post("/", authenticate, createTransaction);

// GET /api/transactions/my — Get my transactions
router.get("/my", authenticate, getMyTransactions);

// GET /api/transactions/vehicle/:vehicleId — Get transactions for a vehicle
router.get("/vehicle/:vehicleId", authenticate, getTransactionsByVehicle);

// PATCH /api/transactions/status — Update transaction status
router.patch("/status", authenticate, updateTransactionStatus);

module.exports = router;

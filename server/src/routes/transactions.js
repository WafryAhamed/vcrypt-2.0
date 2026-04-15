const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createTransaction,
  getTransactionsByVehicle,
  getMyTransactions,
  updateTransactionStatus,
} = require("../controllers/transactionController");
const {
  validateCreateTransaction,
  validateUpdateTransactionStatus,
  validateTransactionVehicleId,
} = require("../validators/transactionValidator");

router.post("/", authenticate, validateCreateTransaction, createTransaction);
router.get("/my", authenticate, getMyTransactions);
router.get("/vehicle/:vehicleId", authenticate, validateTransactionVehicleId, getTransactionsByVehicle);
router.patch("/status", authenticate, validateUpdateTransactionStatus, updateTransactionStatus);

module.exports = router;

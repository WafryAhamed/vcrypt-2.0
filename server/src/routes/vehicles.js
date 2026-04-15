// ──────────────────────────────────────────────
// vcrypt — Vehicle Routes
// ──────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth");
const {
  registerVehicle,
  getMyVehicles,
  getVehicleByVin,
  transferVehicle,
  verifyVehicle,
} = require("../controllers/vehicleController");

// ─── Protected Routes ────────────────────────

// POST /api/vehicles/register — Register a new vehicle
router.post("/register", authenticate, registerVehicle);

// GET /api/vehicles/my — Get my vehicles
router.get("/my", authenticate, getMyVehicles);

// POST /api/vehicles/transfer — Transfer vehicle ownership
router.post("/transfer", authenticate, transferVehicle);

// ─── Public Routes ───────────────────────────

// GET /api/vehicles/verify/:vin — Verify a vehicle (public)
router.get("/verify/:vin", verifyVehicle);

// GET /api/vehicles/:vin — Get vehicle by VIN
router.get("/:vin", getVehicleByVin);

module.exports = router;

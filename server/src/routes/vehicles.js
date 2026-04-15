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
const {
  validateRegisterVehicle,
  validateTransferVehicle,
  validateVehicleVin,
} = require("../validators/vehicleValidator");

router.post("/register", authenticate, validateRegisterVehicle, registerVehicle);
router.get("/my", authenticate, getMyVehicles);
router.post("/transfer", authenticate, validateTransferVehicle, transferVehicle);
router.get("/verify/:vin", validateVehicleVin, verifyVehicle);
router.get("/:vin", validateVehicleVin, getVehicleByVin);

module.exports = router;

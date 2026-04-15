const vehicleService = require("../services/vehicleService");

async function registerVehicle(req, res, next) {
  try {
    const data = await vehicleService.registerVehicleService(req.user.id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    if (error.message.includes("already exists")) {
       return res.status(409).json({ success: false, error: error.message });
    }
    next(error);
  }
}

async function getMyVehicles(req, res, next) {
  try {
    const data = await vehicleService.getMyVehiclesList(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getVehicleByVin(req, res, next) {
  try {
    const data = await vehicleService.getVehicleDetailsByVin(req.params.vin);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.message === "Vehicle not found.") {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error);
  }
}

async function transferVehicle(req, res, next) {
  try {
    const data = await vehicleService.transferVehicleService(req.user.id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.message === "Vehicle not found." || error.message === "Recipient user not found.") {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === "You are not the owner of this vehicle.") {
      return res.status(403).json({ success: false, error: error.message });
    }
    next(error);
  }
}

async function verifyVehicle(req, res, next) {
  try {
    const data = await vehicleService.verifyVehicleService(req.params.vin);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.message.includes("Vehicle not found")) {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error);
  }
}

module.exports = {
  registerVehicle,
  getMyVehicles,
  getVehicleByVin,
  transferVehicle,
  verifyVehicle,
};

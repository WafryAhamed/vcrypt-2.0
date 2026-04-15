import { Router } from 'express';
import {
  registerVehicle,
  getMyVehicles,
  getVehicleByVin,
  transferVehicle,
  verifyVehicle,
  getAllVehicles,
  updateVehicleStatus,
} from '../controllers/vehicleController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// POST /api/vehicles/register — Register a new vehicle (auth required)
router.post('/register', auth, registerVehicle);

// POST /api/vehicles — Also accept POST to root for backward compatibility
router.post('/', auth, registerVehicle);

// GET /api/vehicles/my — Get authenticated user's vehicles
router.get('/my', auth, getMyVehicles);

// POST /api/vehicles/transfer — Transfer vehicle ownership (auth required)
router.post('/transfer', auth, transferVehicle);

// POST /api/vehicles/:vehicleId/transfer — Legacy transfer route
router.post('/:vehicleId/transfer', auth, transferVehicle);

// GET /api/vehicles/verify/:searchType/:searchValue — Verify vehicle (legacy format)
router.get('/verify/:searchType/:searchValue', verifyVehicle);

// GET /api/vehicles/verify/:vin — Verify vehicle by VIN
router.get('/verify/:vin', verifyVehicle);

// PUT /api/vehicles/:vehicleId/status — Update vehicle status (backward compat)
router.put('/:vehicleId/status', auth, updateVehicleStatus);

// POST /api/vehicles/:vehicleId/documents — Document upload placeholder (backward compat)
router.post('/:vehicleId/documents', auth, async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      message: 'Document upload received.',
      vehicleId: req.params.vehicleId,
      document: req.body,
    },
  });
});

// GET /api/vehicles — Get all vehicles (backward compatibility)
router.get('/', auth, getAllVehicles);

// GET /api/vehicles/:vin — Get a single vehicle by VIN
router.get('/:vin', getVehicleByVin);

export default router;
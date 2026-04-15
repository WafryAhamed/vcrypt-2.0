import { Router } from 'express';
import {
  createTransaction,
  getTransactionsByVehicle,
  getMyTransactions,
  updateTransactionStatus,
} from '../controllers/transactionController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// POST /api/transactions — Create a new transaction (auth required)
router.post('/', auth, createTransaction);

// GET /api/transactions/my — Get authenticated user's transactions
router.get('/my', auth, getMyTransactions);

// GET /api/transactions/vehicle/:vehicleId — Get transactions for a vehicle
router.get('/vehicle/:vehicleId', auth, getTransactionsByVehicle);

// PATCH /api/transactions/status — Update transaction status by txHash
router.patch('/status', auth, updateTransactionStatus);

export default router;
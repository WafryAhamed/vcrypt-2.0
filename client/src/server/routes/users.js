import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateWallet,
  getAllUsers,
} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// POST /api/users/register — Register a new user
router.post('/register', register);

// POST /api/users/login — Login with credentials or wallet
router.post('/login', login);

// GET /api/users/profile — Get authenticated user's profile
router.get('/profile', auth, getProfile);

// PATCH /api/users/wallet — Update wallet address
router.patch('/wallet', auth, updateWallet);

// GET /api/users — Get all users (backward compatibility)
router.get('/', auth, getAllUsers);

export default router;
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { register, login, getProfile, updateWallet } = require("../controllers/userController");
const { validateUserRegister, validateUserLogin, validateUpdateWallet } = require("../validators/userValidator");

// POST /api/users/register
router.post("/register", validateUserRegister, register);

// POST /api/users/login
router.post("/login", validateUserLogin, login);

// GET /api/users/profile
router.get("/profile", authenticate, getProfile);

// PATCH /api/users/wallet
router.patch("/wallet", authenticate, validateUpdateWallet, updateWallet);

module.exports = router;

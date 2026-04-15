const express = require("express");
const router = express.Router();
const { siwe } = require("../controllers/authController");
const { validateSiwe } = require("../validators/authValidator");

// POST /api/auth/siwe
router.post("/siwe", validateSiwe, siwe);

module.exports = router;

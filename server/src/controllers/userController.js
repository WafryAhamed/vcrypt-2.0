const userService = require("../services/userService");

async function register(req, res, next) {
  try {
    const data = await userService.registerUser(req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await userService.loginUser(req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.message === "Invalid email or password.") {
      return res.status(401).json({ success: false, error: error.message });
    }
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const data = await userService.getUserProfile(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.message === "User not found.") {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error);
  }
}

async function updateWallet(req, res, next) {
  try {
    const data = await userService.updateWalletAddress(req.user.id, req.body.walletAddress);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.message.includes("already linked")) {
      return res.status(409).json({ success: false, error: error.message });
    }
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateWallet,
};

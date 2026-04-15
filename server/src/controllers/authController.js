const authService = require("../services/authService");

async function siwe(req, res, next) {
  try {
    const { token, user } = await authService.siweLogin(req.body);
    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    if (error.message.includes("Invalid signature") || error.message.includes("does not match")) {
      return res.status(401).json({ success: false, error: error.message });
    }
    next(error);
  }
}

module.exports = {
  siwe,
};

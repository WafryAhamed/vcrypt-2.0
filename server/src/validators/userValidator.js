const { z } = require("zod");

// Helper to format zod errors
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: "Invalid input",
      details: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }
};

const registerUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["USER", "ADMIN", "DEALER", "INSPECTOR", "POLICE"]).optional(),
    walletAddress: z.string().optional(),
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const updateWalletSchema = z.object({
  body: z.object({
    walletAddress: z.string().min(1, "Wallet address is required"),
  }),
});

module.exports = {
  validateUserRegister: validate(registerUserSchema),
  validateUserLogin: validate(loginUserSchema),
  validateUpdateWallet: validate(updateWalletSchema),
};

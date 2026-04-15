const { z } = require("zod");

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

const siweSchema = z.object({
  body: z.object({
    walletAddress: z.string().min(1, "Wallet address is required"),
    signature: z.string().min(1, "Signature is required"),
    message: z.string().min(1, "Message is required"),
  }),
});

module.exports = {
  validateSiwe: validate(siweSchema),
};

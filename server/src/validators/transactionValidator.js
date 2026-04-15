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

const createTransactionSchema = z.object({
  body: z.object({
    vehicleId: z.union([z.string(), z.number()]),
    toUserId: z.union([z.string(), z.number()]),
    txHash: z.string().min(1),
    type: z.enum(["REGISTRATION", "TRANSFER", "VERIFICATION"]),
  }),
});

const updateTransactionStatusSchema = z.object({
  body: z.object({
    txHash: z.string().min(1),
    status: z.enum(["PENDING", "CONFIRMED", "FAILED"]),
  }),
});

const transactionVehicleParamsSchema = z.object({
  params: z.object({
    vehicleId: z.union([z.string(), z.number()]),
  }),
});


module.exports = {
  validateCreateTransaction: validate(createTransactionSchema),
  validateUpdateTransactionStatus: validate(updateTransactionStatusSchema),
  validateTransactionVehicleId: validate(transactionVehicleParamsSchema),
};

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

const registerVehicleSchema = z.object({
  body: z.object({
    vin: z.string().min(1),
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.union([z.string(), z.number()]),
    color: z.string().min(1),
    registrationNumber: z.string().min(1),
    txHash: z.string().optional(),
  }),
});

const transferVehicleSchema = z.object({
  body: z.object({
    vin: z.string().min(1),
    toUserId: z.union([z.string(), z.number()]),
    txHash: z.string().min(1),
  }),
});

const vehicleParamsSchema = z.object({
  params: z.object({
    vin: z.string().min(1),
  }),
});

module.exports = {
  validateRegisterVehicle: validate(registerVehicleSchema),
  validateTransferVehicle: validate(transferVehicleSchema),
  validateVehicleVin: validate(vehicleParamsSchema),
};

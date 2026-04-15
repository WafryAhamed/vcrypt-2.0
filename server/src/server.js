// ──────────────────────────────────────────────
// vcrypt — Express Server Entry Point
// ──────────────────────────────────────────────

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import routes
const userRoutes = require("./routes/users");
const vehicleRoutes = require("./routes/vehicles");
const transactionRoutes = require("./routes/transactions");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger (development) ────────────

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Health Check ────────────────────────────

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "healthy",
      service: "vcrypt-api",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// ─── API Routes ──────────────────────────────

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/transactions", transactionRoutes);

// ─── 404 Handler ─────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ────────────────────

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Prisma-specific errors
  if (err.code && err.code.startsWith("P")) {
    return res.status(400).json({
      success: false,
      error: "Database operation failed.",
      ...(process.env.NODE_ENV !== "production" && { details: err.message }),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Default 500
  res.status(err.status || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : err.message || "Internal server error.",
  });
});

// ─── Start Server ────────────────────────────

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🚗  vcrypt API Server                  ║
  ║                                          ║
  ║   Port:   ${String(PORT).padEnd(28)}  ║
  ║   Mode:   ${String(process.env.NODE_ENV || "development").padEnd(28)}  ║
  ║   Health: http://localhost:${PORT}/api/health  ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;

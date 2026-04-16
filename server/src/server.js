// ──────────────────────────────────────────────
// vcrypt — Express Server Entry Point
// ──────────────────────────────────────────────

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const vehicleRoutes = require("./routes/vehicles");
const transactionRoutes = require("./routes/transactions");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Middleware ────────────────────────

// Helmet for security headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter); // Apply to API routes

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

app.use("/api/auth", authRoutes);
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

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error.",
  });
});

// ─── Start Server & Listeners ─────────────────

const { startEventListener } = require("./services/eventListener");

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

  // Start the blockchain event listener
  startEventListener();
});

module.exports = app;

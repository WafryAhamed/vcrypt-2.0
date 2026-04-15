// ──────────────────────────────────────────────
// vcrypt — Prisma Client Singleton
// ──────────────────────────────────────────────

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

// Verify connection on first import
prisma
  .$connect()
  .then(() => {
    console.log("✅ PostgreSQL connected via Prisma");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { prisma };

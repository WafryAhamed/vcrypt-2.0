const bcrypt = require("bcryptjs");
const { prisma } = require("../db/prismaClient");
const { generateToken } = require("../utils/jwt");

async function registerUser({ email, password, role, walletAddress }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: role || "USER",
      walletAddress: walletAddress || null,
    },
    select: {
      id: true,
      walletAddress: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = generateToken(user);
  return { user, token };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user);
  const { passwordHash, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}

async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      walletAddress: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      vehicles: {
        select: {
          id: true,
          vin: true,
          make: true,
          model: true,
          year: true,
          color: true,
          registrationNumber: true,
          status: true,
          txHash: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

async function updateWalletAddress(userId, walletAddress) {
  const existingWallet = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (existingWallet && existingWallet.id !== userId) {
    throw new Error("This wallet address is already linked to another account.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { walletAddress },
    select: {
      id: true,
      walletAddress: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateWalletAddress,
};

const { ethers } = require("ethers");
const { prisma } = require("../db/prismaClient");
const { generateToken } = require("../utils/jwt");

async function siweLogin({ walletAddress, signature, message }) {
  // Validate the signature
  // Note: the message should ideally include the timestamp or be exactly what frontend sent
  // The frontend sends: `Sign in to vcrypt: ${timestamp}`
  
  let recoveredAddress;
  try {
    recoveredAddress = ethers.verifyMessage(message, signature);
  } catch (err) {
    throw new Error("Invalid signature.");
  }

  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new Error("Signature does not match the provided wallet address.");
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    // If we only have wallet address, create the user with a dummy email
    user = await prisma.user.create({
      data: {
        walletAddress,
        email: `${walletAddress.toLowerCase()}@vcrypt.local`,
        passwordHash: "", // SIWE users don't have a password
        role: "USER",
      },
    });
  }

  const token = generateToken(user);
  
  return { 
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, 
    token 
  };
}

module.exports = {
  siweLogin,
};

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: "../server/.env" }); // Read from server's .env

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: process.env.ALCHEMY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.BACKEND_PRIVATE_KEY ? [process.env.BACKEND_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};

export default config;

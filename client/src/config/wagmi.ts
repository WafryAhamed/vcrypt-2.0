import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export const SUPPORTED_CHAIN_ID = 80002;
export const CHAIN_NAME = 'Polygon Amoy';
export const BLOCK_EXPLORER_URL = 'https://amoy.polygonscan.com/';

const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY || 'demo';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    metaMask()
  ],
  transports: {
    [polygonAmoy.id]: http(`https://polygon-amoy.g.alchemy.com/v2/${alchemyKey}`),
  },
});

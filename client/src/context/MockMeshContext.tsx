import React, { useState, createContext, useContext } from 'react';
// Mock wallet interface
interface Wallet {
  name: string;
  icon: string;
  version: string;
}
// Mock wallet context interface
interface WalletContextType {
  connect: (walletName: string) => Promise<void>;
  disconnect: () => Promise<void>;
  connecting: boolean;
  address: string | null;
}
// Create contexts
const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: async () => {},
  connecting: false,
  address: null
});
// Mock available wallets
const mockWallets: Wallet[] = [
{
  name: 'Lace',
  icon: 'lace-icon',
  version: '1.0.0'
},
{
  name: 'Eternl',
  icon: 'eternl-icon',
  version: '1.0.0'
},
{
  name: 'Nami',
  icon: 'nami-icon',
  version: '1.0.0'
}];

// Provider component
export const MeshProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const connect = async (walletName: string): Promise<void> => {
    setConnecting(true);
    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAddress(
        'addr1qxck6j05k4r4qgq4thjrdt6w5uq2k2zzty5w2j4l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s'
      );
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };
  const disconnect = async (): Promise<void> => {
    setAddress(null);
  };
  return (
    <WalletContext.Provider
      value={{
        connect,
        disconnect,
        connecting,
        address
      }}>
      
      {children}
    </WalletContext.Provider>);

};
// Custom hooks
export const useWallet = (): WalletContextType => {
  return useContext(WalletContext);
};
export const useWalletList = (): Wallet[] => {
  return mockWallets;
};
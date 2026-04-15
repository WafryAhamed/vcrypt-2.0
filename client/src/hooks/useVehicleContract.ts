import { useState } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import { VehicleRegistryABI, CONTRACT_ADDRESSES } from '../config/contracts';
import { api } from './useApi';

export const useVehicleContract = () => {
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContract = async () => {
    if (!walletClient) throw new Error('Wallet not connected');
    const customProvider = new ethers.BrowserProvider(walletClient as any);
    const signer = await customProvider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESSES.VEHICLE_REGISTRY, VehicleRegistryABI, signer);
  };

  const useRegisterVehicle = () => {
    const [txHash, setTxHash] = useState<string | null>(null);

    const registerOnChain = async (vin: string, metadataURI: string, dbData: any) => {
      try {
        setIsLoading(true);
        setError(null);
        setTxHash(null);

        const contract = await getContract();
        const tx = await contract.registerVehicle(vin, metadataURI);
        const receipt = await tx.wait();
        
        setTxHash(receipt.hash);

        // Update Backend
        const finalData = { ...dbData, txHash: receipt.hash };
        await api.vehicles.register(finalData);

        return receipt.hash;
      } catch (err: any) {
        console.error('Registration failed:', err);
        setError(err.message || 'Transaction failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    return { registerOnChain, isLoading, txHash, error };
  };

  const useTransferVehicle = () => {
    const [txHash, setTxHash] = useState<string | null>(null);

    const transferOnChain = async (tokenId: number, toAddress: string, vin: string, toUserId: number) => {
      try {
        setIsLoading(true);
        setError(null);
        setTxHash(null);

        const contract = await getContract();
        const tx = await contract.transferVehicle(tokenId, toAddress);
        const receipt = await tx.wait();
        
        setTxHash(receipt.hash);

        // Update Backend
        await api.vehicles.transfer({ vin, toUserId, txHash: receipt.hash });

        return receipt.hash;
      } catch (err: any) {
        console.error('Transfer failed:', err);
        setError(err.message || 'Transaction failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    return { transferOnChain, isLoading, txHash, error };
  };

  const useVerifyVehicle = () => {
    const [isVerified, setIsVerified] = useState<boolean | null>(null);

    const verify = async (vin: string) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!walletClient) {
            // Can use a public provider for reads if not connected, but for simplicity we'll just require wallet for now
            // or we could use wagmi public client. Ethers read-only setup:
            const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_ALCHEMY_RPC_URL || 'https://rpc-amoy.polygon.technology');
            const contract = new ethers.Contract(CONTRACT_ADDRESSES.VEHICLE_REGISTRY, VehicleRegistryABI, provider);
            const result = await contract.verifyVehicle(vin);
            setIsVerified(result);
            return result;
        }

        const contract = await getContract();
        const result = await contract.verifyVehicle(vin);
        setIsVerified(result);
        return result;
      } catch (err: any) {
        console.error('Verification failed:', err);
        setError(err.message || 'Verification failed');
        setIsVerified(false);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    return { verify, isVerified, isLoading, error };
  };

  return {
    useRegisterVehicle,
    useTransferVehicle,
    useVerifyVehicle
  };
};

import { useState } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { api } from './useApi';
import { useSignMessage } from 'wagmi';

export const useAuth = () => {
  const { login: contextLogin, logout: contextLogout, isAuthenticated, userRole, walletAddress } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signMessageAsync } = useSignMessage();

  const walletLogin = async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const timestamp = new Date().toISOString();
      const message = `Sign in to vcrypt: ${timestamp}`;
      
      const signature = await signMessageAsync({ message });
      
      const response = await api.auth.siwe({ walletAddress: address, signature, message });
      
      if (response.success && response.data) {
        localStorage.setItem('jwt', response.data.token);
        contextLogin(response.data.user.role as any, address);
        return response.data;
      } else {
         setError(response.error || 'Wallet login failed');
         return null;
      }
    } catch (err: any) {
      setError(err.message || 'Wallet login failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.users.login({ email, password });
      
      if (response.success && response.data) {
        localStorage.setItem('jwt', response.data.token);
        contextLogin(response.data.user.role as any, response.data.user.walletAddress || undefined);
        return response;
      } else {
        setError(response.error || 'Login failed');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    contextLogout();
  };

  return {
    walletLogin,
    emailLogin,
    logout,
    isAuthenticated,
    userRole,
    walletAddress,
    isLoading,
    error
  };
};

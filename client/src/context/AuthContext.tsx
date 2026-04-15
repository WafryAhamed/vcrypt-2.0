import React, { useEffect, useState, createContext, useContext } from 'react';

type UserRole = 'admin' | 'officer' | 'owner' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  walletAddress: string | null;
  isWalletConnected: boolean;
  login: (role: UserRole, address?: string) => void;
  logout: () => void;
  updateWallet: (address: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  walletAddress: null,
  isWalletConnected: false,
  login: () => {},
  logout: () => {},
  updateWallet: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const savedAuth = localStorage.getItem('auth');
    if (token && savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUserRole(authData.role);
        setWalletAddress(authData.address || null);
      } catch (e) {
        console.error('Failed to parse auth data');
      }
    }
  }, []);

  const login = (role: UserRole, address?: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setWalletAddress(address || null);
    // Save to local storage for persistence
    localStorage.setItem(
      'auth',
      JSON.stringify({
        role,
        address
      })
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setWalletAddress(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('jwt');
  };

  const updateWallet = (address: string) => {
    setWalletAddress(address);
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
       const authData = JSON.parse(savedAuth);
       localStorage.setItem('auth', JSON.stringify({ ...authData, address }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        walletAddress,
        isWalletConnected: !!walletAddress,
        login,
        logout,
        updateWallet
      }}>
      
      {children}
    </AuthContext.Provider>
  );
};
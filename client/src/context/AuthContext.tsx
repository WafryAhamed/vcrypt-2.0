import React, { useEffect, useState, createContext, useContext } from 'react';
type UserRole = 'admin' | 'officer' | 'owner' | null;
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  walletAddress: string | null;
  login: (role: UserRole, address?: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  walletAddress: null,
  login: () => {},
  logout: () => {}
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
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserRole(authData.role);
      setWalletAddress(authData.address || null);
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
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        walletAddress,
        login,
        logout
      }}>
      
      {children}
    </AuthContext.Provider>);

};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, KeyIcon, ChevronRightIcon, WalletIcon } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import { useAuth } from '../context/AuthContext';
const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'wallet'>(
    'credentials'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Mock authentication - in a real app, this would verify against a backend
    if (username === 'admin' && password === 'admin123') {
      login('admin');
      navigate('/dashboard');
    } else if (username === 'officer' && password === 'officer123') {
      login('officer');
      navigate('/dashboard');
    } else if (username === 'owner' && password === 'owner123') {
      login('owner');
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };
  const handleWalletConnect = (address: string) => {
    // In a real app, we would verify the wallet address against registered users
    // For now, we'll just log in as a vehicle owner
    login('owner', address);
    navigate('/dashboard');
  };
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className="text-blue-100 text-center text-sm">
            Login to access your BTRA dashboard
          </p>
        </div>
        <div className="p-6">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              className={`flex-1 py-2 text-center rounded-md transition-all ${loginMethod === 'credentials' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setLoginMethod('credentials')}>
              
              Standard Login
            </button>
            <button
              className={`flex-1 py-2 text-center rounded-md transition-all ${loginMethod === 'wallet' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setLoginMethod('wallet')}>
              
              Wallet Login
            </button>
          </div>
          {loginMethod === 'credentials' ?
          <form onSubmit={handleCredentialLogin}>
              {error &&
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-4 text-sm rounded-md">
                  <div className="flex items-center">
                    <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  
                      <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd" />
                  
                    </svg>
                    {error}
                  </div>
                </div>
            }
              <div className="mb-4">
                <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
                htmlFor="username">
                
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon
                    size={18}
                    className="text-gray-400 dark:text-gray-500" />
                  
                  </div>
                  <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="Enter your username"
                  required />
                
                </div>
              </div>
              <div className="mb-6">
                <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
                htmlFor="password">
                
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon
                    size={18}
                    className="text-gray-400 dark:text-gray-500" />
                  
                  </div>
                  <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="Enter your password"
                  required />
                
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Test Accounts
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-5 list-disc">
                  <li>Admin: admin / admin123</li>
                  <li>Officer: officer / officer123</li>
                  <li>Owner: owner / owner123</li>
                </ul>
              </div>
              <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center">
              
                <span>Login</span>
                <ChevronRightIcon size={18} className="ml-1" />
              </button>
            </form> :

          <div className="transition-all duration-300">
              <div className="mb-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <WalletIcon size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Connect your blockchain wallet to access your account
                </p>
              </div>
              <WalletConnect onConnect={handleWalletConnect} />
            </div>
          }
        </div>
      </div>
    </div>);

};
export default Login;
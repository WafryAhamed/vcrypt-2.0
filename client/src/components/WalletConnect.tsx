import React, { useState } from 'react';
import { useWallet, useWalletList } from '../context/MockMeshContext';
import { WalletIcon, AlertCircleIcon } from 'lucide-react';
interface WalletConnectProps {
  onConnect: (address: string) => void;
}
const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const { connect, disconnect, connecting, address } = useWallet();
  const wallets = useWalletList();
  const [error, setError] = useState<string | null>(null);
  const handleConnect = async (walletName: string) => {
    try {
      setError(null);
      await connect(walletName);
      if (address) {
        onConnect(address);
      }
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
      console.error('Wallet connection error:', error);
    }
  };
  return (
    <div className="space-y-4">
      {error &&
      <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 mb-4 text-sm flex items-start">
          <AlertCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      }
      <div className="space-y-3">
        {wallets.map((wallet) =>
        <button
          key={wallet.name}
          onClick={() => handleConnect(wallet.name)}
          disabled={connecting}
          className="w-full flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-all">
          
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <WalletIcon
                size={16}
                className="text-blue-600 dark:text-blue-400" />
              
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {wallet.name}
              </span>
            </div>
            {connecting ?
          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              
                  <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4">
              </circle>
                  <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
                </svg>
                Connecting...
              </div> :

          <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 rounded-full font-medium">
                Connect
              </span>
          }
          </button>
        )}
      </div>
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <p className="font-medium mb-2">Don't have a Cardano wallet?</p>
        <div className="flex space-x-4">
          <a
            href="https://lace.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              
            </svg>
            Get Lace
          </a>
          <a
            href="https://eternl.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              
            </svg>
            Get Eternl
          </a>
        </div>
      </div>
    </div>);

};
export default WalletConnect;
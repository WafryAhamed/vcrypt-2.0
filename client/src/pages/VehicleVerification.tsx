import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SearchIcon,
  CarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  FileTextIcon } from
'lucide-react';
import { VehicleData } from '../components/VehicleCard';
// Mock data for a vehicle with transaction history
const mockVehicle: VehicleData & {
  transactions: Array<{
    id: string;
    type: string;
    date: string;
    from?: string;
    to?: string;
    hash: string;
  }>;
  documents: Array<{
    name: string;
    type: string;
    hash: string;
    uploadDate: string;
  }>;
} = {
  id: '1',
  licensePlate: 'ABC123',
  chassisNumber: 'WBAFG810X3L325364',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  ownerAddress:
  'addr1qxck6j05k4r4qgq4thjrdt6w5uq2k2zzty5w2j4l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s',
  registrationDate: '2023-01-15',
  status: 'active',
  transactions: [
  {
    id: 't1',
    type: 'Registration',
    date: '2023-01-15',
    to: 'addr1qxck6j05k4r4qgq4thjrdt6w5uq2k2zzty5w2j4l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s',
    hash: '0x7f9a12e4b1d3c5e6f7890a1b2c3d4e5f6789012345678901234567890abcdef'
  },
  {
    id: 't2',
    type: 'Document Update',
    date: '2023-03-22',
    hash: '0x8f9a12e4b1d3c5e6f7890a1b2c3d4e5f6789012345678901234567890abcdef'
  },
  {
    id: 't3',
    type: 'Ownership Transfer',
    date: '2022-11-03',
    from: 'addr1qy9wvwjlk67jl4q5rw4q2g2rj3t6j0rrw2q5j9l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s',
    to: 'addr1qxck6j05k4r4qgq4thjrdt6w5uq2k2zzty5w2j4l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s',
    hash: '0x9f9a12e4b1d3c5e6f7890a1b2c3d4e5f6789012345678901234567890abcdef'
  }],

  documents: [
  {
    name: 'Purchase Agreement',
    type: 'PDF',
    hash: 'QmT7fzZ6Ld5AXC9BhvLrDkxCCeXKK7rirJyu8zQrTsU9Hd',
    uploadDate: '2023-01-15'
  },
  {
    name: 'Insurance Policy',
    type: 'PDF',
    hash: 'QmT8fzZ6Ld5AXC9BhvLrDkxCCeXKK7rirJyu8zQrTsU9He',
    uploadDate: '2023-01-15'
  },
  {
    name: 'Emissions Certificate',
    type: 'PDF',
    hash: 'QmT9fzZ6Ld5AXC9BhvLrDkxCCeXKK7rirJyu8zQrTsU9Hf',
    uploadDate: '2023-03-22'
  }]

};
const VehicleVerification: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicleIdFromParams = queryParams.get('vehicleId');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'license' | 'chassis'>('license');
  const [isSearching, setIsSearching] = useState(false);
  const [vehicle, setVehicle] = useState<typeof mockVehicle | null>(
    vehicleIdFromParams ? mockVehicle : null
  );
  const [activeTab, setActiveTab] = useState<
    'details' | 'history' | 'documents'>(
    'details');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      // Mock search logic - in real app would query blockchain
      if (
      searchType === 'license' &&
      searchQuery.toUpperCase() === mockVehicle.licensePlate ||
      searchType === 'chassis' && searchQuery === mockVehicle.chassisNumber)
      {
        setVehicle(mockVehicle);
      } else {
        setVehicle(null);
      }
      setIsSearching(false);
    }, 1000);
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-700 text-white p-6">
          <h2 className="text-2xl font-bold flex items-center">
            <SearchIcon className="mr-2" size={24} />
            Vehicle Verification
          </h2>
          <p className="mt-1">
            Verify vehicle information and ownership history on the blockchain
          </p>
        </div>
        <div className="p-6">
          {!vehicle &&
          <form onSubmit={handleSearch}>
              <div className="mb-6">
                <div className="flex mb-4">
                  <button
                  type="button"
                  className={`flex-1 py-2 ${searchType === 'license' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100'}`}
                  onClick={() => setSearchType('license')}>
                  
                    Search by License Plate
                  </button>
                  <button
                  type="button"
                  className={`flex-1 py-2 ${searchType === 'chassis' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100'}`}
                  onClick={() => setSearchType('chassis')}>
                  
                    Search by Chassis Number
                  </button>
                </div>
                <div className="relative">
                  <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={
                  searchType === 'license' ?
                  'Enter license plate (e.g., ABC123)' :
                  'Enter chassis/VIN number'
                  }
                  required />
                
                  <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-lg">
                  
                    <SearchIcon size={20} />
                  </button>
                </div>
                {isSearching &&
              <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">
                      Searching blockchain records...
                    </p>
                  </div>
              }
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Test Data</h4>
                <p className="text-sm text-gray-600 mb-2">
                  For demonstration purposes, use these test values:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    License Plate: <span className="font-mono">ABC123</span>
                  </li>
                  <li>
                    Chassis Number:{' '}
                    <span className="font-mono">WBAFG810X3L325364</span>
                  </li>
                </ul>
              </div>
            </form>
          }
          {vehicle &&
          <div>
              {/* Vehicle verification result */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircleIcon size={14} className="mr-1" />
                      Verified on Blockchain
                    </span>
                  </div>
                </div>
                <button
                onClick={() => {
                  setVehicle(null);
                  setSearchQuery('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800">
                
                  New Search
                </button>
              </div>
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex -mb-px">
                  <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  
                    Vehicle Details
                  </button>
                  <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  
                    Transaction History
                  </button>
                  <button
                  onClick={() => setActiveTab('documents')}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  
                    Documents
                  </button>
                </div>
              </div>
              {/* Tab Content */}
              {activeTab === 'details' &&
            <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">License Plate</p>
                      <p className="font-medium">{vehicle.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Chassis Number (VIN)
                      </p>
                      <p className="font-medium">{vehicle.chassisNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Make</p>
                      <p className="font-medium">{vehicle.make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium">{vehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{vehicle.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{vehicle.status}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Current Owner</p>
                    <div className="flex items-center mt-1">
                      <UserIcon size={16} className="mr-2 text-gray-500" />
                      <span className="font-mono text-sm break-all">
                        {vehicle.ownerAddress}
                      </span>
                    </div>
                  </div>
                </div>
            }
              {activeTab === 'history' &&
            <div className="space-y-4">
                  {vehicle.transactions.map((transaction) =>
              <div
                key={transaction.id}
                className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{transaction.type}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <ClockIcon size={14} className="mr-1" />
                            {transaction.date}
                          </div>
                          {transaction.type === 'Ownership Transfer' &&
                    <div className="mt-2 space-y-1">
                              <div className="text-sm">
                                <span className="text-gray-500">From:</span>
                                <span className="font-mono ml-1 text-xs">
                                  {transaction.from?.substring(0, 16)}...
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">To:</span>
                                <span className="font-mono ml-1 text-xs">
                                  {transaction.to?.substring(0, 16)}...
                                </span>
                              </div>
                            </div>
                    }
                          {transaction.type === 'Registration' &&
                    transaction.to &&
                    <div className="mt-2 text-sm">
                                <span className="text-gray-500">
                                  Registered to:
                                </span>
                                <span className="font-mono ml-1 text-xs">
                                  {transaction.to.substring(0, 16)}...
                                </span>
                              </div>
                    }
                        </div>
                        <a
                    href={`https://explorer.cardano.org/en/transaction?id=${transaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                    
                          View on Explorer
                        </a>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Transaction Hash:
                        </p>
                        <p className="font-mono text-xs break-all">
                          {transaction.hash}
                        </p>
                      </div>
                    </div>
              )}
                </div>
            }
              {activeTab === 'documents' &&
            <div className="space-y-4">
                  {vehicle.documents.map((doc) =>
              <div
                key={doc.hash}
                className="bg-gray-50 p-4 rounded-lg flex items-start">
                
                      <div className="bg-blue-100 p-2 rounded mr-3">
                        <FileTextIcon size={20} className="text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-500">
                          {doc.type} • Uploaded on {doc.uploadDate}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">IPFS Hash:</p>
                          <p className="font-mono text-xs break-all">
                            {doc.hash}
                          </p>
                        </div>
                      </div>
                      <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm">
                        View
                      </button>
                    </div>
              )}
                </div>
            }
            </div>
          }
        </div>
      </div>
    </div>);

};
export default VehicleVerification;
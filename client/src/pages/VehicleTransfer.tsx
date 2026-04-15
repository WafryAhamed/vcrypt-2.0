import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftRightIcon, CheckCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VehicleData } from '../components/VehicleCard';
// Mock data
const mockVehicles: VehicleData[] = [
{
  id: '1',
  licensePlate: 'ABC123',
  chassisNumber: 'WBAFG810X3L325364',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  ownerAddress:
  'addr1qxck6j05k4r4qgq4thjrdt6w5uq2k2zzty5w2j4l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s',
  registrationDate: '2023-01-15',
  status: 'active'
},
{
  id: '2',
  licensePlate: 'XYZ789',
  chassisNumber: 'JH4KA7660PC003428',
  make: 'Honda',
  model: 'Accord',
  year: 2019,
  ownerAddress:
  'addr1qxck6j05k4r4qgq4thjrdt6w5uq2k2zzty5w2j4l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s',
  registrationDate: '2022-11-03',
  status: 'active'
}];

enum TransferStep {
  SelectVehicle,
  EnterRecipient,
  Confirmation,
  Processing,
  Complete,
}
const VehicleTransfer: React.FC = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicleIdFromParams = queryParams.get('vehicleId');
  const [currentStep, setCurrentStep] = useState<TransferStep>(
    TransferStep.SelectVehicle
  );
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(
    null
  );
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  // Filter for vehicles owned by the current user
  const myVehicles = mockVehicles.filter(
    (v) => v.ownerAddress === walletAddress || walletAddress === null
  );
  // If vehicleId is provided in URL, pre-select that vehicle
  useEffect(() => {
    if (vehicleIdFromParams) {
      const vehicle = myVehicles.find((v) => v.id === vehicleIdFromParams);
      if (vehicle) {
        setSelectedVehicle(vehicle);
        setCurrentStep(TransferStep.EnterRecipient);
      }
    }
  }, [vehicleIdFromParams, myVehicles]);
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const handleVehicleSelect = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setCurrentStep(TransferStep.EnterRecipient);
  };
  const handleRecipientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientAddress.trim()) {
      setCurrentStep(TransferStep.Confirmation);
    }
  };
  const handleConfirmTransfer = async () => {
    setCurrentStep(TransferStep.Processing);
    setIsProcessing(true);
    // Simulate blockchain transaction
    try {
      // In a real app, this would interact with the blockchain
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setTransactionHash(
        '0x7f9a12e4b1d3c5e6f7890a1b2c3d4e5f6789012345678901234567890abcdef'
      );
      setCurrentStep(TransferStep.Complete);
    } catch (error) {
      console.error('Error transferring vehicle:', error);
      // Handle error state
    } finally {
      setIsProcessing(false);
    }
  };
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-700 text-white p-6">
          <h2 className="text-2xl font-bold flex items-center">
            <ArrowLeftRightIcon className="mr-2" size={24} />
            Transfer Vehicle Ownership
          </h2>
          <p className="mt-1">
            Securely transfer vehicle ownership on the blockchain
          </p>
        </div>
        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex mb-8">
            <div
              className={`flex-1 text-center ${currentStep >= TransferStep.SelectVehicle ? 'text-blue-600' : 'text-gray-400'}`}>
              
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= TransferStep.SelectVehicle ? 'bg-blue-100' : 'bg-gray-100'}`}>
                
                <span className="text-sm font-medium">1</span>
              </div>
              <p className="text-xs mt-1">Select Vehicle</p>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${currentStep >= TransferStep.EnterRecipient ? 'bg-blue-400' : 'bg-gray-200'}`}>
              </div>
            </div>
            <div
              className={`flex-1 text-center ${currentStep >= TransferStep.EnterRecipient ? 'text-blue-600' : 'text-gray-400'}`}>
              
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= TransferStep.EnterRecipient ? 'bg-blue-100' : 'bg-gray-100'}`}>
                
                <span className="text-sm font-medium">2</span>
              </div>
              <p className="text-xs mt-1">Recipient</p>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${currentStep >= TransferStep.Confirmation ? 'bg-blue-400' : 'bg-gray-200'}`}>
              </div>
            </div>
            <div
              className={`flex-1 text-center ${currentStep >= TransferStep.Confirmation ? 'text-blue-600' : 'text-gray-400'}`}>
              
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= TransferStep.Confirmation ? 'bg-blue-100' : 'bg-gray-100'}`}>
                
                <span className="text-sm font-medium">3</span>
              </div>
              <p className="text-xs mt-1">Confirm</p>
            </div>
          </div>
          {/* Step 1: Select Vehicle */}
          {currentStep === TransferStep.SelectVehicle &&
          <div>
              <h3 className="text-lg font-medium mb-4">
                Select a vehicle to transfer
              </h3>
              {myVehicles.length > 0 ?
            <div className="space-y-4">
                  {myVehicles.map((vehicle) =>
              <div
                key={vehicle.id}
                onClick={() => handleVehicleSelect(vehicle)}
                className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition">
                
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </h4>
                          <p className="text-sm text-gray-600">
                            License: {vehicle.licensePlate}
                          </p>
                          <p className="text-sm text-gray-600">
                            VIN: {vehicle.chassisNumber}
                          </p>
                        </div>
                        <div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
              )}
                </div> :

            <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">
                    You don't have any vehicles to transfer.
                  </p>
                  <button
                onClick={() => navigate('/register')}
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded">
                
                    Register a Vehicle First
                  </button>
                </div>
            }
            </div>
          }
          {/* Step 2: Enter Recipient */}
          {currentStep === TransferStep.EnterRecipient && selectedVehicle &&
          <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Selected Vehicle</h4>
                <p>
                  {selectedVehicle.make} {selectedVehicle.model} (
                  {selectedVehicle.year})
                </p>
                <p className="text-sm text-gray-600">
                  License: {selectedVehicle.licensePlate}
                </p>
              </div>
              <form onSubmit={handleRecipientSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Wallet Address
                  </label>
                  <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                  placeholder="Enter the recipient's Cardano wallet address"
                  required />
                
                  <p className="mt-2 text-sm text-gray-500">
                    Make sure to double-check the wallet address. Blockchain
                    transactions cannot be reversed.
                  </p>
                </div>
                <div className="flex justify-between">
                  <button
                  type="button"
                  onClick={() => setCurrentStep(TransferStep.SelectVehicle)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded">
                  
                    Back
                  </button>
                  <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
                  
                    Continue
                  </button>
                </div>
              </form>
            </div>
          }
          {/* Step 3: Confirmation */}
          {currentStep === TransferStep.Confirmation && selectedVehicle &&
          <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Transfer Summary</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {selectedVehicle.make} {selectedVehicle.model} (
                      {selectedVehicle.year})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium">
                      {selectedVehicle.licensePlate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Owner (You)</p>
                    <p className="font-mono text-sm break-all">
                      {selectedVehicle.ownerAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">New Owner</p>
                    <p className="font-mono text-sm break-all">
                      {recipientAddress}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    
                      <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd" />
                    
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This action will transfer ownership of your vehicle on the
                      blockchain. This transaction cannot be reversed once
                      confirmed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                onClick={() => setCurrentStep(TransferStep.EnterRecipient)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded">
                
                  Back
                </button>
                <button
                onClick={handleConfirmTransfer}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
                
                  Confirm Transfer
                </button>
              </div>
            </div>
          }
          {/* Step 4: Processing */}
          {currentStep === TransferStep.Processing &&
          <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                Processing Transaction
              </h3>
              <p className="text-gray-600 mb-4">
                Your transfer request is being processed on the blockchain. This
                may take a few moments.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <p className="text-sm text-blue-700">
                  Please keep this window open until the transaction is
                  complete.
                </p>
              </div>
            </div>
          }
          {/* Step 5: Complete */}
          {currentStep === TransferStep.Complete &&
          <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircleIcon size={48} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Transfer Complete!</h3>
              <p className="text-gray-600 mb-6">
                The vehicle ownership has been successfully transferred on the
                blockchain.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-500 mb-2">Transaction Hash:</p>
                <p className="font-mono text-sm break-all">{transactionHash}</p>
              </div>
              <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
              
                Return to Dashboard
              </button>
            </div>
          }
        </div>
      </div>
    </div>);

};
export default VehicleTransfer;
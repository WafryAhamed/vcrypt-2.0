import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarIcon, ClipboardIcon, CheckCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
interface RegistrationFormData {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  chassisNumber: string;
  engineNumber: string;
  ownerName: string;
  ownerAddress: string;
}
const VehicleRegistration: React.FC = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    chassisNumber: '',
    engineNumber: '',
    ownerName: '',
    ownerAddress: walletAddress || ''
  });
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate blockchain transaction
    try {
      // In a real app, this would interact with the blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsComplete(true);
    } catch (error) {
      console.error('Error registering vehicle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isAuthenticated) {
    return null;
  }
  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircleIcon size={48} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your vehicle has been successfully registered on the blockchain. The
            transaction is being processed and will be confirmed shortly.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-2">Transaction Hash:</p>
            <p className="font-mono text-sm break-all">
              0x7f9a12e4b1d3c5e6f7890a1b2c3d4e5f6789012345678901234567890abcdef
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setIsComplete(false);
                setCurrentStep(1);
                setFormData({
                  make: '',
                  model: '',
                  year: '',
                  color: '',
                  licensePlate: '',
                  chassisNumber: '',
                  engineNumber: '',
                  ownerName: '',
                  ownerAddress: walletAddress || ''
                });
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">
              
              Register Another Vehicle
            </button>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-700 text-white p-6">
          <h2 className="text-2xl font-bold flex items-center">
            <CarIcon className="mr-2" size={24} />
            Register New Vehicle
          </h2>
          <p className="mt-1">
            Enter vehicle details to register on the blockchain
          </p>
        </div>
        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex mb-8">
            <div
              className={`flex-1 text-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                
                <span className="text-sm font-medium">1</span>
              </div>
              <p className="text-xs mt-1">Vehicle Info</p>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${currentStep >= 2 ? 'bg-blue-400' : 'bg-gray-200'}`}>
              </div>
            </div>
            <div
              className={`flex-1 text-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                
                <span className="text-sm font-medium">2</span>
              </div>
              <p className="text-xs mt-1">Ownership</p>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${currentStep >= 3 ? 'bg-blue-400' : 'bg-gray-200'}`}>
              </div>
            </div>
            <div
              className={`flex-1 text-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                
                <span className="text-sm font-medium">3</span>
              </div>
              <p className="text-xs mt-1">Confirm</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Vehicle Information */}
            {currentStep === 1 &&
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make
                    </label>
                    <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Toyota"
                    required />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Camry"
                    required />
                  
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 2022"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Silver"
                    required />
                  
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Plate
                    </label>
                    <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. ABC123"
                    required />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chassis Number (VIN)
                    </label>
                    <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. WBAFG810X3L325364"
                    required />
                  
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engine Number
                  </label>
                  <input
                  type="text"
                  name="engineNumber"
                  value={formData.engineNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. EN12345678"
                  required />
                
                </div>
                <div className="flex justify-end pt-4">
                  <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
                  
                    Next
                  </button>
                </div>
              </div>
            }
            {/* Step 2: Ownership Information */}
            {currentStep === 2 &&
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name
                  </label>
                  <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Full legal name"
                  required />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Address
                  </label>
                  <input
                  type="text"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                  placeholder="Your Cardano wallet address"
                  required
                  readOnly={!!walletAddress} />
                
                  {walletAddress &&
                <p className="text-xs text-gray-500 mt-1">
                      Using your connected wallet address
                    </p>
                }
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Document Upload
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Please upload the following documents to complete the
                    registration:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proof of Purchase
                      </label>
                      <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Document
                      </label>
                      <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emissions Certificate
                      </label>
                      <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Documents will be stored on IPFS with references saved to
                    the blockchain.
                  </p>
                </div>
                <div className="flex justify-between pt-4">
                  <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded">
                  
                    Back
                  </button>
                  <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
                  
                    Next
                  </button>
                </div>
              </div>
            }
            {/* Step 3: Confirmation */}
            {currentStep === 3 &&
            <div>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ClipboardIcon size={20} className="mr-2 text-blue-600" />
                    Registration Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Make</p>
                      <p className="font-medium">{formData.make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium">{formData.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{formData.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-medium">{formData.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Plate</p>
                      <p className="font-medium">{formData.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Chassis Number</p>
                      <p className="font-medium">{formData.chassisNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Engine Number</p>
                      <p className="font-medium">{formData.engineNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Owner Name</p>
                      <p className="font-medium">{formData.ownerName}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Wallet Address</p>
                    <p className="font-mono text-sm break-all">
                      {formData.ownerAddress}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Uploaded Documents</p>
                    <ul className="list-disc list-inside text-sm">
                      <li>Proof of Purchase (document1.pdf)</li>
                      <li>Insurance Document (insurance.pdf)</li>
                      <li>Emissions Certificate (emissions.pdf)</li>
                    </ul>
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
                        By submitting this registration, you confirm that all
                        information provided is accurate. This transaction will
                        be recorded on the blockchain and cannot be altered once
                        confirmed.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded">
                  
                    Back
                  </button>
                  <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  
                    {isSubmitting ?
                  <>
                        <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Processing...
                      </> :

                  'Register Vehicle'
                  }
                  </button>
                </div>
              </div>
            }
          </form>
        </div>
      </div>
    </div>);

};
export default VehicleRegistration;
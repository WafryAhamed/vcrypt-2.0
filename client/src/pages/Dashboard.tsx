import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CarIcon,
  FileTextIcon,
  AlertCircleIcon,
  UsersIcon,
  ClipboardCheckIcon } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import VehicleCard, { VehicleData } from '../components/VehicleCard';
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
},
{
  id: '3',
  licensePlate: 'DEF456',
  chassisNumber: '1HGCM82633A123456',
  make: 'Ford',
  model: 'Mustang',
  year: 2021,
  ownerAddress:
  'addr1qy9wvwjlk67jl4q5rw4q2g2rj3t6j0rrw2q5j9l8d5x3zca7s76x5jj867cjumzj290gqyxl53m5qyj5awmzd30s6qfy4h4s',
  registrationDate: '2023-03-22',
  status: 'pending'
}];

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <CarIcon size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Total Vehicles</h3>
            <p className="text-xl font-semibold">1,234</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FileTextIcon size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Registrations Today</h3>
            <p className="text-xl font-semibold">28</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <UsersIcon size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Active Users</h3>
            <p className="text-xl font-semibold">587</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <AlertCircleIcon size={24} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Pending Approvals</h3>
            <p className="text-xl font-semibold">12</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Recent Vehicle Registrations
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Plate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Make/Model
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockVehicles.map((vehicle) =>
              <tr key={vehicle.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {vehicle.licensePlate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {vehicle.ownerAddress.substring(0, 8)}...
                    {vehicle.ownerAddress.substring(
                    vehicle.ownerAddress.length - 8
                  )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {vehicle.registrationDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                    className={`px-2 py-1 text-xs rounded-full ${vehicle.status === 'active' ? 'bg-green-100 text-green-800' : vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    
                      {vehicle.status.charAt(0).toUpperCase() +
                    vehicle.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-800">
                      View
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">System Activity Log</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3 py-1">
            <p className="text-sm">
              <span className="font-medium">Registration Approved</span> -
              Vehicle ABC123 by Officer John
            </p>
            <p className="text-xs text-gray-500">Today, 10:23 AM</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3 py-1">
            <p className="text-sm">
              <span className="font-medium">Ownership Transferred</span> -
              Vehicle XYZ789 from Alice to Bob
            </p>
            <p className="text-xs text-gray-500">Yesterday, 3:45 PM</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-3 py-1">
            <p className="text-sm">
              <span className="font-medium">New Registration</span> - Vehicle
              DEF456 by Charlie
            </p>
            <p className="text-xs text-gray-500">Yesterday, 11:30 AM</p>
          </div>
        </div>
      </div>
    </div>);

};
const OfficerDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Officer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <ClipboardCheckIcon size={24} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Pending Approvals</h3>
            <p className="text-xl font-semibold">12</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FileTextIcon size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Approved Today</h3>
            <p className="text-xl font-semibold">8</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <CarIcon size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Total Managed</h3>
            <p className="text-xl font-semibold">342</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
        <div className="space-y-4">
          {mockVehicles.
          filter((v) => v.status === 'pending').
          map((vehicle) =>
          <div key={vehicle.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </h4>
                    <p className="text-sm text-gray-600">
                      License: {vehicle.licensePlate}
                    </p>
                    <p className="text-sm text-gray-600">
                      Chassis: {vehicle.chassisNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Owner: {vehicle.ownerAddress.substring(0, 8)}...
                      {vehicle.ownerAddress.substring(
                    vehicle.ownerAddress.length - 8
                  )}
                    </p>
                    <p className="text-sm text-gray-600">
                      Submitted: {vehicle.registrationDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-sm">
                      Approve
                    </button>
                    <button className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
          )}
          {/* Show placeholder if no pending vehicles */}
          {mockVehicles.filter((v) => v.status === 'pending').length === 0 &&
          <div className="text-center py-8 text-gray-500">
              <p>No pending approvals at the moment.</p>
            </div>
          }
        </div>
      </div>
    </div>);

};
const OwnerDashboard: React.FC = () => {
  const { walletAddress } = useAuth();
  const navigate = useNavigate();
  const handleTransfer = (id: string) => {
    navigate(`/transfer?vehicleId=${id}`);
  };
  const handleView = (id: string) => {
    navigate(`/verify?vehicleId=${id}`);
  };
  // Filter vehicles owned by the current user
  const myVehicles = mockVehicles.filter(
    (v) => v.ownerAddress === walletAddress || walletAddress === null
  );
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Vehicle Dashboard</h2>
      <div className="mb-6">
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
          
          <CarIcon size={18} className="mr-2" />
          Register New Vehicle
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold mb-4">My Vehicles</h3>
        {myVehicles.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myVehicles.map((vehicle) =>
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onTransfer={handleTransfer}
            onView={handleView} />

          )}
          </div> :

        <div className="text-center py-8 text-gray-500">
            <p className="mb-4">You don't have any registered vehicles yet.</p>
            <button
            onClick={() => navigate('/register')}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded inline-flex items-center">
            
              <CarIcon size={18} className="mr-2" />
              Register Your First Vehicle
            </button>
          </div>
        }
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3 py-1">
            <p className="text-sm">
              <span className="font-medium">Registration Complete</span> -
              Toyota Camry (ABC123)
            </p>
            <p className="text-xs text-gray-500">Jan 15, 2023</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3 py-1">
            <p className="text-sm">
              <span className="font-medium">Document Updated</span> - Insurance
              for Honda Accord (XYZ789)
            </p>
            <p className="text-xs text-gray-500">Nov 5, 2022</p>
          </div>
        </div>
      </div>
    </div>);

};
const Dashboard: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div>
      {userRole === 'admin' && <AdminDashboard />}
      {userRole === 'officer' && <OfficerDashboard />}
      {userRole === 'owner' && <OwnerDashboard />}
    </div>);

};
export default Dashboard;
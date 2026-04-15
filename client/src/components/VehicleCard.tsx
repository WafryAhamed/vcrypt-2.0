import React from 'react';
import {
  CarIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
  ArrowRightIcon } from
'lucide-react';
export interface VehicleData {
  id: string;
  licensePlate: string;
  chassisNumber: string;
  make: string;
  model: string;
  year: number;
  ownerAddress: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'transferred';
}
interface VehicleCardProps {
  vehicle: VehicleData;
  showActions?: boolean;
  onTransfer?: (id: string) => void;
  onView?: (id: string) => void;
}
const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  showActions = true,
  onTransfer,
  onView
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="p-5">
        {/* Status Badge */}
        <div className="flex justify-end mb-2">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${vehicle.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
            
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </span>
        </div>
        {/* Vehicle Make and Model */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <CarIcon
              className="mr-2 text-blue-600 dark:text-blue-400"
              size={20} />
            
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {vehicle.year}
          </span>
        </div>
        {/* Vehicle Details */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center">
            <TagIcon
              size={16}
              className="mr-2 text-gray-500 dark:text-gray-400" />
            
            <span className="text-gray-700 dark:text-gray-300">
              License:{' '}
              <span className="font-medium">{vehicle.licensePlate}</span>
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon
              size={16}
              className="mr-2 text-gray-500 dark:text-gray-400" />
            
            <span className="text-gray-700 dark:text-gray-300">
              Registered:{' '}
              <span className="font-medium">{vehicle.registrationDate}</span>
            </span>
          </div>
          <div className="flex items-center">
            <UserIcon
              size={16}
              className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            
            <span className="text-gray-700 dark:text-gray-300 truncate">
              Owner:{' '}
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {vehicle.ownerAddress.substring(0, 8)}...
                {vehicle.ownerAddress.substring(
                  vehicle.ownerAddress.length - 8
                )}
              </span>
            </span>
          </div>
        </div>
        {/* Action Buttons */}
        {showActions &&
        <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            {onView &&
          <button
            onClick={() => onView(vehicle.id)}
            className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center">
            
                <EyeIcon size={16} className="mr-1" />
                View Details
              </button>
          }
            {onTransfer &&
          <button
            onClick={() => onTransfer(vehicle.id)}
            className="flex-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center">
            
                <ArrowRightIcon size={16} className="mr-1" />
                Transfer
              </button>
          }
          </div>
        }
      </div>
    </div>);

};
export default VehicleCard;
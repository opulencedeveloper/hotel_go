'use client';

import { Building, MapPin, DollarSign, Calendar, Home, Wrench, CheckCircle } from 'lucide-react';

interface HotelInfoSettingsProps {
  settings: {
    propertyName: string;
    address: string;
    currency: string;
    totalRooms: number;
    totalRoomsOccupied: number;
    totalRoomsInMaintenance: number;
    amenities: string[];
    createdAt: string;
  };
  isReadOnly?: boolean;
}

export default function HotelInfoSettings({ settings, isReadOnly = true }: HotelInfoSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Hotel Information</h3>
      
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Hotel Name
          </label>
          <input
            type="text"
            value={settings.propertyName}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address
          </label>
          <textarea
            value={settings.address}
            rows={3}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Currency
          </label>
          <input
            type="text"
            value={settings.currency}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Created Date
          </label>
          <input
            type="text"
            value={settings.createdAt}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

   

      {/* Amenities */}
      <div>
        <h4 className="text-md font-semibold text-secondary-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Hotel Amenities
        </h4>
        {settings.amenities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {settings.amenities.map((amenity, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {amenity}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">No amenities listed</div>
        )}
      </div>
    </div>
  );
}

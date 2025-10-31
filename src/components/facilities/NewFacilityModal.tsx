'use client';

import { Plus, X } from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';
import { useDispatch } from 'react-redux';
import { facilityActions } from '@/store/redux/facility-slice';

export interface ICreateFacilityUserInput {
  facilityName: string;
  category: string;
  location: string;
  floor: number;
  capacity: number;
  status: string;
  description: string;
}

interface Facility {
  facility_id: string;
  name: string;
  category: 'pool' | 'gym' | 'restaurant' | 'bar' | 'spa' | 'business_center' | 'concierge' | 'parking' | 'wifi' | 'laundry' | 'gift_shop' | 'event_space' | 'rooftop' | 'lobby' | 'security';
  description: string;
  location: string;
  floor: number;
  capacity?: number;
  status: 'operational' | 'maintenance' | 'closed' | 'renovation';
  amenities: string[];
  operating_hours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  access_level: 'public' | 'guest_only' | 'premium' | 'staff_only';
  manager: string;
  contact: {
    phone: string;
    email: string;
  };
  last_maintenance?: string;
  next_maintenance?: string;
  created_at: string;
}

interface NewFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  newFacilityForm: {
    facilityName: string;
    category: string;
    description: string;
    location: string;
    floor: number;
    capacity: number;
    status: string;
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSuccess?: (facility: any) => void;
}

export default function NewFacilityModal({
  isOpen,
  onClose,
  newFacilityForm,
  onFormChange,
  onSubmit,
  onSuccess
}: NewFacilityModalProps) {
  const { 
    isLoading: isCreatingFacility, 
    error: createFacilityError, 
    sendHttpRequest: createFacilityReq 
  } = useHttp();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the payload according to ICreateFacilityUserInput interface
    const payload: ICreateFacilityUserInput = {
      facilityName: newFacilityForm.facilityName,
      category: newFacilityForm.category,
      location: newFacilityForm.location,
      floor: newFacilityForm.floor,
      capacity: newFacilityForm.capacity,
      status: newFacilityForm.status,
      description: newFacilityForm.description
    };

    createFacilityReq({
      successRes: (res: any) => {
        // Call the original onSubmit handler
       onSubmit(e);

       const resData = res?.data?.data;
        const facility = resData?.facility;

        console.log("createdfacility", res)

         dispatch(facilityActions.addFacility(facility));
        
        // Call onSuccess callback if provided
        if (onSuccess && res?.data?.data) {
          onSuccess(facility);
        }
      },
      requestConfig: {
        url: '/hotel/create-facility',
        method: 'POST',
        body: payload,
        successMessage: 'Facility created successfully!'
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Add New Facility</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {createFacilityError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error creating facility
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {createFacilityError}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Facility Name *
              </label>
              <input
                type="text"
                required
                value={newFacilityForm.facilityName}
                onChange={(e) => onFormChange('facilityName', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Grand Pool & Spa"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Category *
              </label>
              <select
                required
                value={newFacilityForm.category}
                onChange={(e) => onFormChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                 <option value="">Select category</option>
                <option value="pool">Pool</option>
                <option value="gym">Gym</option>
                <option value="restaurant">Restaurant</option>
                <option value="bar">Bar</option>
                <option value="spa">Spa</option>
                <option value="business_center">Business Center</option>
                <option value="concierge">Concierge</option>
                <option value="parking">Parking</option>
                <option value="wifi">WiFi</option>
                <option value="laundry">Laundry</option>
                <option value="gift_shop">Gift Shop</option>
                <option value="event_space">Event Space</option>
                <option value="rooftop">Rooftop</option>
                <option value="lobby">Lobby</option>
                <option value="security">Security</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={newFacilityForm.location}
                onChange={(e) => onFormChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Ground Floor, East Wing"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Floor *
              </label>
              <input
                type="number"
                min="0"
                required
                value={newFacilityForm.floor}
                onChange={(e) => onFormChange('floor', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                value={newFacilityForm.capacity}
                onChange={(e) => onFormChange('capacity', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Status
              </label>
              <select
                value={newFacilityForm.status}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="closed">Closed</option>
                <option value="renovation">Renovation</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={newFacilityForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe this facility..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingFacility}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreatingFacility ? 'Creating...' : 'Create Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


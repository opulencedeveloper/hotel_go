'use client';

import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';
import { Facility, facilityActions } from '@/store/redux/facility-slice';
import { useDispatch } from 'react-redux';

interface EditFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingFacility: Facility | null;
  editFacilityForm: {
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

export default function EditFacilityModal({
  isOpen,
  onClose,
  editingFacility,
  editFacilityForm,
  onFormChange,
  onSubmit,
  onSuccess
}: EditFacilityModalProps) {
  const { 
    isLoading: isUpdatingFacility, 
    error: updateFacilityError, 
    sendHttpRequest: updateFacilityReq 
  } = useHttp();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingFacility) return;

    // Prepare the payload for updating facility
    const payload = {
      facilityName: editFacilityForm.facilityName,
      category: editFacilityForm.category,
      location: editFacilityForm.location,
      floor: editFacilityForm.floor,
      capacity: editFacilityForm.capacity,
      status: editFacilityForm.status,
      description: editFacilityForm.description
    };

    updateFacilityReq({
      successRes: (res: any) => {
        // Call the original onSubmit handler

        const resData = res?.data?.data;
       const updatedFacility = resData.updatedFacility;

         dispatch(facilityActions.updateFacility(updatedFacility));
        onSubmit(e);
        
        // Call onSuccess callback if provided
        // if (onSuccess && res?.data?.data) {
        //   onSuccess(res.data.data);
        // }
      },
      requestConfig: {
        url: `/hotel/update-facility?facilityId=${editingFacility._id}`,
        method: 'PUT',
        body: payload,
        successMessage: 'Facility updated successfully!'
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Edit Facility</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {updateFacilityError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error updating facility
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {updateFacilityError}
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
                value={editFacilityForm.facilityName}
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
                value={editFacilityForm.category}
                onChange={(e) => onFormChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
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
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={editFacilityForm.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe the facility and its features..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={editFacilityForm.location}
                onChange={(e) => onFormChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Rooftop, 15th Floor"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Floor *
              </label>
              <input
                type="number"
                required
                min="0"
                value={editFacilityForm.floor}
                onChange={(e) => onFormChange('floor', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={editFacilityForm.capacity}
                onChange={(e) => onFormChange('capacity', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Status
            </label>
            <select
              value={editFacilityForm.status}
              onChange={(e) => onFormChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="closed">Closed</option>
              <option value="renovation">Renovation</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingFacility}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isUpdatingFacility ? 'Updating...' : 'Update Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}











'use client';

import { hotelServiceCategoryLabels } from '@/resources/hotel-service';
import { HotelServiceCategory } from '@/utils/enum';
import { Plus, X } from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  category: string;
  location: string;
  capacity: number;
  description: string;
  price: number;
  status: string;
  updatedAt: string;
}

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  newServiceForm: {
    name: string;
    category: string;
    price: number;
    capacity: number;
    description: string;
    location: string;
    status: string;
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  error?: any;
}

export default function NewServiceModal({ 
  isOpen, 
  onClose, 
  newServiceForm, 
  onFormChange, 
  onSubmit,
  isLoading = false,
  error
}: NewServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Add New Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 text-sm">
                {error || 'An error occurred while creating the service. Please try again.'}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={newServiceForm.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Grand Spa & Wellness"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Category *
              </label>
              <select
                required
                value={newServiceForm.category}
                onChange={(e) => onFormChange('category', e.target.value as Service['category'])}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
            {Object.values(HotelServiceCategory).map((value) => (
        <option key={value} value={value}>
          {hotelServiceCategoryLabels[value]}
        </option>
      ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={newServiceForm.price}
                onChange={(e) => onFormChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={newServiceForm.capacity}
                onChange={(e) => onFormChange('capacity', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={newServiceForm.location}
                onChange={(e) => onFormChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Ground Floor, East Wing"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Status *
              </label>
              <select
                required
                value={newServiceForm.status}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={newServiceForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe this service..."
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
              disabled={isLoading}
              className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingService: Service | null;
  editServiceForm: {
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

export default function EditServiceModal({ 
  isOpen, 
  onClose, 
  editingService,
  editServiceForm,
  onFormChange,
  onSubmit,
  isLoading = false,
  error
}: EditServiceModalProps) {
  if (!isOpen || !editingService) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Edit Service</h2>
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
                {error || 'An error occurred while updating the service. Please try again.'}
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
                value={editServiceForm.name}
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
                value={editServiceForm.category}
                onChange={(e) => onFormChange('category', e.target.value)}
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
                Price (USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={editServiceForm.price}
                onChange={(e) => onFormChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
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
                value={editServiceForm.capacity}
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
                value={editServiceForm.location}
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
                value={editServiceForm.status}
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
                rows={4}
                value={editServiceForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the service details, features, and what guests can expect..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}









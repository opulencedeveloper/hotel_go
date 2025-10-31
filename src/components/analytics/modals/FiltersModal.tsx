'use client';

import { X, Filter } from 'lucide-react';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    dateRange: string;
    roomTypes: string[];
    revenueRange: { min: number; max: number };
    occupancyRange: { min: number; max: number };
    guestSegments: string[];
    channels: string[];
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FiltersModal({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
}: FiltersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Custom Analytics Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Date Range *
              </label>
              <select
                required
                value={formData.dateRange}
                onChange={(e) => onFormChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Revenue Range ($)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.revenueRange.min}
                  onChange={(e) => onFormChange('revenueRange', {
                    ...formData.revenueRange,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={formData.revenueRange.max}
                  onChange={(e) => onFormChange('revenueRange', {
                    ...formData.revenueRange,
                    max: parseInt(e.target.value) || 1000000
                  })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Occupancy Range (%)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.occupancyRange.min}
                  onChange={(e) => onFormChange('occupancyRange', {
                    ...formData.occupancyRange,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Min %"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.occupancyRange.max}
                  onChange={(e) => onFormChange('occupancyRange', {
                    ...formData.occupancyRange,
                    max: parseInt(e.target.value) || 100
                  })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Max %"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Room Types
              </label>
              <select
                multiple
                value={formData.roomTypes}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  onFormChange('roomTypes', values);
                }}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="presidential">Presidential</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Guest Segments
              </label>
              <select
                multiple
                value={formData.guestSegments}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  onFormChange('guestSegments', values);
                }}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="business">Business</option>
                <option value="leisure">Leisure</option>
                <option value="repeat">Repeat Guests</option>
                <option value="new">New Guests</option>
                <option value="group">Group Bookings</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Booking Channels
              </label>
              <select
                multiple
                value={formData.channels}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  onFormChange('channels', values);
                }}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="direct">Direct</option>
                <option value="ota">Online Travel Agency</option>
                <option value="phone">Phone</option>
                <option value="walk-in">Walk-in</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
          </div>
          
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <h4 className="font-medium text-secondary-900 mb-3">Filter Preview</h4>
            <div className="text-sm text-secondary-700 space-y-1">
              <p>• Date Range: {formData.dateRange}</p>
              <p>• Revenue: ${formData.revenueRange.min.toLocaleString()} - ${formData.revenueRange.max.toLocaleString()}</p>
              <p>• Occupancy: {formData.occupancyRange.min}% - {formData.occupancyRange.max}%</p>
              <p>• Room Types: {formData.roomTypes.length > 0 ? formData.roomTypes.join(', ') : 'All'}</p>
              <p>• Guest Segments: {formData.guestSegments.length > 0 ? formData.guestSegments.join(', ') : 'All'}</p>
              <p>• Channels: {formData.channels.length > 0 ? formData.channels.join(', ') : 'All'}</p>
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
              className="btn-primary"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

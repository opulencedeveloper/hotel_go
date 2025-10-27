'use client';

import { X, RefreshCw } from 'lucide-react';

interface RefreshModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    dataSource: string;
    refreshType: string;
    includeRealTime: boolean;
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  totalBookings: number;
  totalRooms: number;
  isClient: boolean;
}

export default function RefreshModal({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  totalBookings,
  totalRooms,
  isClient,
}: RefreshModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Refresh Analytics Data</h2>
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
                Data Source *
              </label>
              <select
                required
                value={formData.dataSource}
                onChange={(e) => onFormChange('dataSource', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Data Sources</option>
                <option value="bookings">Bookings & Reservations</option>
                <option value="revenue">Revenue Data</option>
                <option value="occupancy">Occupancy Data</option>
                <option value="guests">Guest Data</option>
                <option value="rooms">Room Data</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Refresh Type *
              </label>
              <select
                required
                value={formData.refreshType}
                onChange={(e) => onFormChange('refreshType', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="full">Full Refresh</option>
                <option value="incremental">Incremental Update</option>
                <option value="realtime">Real-time Sync</option>
                <option value="scheduled">Scheduled Refresh</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includeRealTime}
                  onChange={(e) => onFormChange('includeRealTime', e.target.checked)}
                  className="mr-3 rounded border-secondary-300"
                />
                <span className="text-sm text-secondary-700">Enable Real-time Data Updates</span>
              </label>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Refresh Information</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Last refresh: {isClient ? new Date().toLocaleString() : '--:-- --'}</p>
              <p>• Data points: {totalBookings} bookings, {totalRooms} rooms</p>
              <p>• Estimated time: 2-5 minutes</p>
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
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

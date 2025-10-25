'use client';

import { Plus, Calendar, Settings, Star } from 'lucide-react';

interface ServiceHeaderProps {
  serviceStats: {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
  };
  onAddService: () => void;
  onSchedule: () => void;
  onSettings: () => void;
}

export default function ServiceHeader({ 
  serviceStats, 
  onAddService, 
  onSchedule, 
  onSettings 
}: ServiceHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Services Management</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">Spa, Events & Amenities</span>
            </div>
          </div>
          
          <p className="text-purple-100 text-lg mb-6">
            Manage all hotel services including spa, event center, fitness, and guest amenities.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Star className="w-4 h-4" />
              <span className="text-purple-100">Total Services:</span>
              <span className="font-medium">{serviceStats.total}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-purple-200">Active:</span>
              <span className="font-medium">{serviceStats.active}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-purple-200">Inactive:</span>
              <span className="font-medium">{serviceStats.inactive}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-purple-200">Maintenance:</span>
              <span className="font-medium">{serviceStats.maintenance}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="flex flex-col gap-3">
            <button 
              onClick={onAddService}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
            <button 
              onClick={onSchedule}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
            {/* <button 
              onClick={onSettings}
              className="bg-white text-purple-600 hover:bg-purple-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}





'use client';

import { Plus, Settings, Shield, Building } from 'lucide-react';

interface FacilityStats {
  total: number;
  operational: number;
  maintenance: number;
  closed: number;
  renovation: number;
}

interface FacilityHeaderProps {
  facilityStats: FacilityStats;
  onAddFacility: () => void;
  onMaintenance: () => void;
  onSecurity: () => void;
}

export default function FacilityHeader({
  facilityStats,
  onAddFacility,
  onMaintenance,
  onSecurity
}: FacilityHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Facilities Management</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">Hotel Amenities & Infrastructure</span>
            </div>
          </div>
          
          <p className="text-green-100 text-lg mb-6">
            Manage all hotel facilities including pools, gyms, business centers, and guest amenities.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Building className="w-4 h-4" />
              <span className="text-green-100">Total Facilities:</span>
              <span className="font-medium">{facilityStats.total}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-green-200">Operational:</span>
              <span className="font-medium">{facilityStats.operational}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-green-200">Maintenance:</span>
              <span className="font-medium">{facilityStats.maintenance}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-green-200">Closed:</span>
              <span className="font-medium">{facilityStats.closed}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-green-200">Renovation:</span>
              <span className="font-medium">{facilityStats.renovation}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="flex flex-col gap-3">
            <button 
              onClick={onAddFacility}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility</span>
            </button>
            {/* <button 
              onClick={onMaintenance}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Settings className="w-4 h-4" />
              <span>Maintenance</span>
            </button>
            <button 
              onClick={onSecurity}
              className="bg-white text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}







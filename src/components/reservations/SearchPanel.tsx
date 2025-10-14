'use client';

import { AlertTriangle, Settings } from 'lucide-react';

interface SearchParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: string;
  ratePlan: string;
}

interface RoomType {
  room_type_id: string;
  name: string;
  base_rate: number;
}

interface RatePlan {
  rate_plan_id: string;
  name: string;
}

interface Room {
  room_id: string;
  room_number: string;
  floor: number;
  room_type_id: string;
  status: string;
}

interface SearchPanelProps {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  roomTypes: RoomType[];
  ratePlans: RatePlan[];
  searchResults: Room[];
  overbookingAlerts: string[];
  onRateRulesClick: () => void;
}

export default function SearchPanel({
  searchParams,
  setSearchParams,
  roomTypes,
  ratePlans,
  searchResults,
  overbookingAlerts,
  onRateRulesClick
}: SearchPanelProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Search & Availability</h3>
        <button 
          onClick={onRateRulesClick}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          <Settings className="w-4 h-4 mr-1 inline" />
          Rate Rules
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Check-in Date
          </label>
          <input 
            type="date" 
            value={searchParams.checkIn}
            onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Check-out Date
          </label>
          <input 
            type="date" 
            value={searchParams.checkOut}
            onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Adults
          </label>
          <input 
            type="number" 
            min="1" 
            value={searchParams.adults}
            onChange={(e) => setSearchParams({ ...searchParams, adults: parseInt(e.target.value) })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Children
          </label>
          <input 
            type="number" 
            min="0" 
            value={searchParams.children}
            onChange={(e) => setSearchParams({ ...searchParams, children: parseInt(e.target.value) })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Room Type
          </label>
          <select 
            value={searchParams.roomType}
            onChange={(e) => setSearchParams({ ...searchParams, roomType: e.target.value })}
            className="input"
          >
            <option value="">All Types</option>
            {roomTypes.map(type => (
              <option key={type.room_type_id} value={type.room_type_id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Rate Plan
          </label>
          <select 
            value={searchParams.ratePlan}
            onChange={(e) => setSearchParams({ ...searchParams, ratePlan: e.target.value })}
            className="input"
          >
            <option value="">All Plans</option>
            {ratePlans.map(plan => (
              <option key={plan.rate_plan_id} value={plan.rate_plan_id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-secondary-900 mb-3">
            Available Rooms ({searchResults.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.slice(0, 6).map(room => (
              <div key={room.room_id} className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-secondary-900">Room {room.room_number}</h5>
                  <span className="text-sm text-secondary-500">Floor {room.floor}</span>
                </div>
                <div className="text-sm text-secondary-600 mb-3">
                  {roomTypes.find(type => type.room_type_id === room.room_type_id)?.name}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-900">
                    ${roomTypes.find(type => type.room_type_id === room.room_type_id)?.base_rate}/night
                  </span>
                  <button className="btn-primary text-sm">
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overbooking Alerts */}
      {overbookingAlerts.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Overbooking Risk</h4>
              {overbookingAlerts.map((alert, index) => (
                <p key={index} className="text-sm text-yellow-700">{alert}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


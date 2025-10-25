'use client';

import { Users, Clock } from 'lucide-react';

interface FrontDeskDashboardProps {
  stats: any;
}

export default function FrontDeskDashboard({ stats }: FrontDeskDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Arrivals</span>
              <span className="font-semibold text-blue-600">{stats?.arrivals_today || 8}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Departures</span>
              <span className="font-semibold text-red-600">{stats?.departures_today || 6}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">In House</span>
              <span className="font-semibold">
                100
                {/* {guests.length} */}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Check-ins</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">Room 201 - John Doe</span>
              <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Check In</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">Room 305 - Jane Smith</span>
              <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Check In</button>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Pending Tasks</h3>
          <div className="space-y-2">
            <div className="flex items-center text-orange-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">3 Late check-outs</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">2 Walk-ins waiting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







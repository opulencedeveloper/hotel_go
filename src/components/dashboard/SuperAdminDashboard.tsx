'use client';

interface SuperAdminDashboardProps {
  hotels: any[];
  occupancyPercentage: number;
}

export default function SuperAdminDashboard({ hotels, occupancyPercentage }: SuperAdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">System Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Total Properties</span>
              <span className="font-semibold">{hotels.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Active Users</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">System Status</span>
              <span className="text-green-600 font-semibold">Online</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{occupancyPercentage}%</div>
              <div className="text-sm text-secondary-600">Occupancy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-secondary-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-secondary-600">Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-secondary-600">Check-outs</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
              Manage Users
            </button>
            <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
              System Settings
            </button>
            <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}







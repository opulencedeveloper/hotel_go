'use client';

export default function HousekeepingDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Room Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Dirty Rooms</span>
              <span className="font-semibold text-red-600">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Cleaning in Progress</span>
              <span className="font-semibold text-yellow-600">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Ready for Check-in</span>
              <span className="font-semibold text-green-600">25</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Tasks</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <span className="text-sm">Room 201 - Deep Clean</span>
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">High Priority</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm">Room 305 - Standard Clean</span>
              <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Medium</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">Room 102 - Quick Clean</span>
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





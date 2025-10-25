'use client';

export default function GuestServicesDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Guest Services</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Active Requests</span>
              <span className="font-semibold text-blue-600">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Completed Today</span>
              <span className="font-semibold text-green-600">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Guest Satisfaction</span>
              <span className="font-semibold text-green-600">4.8/5</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Service Requests</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">Room 201 - Extra Towels</span>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">In Progress</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span className="text-sm">Room 305 - Late Checkout</span>
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">Pending</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">Room 102 - Concierge</span>
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







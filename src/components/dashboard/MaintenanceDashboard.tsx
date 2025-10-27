'use client';

export default function MaintenanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Maintenance Tickets</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Open Tickets</span>
              <span className="font-semibold text-red-600">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">In Progress</span>
              <span className="font-semibold text-yellow-600">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Completed Today</span>
              <span className="font-semibold text-green-600">8</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Urgent Issues</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <span className="text-sm">Room 201 - AC Not Working</span>
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Urgent</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span className="text-sm">Elevator 2 - Slow Response</span>
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









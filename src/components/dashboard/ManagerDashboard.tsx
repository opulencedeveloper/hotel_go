'use client';

interface ManagerDashboardProps {
  stats: any;
}

export default function ManagerDashboard({ stats }: ManagerDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Operations</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Check-ins</span>
              <span className="font-semibold">{stats?.arrivals_today || 8}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Check-outs</span>
              <span className="font-semibold">{stats?.departures_today || 6}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Occupancy</span>
              <span className="font-semibold">{stats?.occupancy?.today || 85}%</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Staff Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-600">Housekeeping Tasks</span>
              <span className="font-semibold">{stats?.housekeeping_tasks || 12}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Maintenance Issues</span>
              <span className="font-semibold">{stats?.maintenance_tasks || 3}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Guest Requests</span>
              <span className="font-semibold">{stats?.guest_requests || 5}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







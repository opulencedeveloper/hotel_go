'use client';

interface ActiveTasksProps {
  stats: any;
}

export default function ActiveTasks({ stats }: ActiveTasksProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Tasks</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Housekeeping</span>
          </div>
          <span className="text-2xl font-bold text-yellow-600">
            {stats.housekeeping_tasks}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Maintenance</span>
          </div>
          <span className="text-2xl font-bold text-orange-600">
            {stats.maintenance_tasks}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Guest Requests</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {stats.guest_requests}
          </span>
        </div>
      </div>
    </div>
  );
}
'use client';

interface SystemStatusProps {
  stats: any;
  systemHealth: string;
}

export default function SystemStatus({ stats, systemHealth }: SystemStatusProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Online Status</span>
          <span className={`text-sm font-medium ${getHealthColor(systemHealth)}`}>
            {stats.online_status ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Last Sync</span>
          <span className="text-sm text-gray-500">
            {stats.last_sync}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Pending Sync</span>
          <span className="text-sm text-gray-500">
            {stats.pending_sync_items} items
          </span>
        </div>
      </div>
    </div>
  );
}








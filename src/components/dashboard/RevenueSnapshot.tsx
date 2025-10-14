'use client';

interface RevenueByOutlet {
  rooms: number;
  f_and_b: number;
  other: number;
}

interface RevenueSnapshotProps {
  revenueByOutlet: RevenueByOutlet;
}

export default function RevenueSnapshot({ revenueByOutlet }: RevenueSnapshotProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Revenue by Outlet</h3>
        <span className="text-sm text-secondary-600">Today</span>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-secondary-900">Rooms</span>
          </div>
          <span className="text-sm font-medium text-secondary-900">${revenueByOutlet.rooms.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-secondary-900">F&B</span>
          </div>
          <span className="text-sm font-medium text-secondary-900">${revenueByOutlet.f_and_b.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-secondary-900">Other</span>
          </div>
          <span className="text-sm font-medium text-secondary-900">${revenueByOutlet.other.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}


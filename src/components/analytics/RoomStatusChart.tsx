'use client';

interface RoomStatusChartProps {
  availableRooms: number;
  totalRooms: number;
}

export default function RoomStatusChart({ availableRooms, totalRooms }: RoomStatusChartProps) {
  const occupiedRooms = totalRooms - availableRooms;
  const maintenanceRooms = totalRooms - availableRooms - occupiedRooms;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Room Status Distribution</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-secondary-900">Available</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-secondary-900">{availableRooms}</p>
              <p className="text-xs text-secondary-600">{totalRooms > 0 ? ((availableRooms / totalRooms) * 100).toFixed(1) : '0.0'}%</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-secondary-900">Occupied</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-secondary-900">{occupiedRooms}</p>
              <p className="text-xs text-secondary-600">{totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0.0'}%</p>
            </div>
          </div>
          
          {maintenanceRooms > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-secondary-900">Maintenance</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-secondary-900">{maintenanceRooms}</p>
                <p className="text-xs text-secondary-600">{totalRooms > 0 ? ((maintenanceRooms / totalRooms) * 100).toFixed(1) : '0.0'}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

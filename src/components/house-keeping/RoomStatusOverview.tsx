'use client';

interface RoomStatusOverviewProps {
  roomStats: {
    total: number;
    available: number;
    occupied: number;
    markForCleaning: number;
    cleaning: number;
    maintenance: number;
  };
}

export default function RoomStatusOverview({ roomStats }: RoomStatusOverviewProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Room Status Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{roomStats.available}</div>
          <div className="text-sm text-secondary-600">Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{roomStats.occupied}</div>
          <div className="text-sm text-secondary-600">Occupied</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{roomStats.markForCleaning}</div>
          <div className="text-sm text-secondary-600">Marked for Cleaning</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{roomStats.cleaning}</div>
          <div className="text-sm text-secondary-600">Cleaning</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{roomStats.maintenance}</div>
          <div className="text-sm text-secondary-600">Maintenance</div>
        </div>
      </div>
    </div>
  );
}


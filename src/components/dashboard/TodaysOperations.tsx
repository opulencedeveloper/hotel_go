'use client';

interface TodaysOperationsProps {
  stats: any;
  roomStatusCounts: any;
}

export default function TodaysOperations({ stats, roomStatusCounts }: TodaysOperationsProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Operations</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Arrivals</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {stats.arrivals_today}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Departures</span>
          </div>
          <span className="text-2xl font-bold text-red-600">
            {stats.departures_today}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">In House</span>
          </div>
          <span className="text-2xl font-bold text-green-600">
            {roomStatusCounts.occupied}
          </span>
        </div>
      </div>
    </div>
  );
}







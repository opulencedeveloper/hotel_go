'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface TodaysOperationsProps {
  stats: any;
  roomStatusCounts: any;
}

export default function TodaysOperations({ stats, roomStatusCounts }: TodaysOperationsProps) {
  const stay = useSelector((state: RootState) => state.stay);
  const room = useSelector((state: RootState) => state.room);
  
  // Calculate today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get real-time data from Redux state
  const todaysArrivals = stay.stays.filter(stay => 
    stay.checkInDate === today && stay.status === 'confirmed'
  ).length;
  
  const todaysDepartures = stay.stays.filter(stay => 
    stay.checkOutDate === today && stay.status === 'checked-in'
  ).length;
  
  const inHouseGuests = stay.stays.filter(stay => 
    stay.status === 'checked-in'
  ).length;
  
  // Calculate room utilization
  const totalRooms = room.hotelRooms.length;
  const availableRooms = room.hotelRooms.filter(r => r.roomStatus === 'available').length;
  const occupiedRooms = room.hotelRooms.filter(r => r.roomStatus === 'occupied').length;
  const maintenanceRooms = room.hotelRooms.filter(r => r.roomStatus === 'maintenance').length;
  
  // Calculate utilization percentage
  const utilizationRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

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
            {todaysArrivals}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Departures</span>
          </div>
          <span className="text-2xl font-bold text-red-600">
            {todaysDepartures}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">In House</span>
          </div>
          <span className="text-2xl font-bold text-green-600">
            {inHouseGuests}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Utilization</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {utilizationRate}%
          </span>
        </div>
      </div>
      
      {/* Room Status Breakdown */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Room Status</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{availableRooms}</div>
            <div className="text-xs text-gray-600">Available</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-600">{maintenanceRooms}</div>
            <div className="text-xs text-gray-600">Maintenance</div>
          </div>
        </div>
      </div>
    </div>
  );
}







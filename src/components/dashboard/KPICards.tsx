'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface KPICardsProps {
  occupancyRate: number;
  totalRevenue: number;
  activeAlerts: number;
  selectedHotel: any;
  stats: any;
}

export default function KPICards({ 
  occupancyRate, 
  totalRevenue, 
  activeAlerts, 
  selectedHotel, 
  stats 
}: KPICardsProps) {
  // Get additional Redux state for enhanced calculations
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const room = useSelector((state: RootState) => state.room);
  const stay = useSelector((state: RootState) => state.stay);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate additional metrics from Redux state
  const totalRooms = room.hotelRooms.length;
  const availableRooms = room.hotelRooms.filter(r => r.roomStatus === 'available').length;
  const maintenanceRooms = room.hotelRooms.filter(r => r.roomStatus === 'maintenance').length;
  const activeHousekeepingTasks = houseKeeping.houseKeepings.filter(task => task.status === 'in_progress').length;
  const completedHousekeepingTasks = houseKeeping.houseKeepings.filter(task => task.status === 'completed').length;
  
  // Calculate task completion rate
  const totalTasks = houseKeeping.houseKeepings.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedHousekeepingTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Occupancy Rate */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Occupancy Rate
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {occupancyRate}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-green-600 font-medium">
              +{stats.occupancy.change_percent}%
            </span>
            <span className="text-gray-500"> from last month</span>
          </div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalRevenue)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-green-600 font-medium">
              +{((stats.revenue_by_outlet.rooms + stats.revenue_by_outlet.f_and_b + stats.revenue_by_outlet.other) / 1000).toFixed(1)}k
            </span>
            <span className="text-gray-500"> today</span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Alerts
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {activeAlerts}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-red-600 font-medium">
              {stats.overbook_risk} overbook risk
            </span>
          </div>
        </div>
      </div>

      {/* Room Status */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Available Rooms
                </dt> 
                <dd className="text-lg font-medium text-gray-900">
                  {selectedHotel?.totalRooms! - selectedHotel?.totalRoomsOccupied!}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-gray-600">
              {selectedHotel?.totalRoomsOccupied!} occupied, {selectedHotel?.totalRoomsInMaintenance!} maintenance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}







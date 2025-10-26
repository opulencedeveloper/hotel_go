'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { HouseKeepingStatus } from '@/utils/enum';

interface SuperAdminDashboardProps {
  hotels: any[];
  occupancyPercentage: number;
}

export default function SuperAdminDashboard({ hotels, occupancyPercentage }: SuperAdminDashboardProps) {
  // Get comprehensive Redux state for system overview
  const stay = useSelector((state: RootState) => state.stay);
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const room = useSelector((state: RootState) => state.room);
  const staff = useSelector((state: RootState) => state.staff);
  const user = useSelector((state: RootState) => state.user);
  
  // Calculate today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate system-wide metrics
  const totalRooms = room.hotelRooms.length;
  const occupiedRooms = room.hotelRooms.filter(r => r.roomStatus === 'occupied').length;
  const availableRooms = room.hotelRooms.filter(r => r.roomStatus === 'available').length;
  const maintenanceRooms = room.hotelRooms.filter(r => r.roomStatus === 'maintenance').length;
  
  // Calculate today's operations
  const todaysCheckIns = stay.stays.filter(stay => 
    stay.checkInDate === today && stay.status === 'confirmed'
  ).length;
  
  const todaysCheckOuts = stay.stays.filter(stay => 
    stay.checkOutDate === today && stay.status === 'checked-in'
  ).length;
  
  // Calculate task metrics
  const totalTasks = houseKeeping.houseKeepings.length;
  const activeTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.IN_PROGRESS
  ).length;
  const completedTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.COMPLETED
  ).length;
  
  // Calculate staff metrics
  const totalStaff = staff.staffs.length;
  const activeStaff = staff.staffs.filter(staff => staff.status === 'active').length;
  
  // Calculate system health score
  const systemHealthScore = Math.round(
    ((completedTasks / Math.max(totalTasks, 1)) * 0.4 + 
     (availableRooms / Math.max(totalRooms, 1)) * 0.3 + 
     (activeStaff / Math.max(totalStaff, 1)) * 0.3) * 100
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">System Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Total Properties</span>
              <span className="font-semibold">{hotels.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Total Rooms</span>
              <span className="font-semibold">{totalRooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Active Staff</span>
              <span className="font-semibold">{activeStaff}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">System Health</span>
              <span className={`font-semibold ${
                systemHealthScore >= 80 ? 'text-green-600' : 
                systemHealthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {systemHealthScore}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{occupancyPercentage}%</div>
              <div className="text-sm text-secondary-600">Occupancy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-sm text-secondary-600">Completed Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{todaysCheckIns}</div>
              <div className="text-sm text-secondary-600">Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{todaysCheckOuts}</div>
              <div className="text-sm text-secondary-600">Check-outs</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
              Manage Users
            </button>
            <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
              System Settings
            </button>
            <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
              View Logs
            </button>
          </div>
        </div>
      </div>
      
      {/* System Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{totalRooms}</div>
            <div className="text-sm text-gray-600">Total Rooms</div>
            <div className="text-xs text-gray-500 mt-1">
              {availableRooms} available, {occupiedRooms} occupied
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
            <div className="text-xs text-gray-500 mt-1">
              {activeTasks} active, {totalTasks} total
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{activeStaff}</div>
            <div className="text-sm text-gray-600">Active Staff</div>
            <div className="text-xs text-gray-500 mt-1">
              {totalStaff} total staff members
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{systemHealthScore}%</div>
            <div className="text-sm text-gray-600">System Health</div>
            <div className="text-xs text-gray-500 mt-1">
              Overall performance score
            </div>
          </div>
        </div>
      </div>
      
      {/* Hotel Properties Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Hotel Properties</h3>
        <div className="space-y-3">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <h4 className="font-medium text-gray-900">{hotel.hotelName}</h4>
                <p className="text-sm text-gray-600">{hotel.address}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {hotel.totalRoomsOccupied || 0} / {hotel.totalRooms || 0} rooms
                </div>
                <div className="text-xs text-gray-500">
                  {hotel.totalRooms ? Math.round(((hotel.totalRoomsOccupied || 0) / hotel.totalRooms) * 100) : 0}% occupancy
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}







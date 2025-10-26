'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { HouseKeepingStatus } from '@/utils/enum';

interface ManagerDashboardProps {
  stats: any;
}

export default function ManagerDashboard({ stats }: ManagerDashboardProps) {
  const stay = useSelector((state: RootState) => state.stay);
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const room = useSelector((state: RootState) => state.room);
  const staff = useSelector((state: RootState) => state.staff);
  const hotel = useSelector((state: RootState) => state.hotel);
  
  // Calculate today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's operations from Redux state
  const todaysCheckIns = stay.stays.filter(stay => 
    stay.checkInDate === today && stay.status === 'confirmed'
  ).length;
  
  const todaysCheckOuts = stay.stays.filter(stay => 
    stay.checkOutDate === today && stay.status === 'checked-in'
  ).length;
  
  // Calculate occupancy rate
  const totalRooms = room.hotelRooms.length;
  const occupiedRooms = room.hotelRooms.filter(room => room.roomStatus === 'occupied').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  // Get housekeeping tasks from Redux state
  const activeHousekeepingTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.IN_PROGRESS
  ).length;
  
  const completedHousekeepingTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.COMPLETED
  ).length;
  
  // Get maintenance rooms
  const maintenanceRooms = room.hotelRooms.filter(room => room.roomStatus === 'maintenance').length;
  
  // Get active staff
  const activeStaff = staff.staffs.filter(staff => staff.status === 'active').length;
  
  // Calculate guest requests (mock calculation)
  const guestRequests = Math.floor(Math.random() * 10) + 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Operations</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Check-ins</span>
              <span className="font-semibold text-blue-600">{todaysCheckIns}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Check-outs</span>
              <span className="font-semibold text-red-600">{todaysCheckOuts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Occupancy</span>
              <span className="font-semibold text-green-600">{occupancyRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Available Rooms</span>
              <span className="font-semibold text-purple-600">
                {room.hotelRooms.filter(r => r.roomStatus === 'available').length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Staff Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-600">Housekeeping Tasks</span>
              <span className="font-semibold text-yellow-600">{activeHousekeepingTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Maintenance Issues</span>
              <span className="font-semibold text-orange-600">{maintenanceRooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Guest Requests</span>
              <span className="font-semibold text-purple-600">{guestRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Active Staff</span>
              <span className="font-semibold text-green-600">{activeStaff}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{occupancyRate}%</div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{completedHousekeepingTasks}</div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{activeHousekeepingTasks}</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{activeStaff}</div>
            <div className="text-sm text-gray-600">Active Staff</div>
          </div>
        </div>
      </div>
      
      {/* Hotel Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Hotel Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900 mb-2">Room Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-medium">{room.hotelRooms.filter(r => r.roomStatus === 'available').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Occupied:</span>
                <span className="font-medium">{occupiedRooms}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="font-medium">{maintenanceRooms}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900 mb-2">Task Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Tasks:</span>
                <span className="font-medium">{houseKeeping.houseKeepings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span className="font-medium">{activeHousekeepingTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-medium">{completedHousekeepingTasks}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900 mb-2">Staff Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Staff:</span>
                <span className="font-medium">{staff.staffs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-medium">{activeStaff}</span>
              </div>
              <div className="flex justify-between">
                <span>Inactive:</span>
                <span className="font-medium">{staff.staffs.length - activeStaff}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







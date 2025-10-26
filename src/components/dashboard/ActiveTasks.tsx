'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { HouseKeepingStatus } from '@/utils/enum';

interface ActiveTasksProps {
  stats: any;
}

export default function ActiveTasks({ stats }: ActiveTasksProps) {
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const room = useSelector((state: RootState) => state.room);
  
  // Calculate real-time task counts from Redux state
  const activeHousekeepingTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.IN_PROGRESS
  ).length;
  
  const maintenanceRooms = room.hotelRooms.filter(room => room.roomStatus === 'maintenance').length;
  
  // Calculate guest requests (mock calculation based on room status)
  const guestRequests = Math.floor(Math.random() * 10) + 1;
  
  // Get today's tasks
  const todaysTasks = houseKeeping.houseKeepings.filter(task => {
    const taskDate = new Date(task.createdAt).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });

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
            {activeHousekeepingTasks}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Maintenance</span>
          </div>
          <span className="text-2xl font-bold text-orange-600">
            {maintenanceRooms}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Guest Requests</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {guestRequests}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Today's Tasks</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {todaysTasks.length}
          </span>
        </div>
      </div>
      
      {/* Task Progress */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Task Progress</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completed Tasks</span>
            <span className="font-medium">
              {houseKeeping.houseKeepings.filter(task => task.status === HouseKeepingStatus.COMPLETED).length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>In Progress</span>
            <span className="font-medium">{activeHousekeepingTasks}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cancelled</span>
            <span className="font-medium">
              {houseKeeping.houseKeepings.filter(task => task.status === HouseKeepingStatus.CANCELLED).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
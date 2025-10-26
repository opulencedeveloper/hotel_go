'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { HouseKeepingStatus } from '@/utils/enum';

export default function HousekeepingDashboard() {
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const room = useSelector((state: RootState) => state.room);
  
  // Calculate room status from Redux state
  const dirtyRooms = room.hotelRooms.filter(room => room.roomStatus === 'marked_for_cleaning').length;
  const cleaningInProgress = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.IN_PROGRESS
  ).length;
  const readyForCheckin = room.hotelRooms.filter(room => room.roomStatus === 'available').length;
  
  // Get today's tasks from Redux state
  const todaysTasks = houseKeeping.houseKeepings.filter(task => {
    const taskDate = new Date(task.createdAt).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });
  
  // Get priority tasks (in progress)
  const priorityTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.IN_PROGRESS
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Room Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Dirty Rooms</span>
              <span className="font-semibold text-red-600">{dirtyRooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Cleaning in Progress</span>
              <span className="font-semibold text-yellow-600">{cleaningInProgress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Ready for Check-in</span>
              <span className="font-semibold text-green-600">{readyForCheckin}</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Tasks</h3>
          <div className="space-y-2">
            {priorityTasks.length > 0 ? (
              priorityTasks.map((task, index) => (
                <div key={task._id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm">{task.title}</span>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                    {task.status === HouseKeepingStatus.IN_PROGRESS ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No active tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Task Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Task Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {houseKeeping.houseKeepings.length}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {houseKeeping.houseKeepings.filter(task => task.status === HouseKeepingStatus.COMPLETED).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {houseKeeping.houseKeepings.filter(task => task.status === HouseKeepingStatus.IN_PROGRESS).length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}







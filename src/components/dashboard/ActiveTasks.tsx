'use client';

import { AlertCircle } from 'lucide-react';

interface Task {
  task_id: string;
  room_id: string;
  type: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

interface ActiveTasksProps {
  tasks: Task[];
}

export default function ActiveTasks({ tasks }: ActiveTasksProps) {
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Active Tasks</h3>
        {(
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        )}
      </div>
      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <div key={task.task_id} className={`flex items-center space-x-3 p-3 rounded-lg ${
            task.priority === 'urgent' ? 'bg-red-50' : 
            task.priority === 'high' ? 'bg-yellow-50' : 
            task.priority === 'medium' ? 'bg-blue-50' : 'bg-gray-50'
          }`}>
            <div className={`p-2 rounded-full ${
              task.priority === 'urgent' ? 'bg-red-100' : 
              task.priority === 'high' ? 'bg-yellow-100' : 
              task.priority === 'medium' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <AlertCircle className={`w-4 h-4 ${
                task.priority === 'urgent' ? 'text-red-600' : 
                task.priority === 'high' ? 'text-yellow-600' : 
                task.priority === 'medium' ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-900">Housekeeping</p>
              <p className="text-sm text-secondary-600">Room {task.room_id} - {task.type}</p>
            </div>
            <div className="text-sm text-secondary-500">
              {task.priority === 'urgent' ? 'Urgent' : 
               task.priority === 'high' ? 'High' : 
               task.priority === 'medium' ? 'Medium' : 'Low'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


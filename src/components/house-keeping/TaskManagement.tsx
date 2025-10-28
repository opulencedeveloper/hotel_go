'use client';

import { useState } from 'react';
import { 
  Settings, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle 
} from 'lucide-react';
import { Task } from '@/types';

interface TaskManagementProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onTaskSelect: (task: Task) => void;
  isClient: boolean;
}

export default function TaskManagement({ 
  tasks, 
  onStatusChange, 
  onTaskSelect, 
  isClient 
}: TaskManagementProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">All Tasks</h3>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Settings className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-secondary-900">{task.title}</h4>
                <p className="text-xs text-secondary-600">{task.description}</p>
                <p className="text-xs text-secondary-500">
                  Assigned to: {task.staff?.firstName} {task.staff?.lastName} • 
                  Due: {isClient ? new Date(task.dueDate).toLocaleDateString() : '--/--/----'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => onTaskSelect(task)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTaskSelect(task)}
                  className="text-secondary-600 hover:text-secondary-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {task.status === 'pending' && (
                  <button
                    onClick={() => onStatusChange(task.id, 'in-progress')}
                    className="text-blue-600 hover:text-blue-700 text-xs"
                  >
                    Start
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <button
                    onClick={() => onStatusChange(task.id, 'completed')}
                    className="text-green-600 hover:text-green-700 text-xs"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





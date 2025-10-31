'use client';

import { X, Clock, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Task } from '@/types';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  isClient: boolean;
}

export default function TaskDetailsModal({ task, isOpen, onClose, isClient }: TaskDetailsModalProps) {
  if (!isOpen || !task) return null;

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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Task Details</h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-secondary-900">Task Information</h4>
              <p className="text-sm text-secondary-600">{task.title}</p>
              <p className="text-sm text-secondary-600">{task.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900">Assignment</h4>
              <p className="text-sm text-secondary-600">
                Assigned to: {task.staff?.firstName} {task.staff?.lastName}
              </p>
              <p className="text-sm text-secondary-600">Department: {task.department}</p>
              <p className="text-sm text-secondary-600">
                Due: {isClient ? new Date(task.dueDate).toLocaleString() : '--/--/---- --:--:--'}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-secondary-900">Status & Priority</h4>
            <div className="flex space-x-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
          <button className="btn-primary">
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
}







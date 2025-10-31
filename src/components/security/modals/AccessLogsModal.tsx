'use client';

import { useState } from 'react';
import { X, Key } from 'lucide-react';
import { Staff } from '@/store/redux/staff-slice';

interface AccessLogsModalProps {
  isOpen: boolean;
  users: Staff[];
  securityEventsCount: number;
  criticalEventsCount: number;
  activeUsersCount: number;
  suspendedUsersCount: number;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export default function AccessLogsModal({
  isOpen,
  users,
  securityEventsCount,
  criticalEventsCount,
  activeUsersCount,
  suspendedUsersCount,
  onClose,
  onSubmit,
}: AccessLogsModalProps) {
  const [formData, setFormData] = useState({
    dateRange: '24h',
    userFilter: 'all',
    actionFilter: 'all',
    severityFilter: 'all',
    includeDetails: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      dateRange: '24h',
      userFilter: 'all',
      actionFilter: 'all',
      severityFilter: 'all',
      includeDetails: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Access Logs</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Date Range *
              </label>
              <select
                required
                value={formData.dateRange}
                onChange={(e) => setFormData({...formData, dateRange: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                User Filter
              </label>
              <select
                value={formData.userFilter}
                onChange={(e) => setFormData({...formData, userFilter: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Users</option>
                {users.map(staff => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Action Filter
              </label>
              <select
                value={formData.actionFilter}
                onChange={(e) => setFormData({...formData, actionFilter: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="failed_login">Failed Login</option>
                <option value="password_change">Password Change</option>
                <option value="permission_change">Permission Change</option>
                <option value="data_access">Data Access</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Severity Filter
              </label>
              <select
                value={formData.severityFilter}
                onChange={(e) => setFormData({...formData, severityFilter: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includeDetails}
                  onChange={(e) => setFormData({...formData, includeDetails: e.target.checked})}
                  className="mr-3 rounded border-secondary-300"
                />
                <span className="text-sm text-secondary-700">Include detailed information</span>
              </label>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Log Information</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Total log entries: {securityEventsCount}</p>
              <p>• Last 24 hours: {criticalEventsCount} critical events</p>
              <p>• Active users: {activeUsersCount}</p>
              <p>• Suspended users: {suspendedUsersCount}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Key className="w-4 h-4 mr-2" />
              Generate Logs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

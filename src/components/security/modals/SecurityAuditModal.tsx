'use client';

import { useState } from 'react';
import { X, Eye } from 'lucide-react';

interface SecurityAuditModalProps {
  isOpen: boolean;
  criticalEventsCount: number;
  activeUsersCount: number;
  suspendedUsersCount: number;
  recentEventsCount: number;
  isClient: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export default function SecurityAuditModal({
  isOpen,
  criticalEventsCount,
  activeUsersCount,
  suspendedUsersCount,
  recentEventsCount,
  isClient,
  onClose,
  onSubmit,
}: SecurityAuditModalProps) {
  const [formData, setFormData] = useState({
    auditType: 'comprehensive',
    dateRange: '30d',
    includeUsers: true,
    includeAccess: true,
    includeEvents: true,
    generateReport: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      auditType: 'comprehensive',
      dateRange: '30d',
      includeUsers: true,
      includeAccess: true,
      includeEvents: true,
      generateReport: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Security Audit</h2>
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
                Audit Type *
              </label>
              <select
                required
                value={formData.auditType}
                onChange={(e) => setFormData({...formData, auditType: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="comprehensive">Comprehensive Audit</option>
                <option value="user_access">User Access Review</option>
                <option value="permissions">Permission Audit</option>
                <option value="security_events">Security Events Review</option>
                <option value="compliance">Compliance Check</option>
              </select>
            </div>
            
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
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-3">
                <h4 className="font-medium text-secondary-900">Audit Components</h4>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeUsers}
                    onChange={(e) => setFormData({...formData, includeUsers: e.target.checked})}
                    className="mr-3 rounded border-secondary-300"
                  />
                  <span className="text-sm text-secondary-700">Include User Management Audit</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeAccess}
                    onChange={(e) => setFormData({...formData, includeAccess: e.target.checked})}
                    className="mr-3 rounded border-secondary-300"
                  />
                  <span className="text-sm text-secondary-700">Include Access Control Review</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeEvents}
                    onChange={(e) => setFormData({...formData, includeEvents: e.target.checked})}
                    className="mr-3 rounded border-secondary-300"
                  />
                  <span className="text-sm text-secondary-700">Include Security Events Analysis</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.generateReport}
                    onChange={(e) => setFormData({...formData, generateReport: e.target.checked})}
                    className="mr-3 rounded border-secondary-300"
                  />
                  <span className="text-sm text-secondary-700">Generate Detailed Report</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Security Status</h4>
            <div className="text-sm text-red-800 space-y-1">
              {/* <p>• Critical events: {criticalEventsCount}</p> */}
              <p>• Active users: {activeUsersCount}</p>
              <p>• Suspended users: {suspendedUsersCount}</p>
              <p>• Recent security events: {recentEventsCount}</p>
              <p>• Last audit: {isClient ? new Date().toLocaleDateString() : '--/--/----'}</p>
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
              <Eye className="w-4 h-4 mr-2" />
              Run Security Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



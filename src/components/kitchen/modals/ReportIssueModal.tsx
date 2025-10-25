'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportIssueData) => void;
}

interface ReportIssueData {
  issue_type: string;
  priority: string;
  description: string;
  location: string;
  reported_by: string;
  estimated_fix_time: string;
  notes: string;
}

export default function ReportIssueModal({ isOpen, onClose, onSubmit }: ReportIssueModalProps) {
  const [reportIssue, setReportIssue] = useState<ReportIssueData>({
    issue_type: 'equipment',
    priority: 'medium',
    description: '',
    location: '',
    reported_by: '',
    estimated_fix_time: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reportIssue);
    setReportIssue({
      issue_type: 'equipment',
      priority: 'medium',
      description: '',
      location: '',
      reported_by: '',
      estimated_fix_time: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Report Issue</h2>
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
                Issue Type *
              </label>
              <select
                value={reportIssue.issue_type}
                onChange={(e) => setReportIssue({...reportIssue, issue_type: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="equipment">Equipment</option>
                <option value="safety">Safety</option>
                <option value="maintenance">Maintenance</option>
                <option value="supply">Supply Shortage</option>
                <option value="staff">Staff Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Priority *
              </label>
              <select
                value={reportIssue.priority}
                onChange={(e) => setReportIssue({...reportIssue, priority: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={reportIssue.location}
                onChange={(e) => setReportIssue({...reportIssue, location: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Kitchen Station 1, Oven #2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Reported By *
              </label>
              <input
                type="text"
                required
                value={reportIssue.reported_by}
                onChange={(e) => setReportIssue({...reportIssue, reported_by: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Estimated Fix Time
              </label>
              <input
                type="text"
                value={reportIssue.estimated_fix_time}
                onChange={(e) => setReportIssue({...reportIssue, estimated_fix_time: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2 hours, 1 day"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={reportIssue.description}
                onChange={(e) => setReportIssue({...reportIssue, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the issue in detail..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={reportIssue.notes}
                onChange={(e) => setReportIssue({...reportIssue, notes: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional information..."
              />
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
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

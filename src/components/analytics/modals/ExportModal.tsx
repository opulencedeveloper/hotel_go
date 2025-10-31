'use client';

import { X, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    reportType: string;
    format: string;
    includeDetails: boolean;
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ExportModal({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
}: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Export Analytics Report</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Report Type *
              </label>
              <select
                required
                value={formData.reportType}
                onChange={(e) => onFormChange('reportType', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="comprehensive">Comprehensive Report</option>
                <option value="revenue">Revenue Analysis</option>
                <option value="occupancy">Occupancy Report</option>
                <option value="guest">Guest Analytics</option>
                <option value="performance">Performance Metrics</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Export Format *
              </label>
              <select
                required
                value={formData.format}
                onChange={(e) => onFormChange('format', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pdf">PDF Document</option>
                <option value="csv">CSV Data</option>
                <option value="json">JSON Data</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeDetails}
                    onChange={(e) => onFormChange('includeDetails', e.target.checked)}
                    className="mr-3 rounded border-secondary-300"
                  />
                  <span className="text-sm text-secondary-700">Include Detailed Breakdowns</span>
                </label>
              </div>
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
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { Settings, X } from 'lucide-react';

// Use the Redux Facility interface
import { Facility } from '@/store/redux/facility-slice';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  maintenanceForm: {
    facility_id: string;
    maintenance_type: string;
    description: string;
    priority: string;
    scheduled_date: string;
    estimated_duration: number;
    assigned_staff: string;
    notes: string;
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MaintenanceModal({
  isOpen,
  onClose,
  facilities,
  maintenanceForm,
  onFormChange,
  onSubmit
}: MaintenanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Schedule Maintenance</h2>
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
                Facility *
              </label>
              <select
                required
                value={maintenanceForm.facility_id}
                onChange={(e) => onFormChange('facility_id', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Facility</option>
                      {facilities.map((facility) => (
                        <option key={facility._id} value={facility._id}>
                          {facility.facilityName}
                        </option>
                      ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Maintenance Type *
              </label>
              <select
                required
                value={maintenanceForm.maintenance_type}
                onChange={(e) => onFormChange('maintenance_type', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="routine">Routine</option>
                <option value="preventive">Preventive</option>
                <option value="emergency">Emergency</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Priority
              </label>
              <select
                value={maintenanceForm.priority}
                onChange={(e) => onFormChange('priority', e.target.value)}
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
                Scheduled Date *
              </label>
              <input
                type="date"
                required
                value={maintenanceForm.scheduled_date}
                onChange={(e) => onFormChange('scheduled_date', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={maintenanceForm.estimated_duration}
                onChange={(e) => onFormChange('estimated_duration', parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Assigned Staff
              </label>
              <input
                type="text"
                value={maintenanceForm.assigned_staff}
                onChange={(e) => onFormChange('assigned_staff', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Staff member name"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={maintenanceForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the maintenance work..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes
              </label>
              <textarea
                value={maintenanceForm.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional notes..."
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
              <Settings className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


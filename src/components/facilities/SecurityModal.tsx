'use client';

import { Shield, X } from 'lucide-react';

// Use the Redux Facility interface
import { Facility } from '@/store/redux/facility-slice';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  securityForm: {
    facility_id: string;
    security_level: string;
    access_restrictions: string;
    monitoring_status: string;
    emergency_contacts: string;
    security_notes: string;
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SecurityModal({
  isOpen,
  onClose,
  facilities,
  securityForm,
  onFormChange,
  onSubmit
}: SecurityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Facility Security Settings</h2>
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
                value={securityForm.facility_id}
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
                Security Level
              </label>
              <select
                value={securityForm.security_level}
                onChange={(e) => onFormChange('security_level', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="standard">Standard</option>
                <option value="enhanced">Enhanced</option>
                <option value="high">High</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Monitoring Status
              </label>
              <select
                value={securityForm.monitoring_status}
                onChange={(e) => onFormChange('monitoring_status', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="scheduled">Scheduled</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Access Restrictions
              </label>
              <textarea
                value={securityForm.access_restrictions}
                onChange={(e) => onFormChange('access_restrictions', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe access restrictions..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Emergency Contacts
              </label>
              <textarea
                value={securityForm.emergency_contacts}
                onChange={(e) => onFormChange('emergency_contacts', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Emergency contact information..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Security Notes
              </label>
              <textarea
                value={securityForm.security_notes}
                onChange={(e) => onFormChange('security_notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional security notes..."
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
              <Shield className="w-4 h-4 mr-2" />
              Update Security
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


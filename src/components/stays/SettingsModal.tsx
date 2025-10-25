'use client';

import { Settings, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingsForm: {
    default_duration: number;
    max_advance_booking: number;
    cancellation_policy: string;
    auto_confirm: boolean;
    require_deposit: boolean;
    deposit_percentage: number;
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settingsForm, 
  onFormChange, 
  onSubmit 
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Service Settings</h2>
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
                Default Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={settingsForm.default_duration}
                onChange={(e) => onFormChange('default_duration', parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Max Advance Booking (days)
              </label>
              <input
                type="number"
                min="1"
                value={settingsForm.max_advance_booking}
                onChange={(e) => onFormChange('max_advance_booking', parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Cancellation Policy
              </label>
              <select
                value={settingsForm.cancellation_policy}
                onChange={(e) => onFormChange('cancellation_policy', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="24 hours">24 hours</option>
                <option value="48 hours">48 hours</option>
                <option value="72 hours">72 hours</option>
                <option value="7 days">7 days</option>
                <option value="14 days">14 days</option>
                <option value="non-refundable">Non-refundable</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Deposit Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settingsForm.deposit_percentage}
                onChange={(e) => onFormChange('deposit_percentage', parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settingsForm.auto_confirm}
                    onChange={(e) => onFormChange('auto_confirm', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-secondary-700">Auto-confirm bookings</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settingsForm.require_deposit}
                    onChange={(e) => onFormChange('require_deposit', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-secondary-700">Require deposit for bookings</span>
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
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}





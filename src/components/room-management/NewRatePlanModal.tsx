'use client';

import { X, Plus } from "lucide-react";

interface NewRatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRatePlanForm: {
    name: string;
    code: string;
    description: string;
    status: string;
    rates: {
      [key: string]: number;
    };
    rules: {
      min_los: number;
      max_los: number;
      advance_booking_days: number;
      cancellation_policy: string;
    };
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function NewRatePlanModal({ 
  isOpen, 
  onClose, 
  newRatePlanForm, 
  onFormChange, 
  onSubmit 
}: NewRatePlanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            Add New Rate Plan
          </h2>
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
                Rate Plan Name *
              </label>
              <input
                type="text"
                required
                value={newRatePlanForm.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Standard Rate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Rate Code *
              </label>
              <input
                type="text"
                required
                value={newRatePlanForm.code}
                onChange={(e) => onFormChange('code', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., STD"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description
              </label>
              <textarea
                value={newRatePlanForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe this rate plan..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Status
              </label>
              <select
                value={newRatePlanForm.status}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Base Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newRatePlanForm.rates["2024-01-01"]}
                onChange={(e) => onFormChange('rates', {
                  "2024-01-01": parseFloat(e.target.value) || 0,
                })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="150.00"
              />
            </div>
          </div>

          <div className="border-t border-secondary-200 pt-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Rate Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Minimum Length of Stay
                </label>
                <input
                  type="number"
                  min="1"
                  value={newRatePlanForm.rules.min_los}
                  onChange={(e) => onFormChange('rules', {
                    ...newRatePlanForm.rules,
                    min_los: parseInt(e.target.value) || 1,
                  })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Maximum Length of Stay
                </label>
                <input
                  type="number"
                  min="1"
                  value={newRatePlanForm.rules.max_los}
                  onChange={(e) => onFormChange('rules', {
                    ...newRatePlanForm.rules,
                    max_los: parseInt(e.target.value) || 30,
                  })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Advance Booking Days
                </label>
                <input
                  type="number"
                  min="0"
                  value={newRatePlanForm.rules.advance_booking_days}
                  onChange={(e) => onFormChange('rules', {
                    ...newRatePlanForm.rules,
                    advance_booking_days: parseInt(e.target.value) || 0,
                  })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Cancellation Policy
                </label>
                <select
                  value={newRatePlanForm.rules.cancellation_policy}
                  onChange={(e) => onFormChange('rules', {
                    ...newRatePlanForm.rules,
                    cancellation_policy: e.target.value,
                  })}
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
            <button type="submit" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Rate Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}








'use client';

import { useState } from 'react';
import { X, Users } from 'lucide-react';

interface StaffScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StaffScheduleData) => void;
}

interface StaffScheduleData {
  staff_name: string;
  position: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  notes: string;
}

export default function StaffScheduleModal({ isOpen, onClose, onSubmit }: StaffScheduleModalProps) {
  const [staffSchedule, setStaffSchedule] = useState<StaffScheduleData>({
    staff_name: '',
    position: 'chef',
    shift_date: '',
    start_time: '',
    end_time: '',
    break_duration: 30,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(staffSchedule);
    setStaffSchedule({
      staff_name: '',
      position: 'chef',
      shift_date: '',
      start_time: '',
      end_time: '',
      break_duration: 30,
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Staff Schedule</h2>
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
                Staff Name *
              </label>
              <input
                type="text"
                required
                value={staffSchedule.staff_name}
                onChange={(e) => setStaffSchedule({...staffSchedule, staff_name: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter staff name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Position *
              </label>
              <select
                value={staffSchedule.position}
                onChange={(e) => setStaffSchedule({...staffSchedule, position: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="chef">Head Chef</option>
                <option value="sous_chef">Sous Chef</option>
                <option value="line_cook">Line Cook</option>
                <option value="prep_cook">Prep Cook</option>
                <option value="dishwasher">Dishwasher</option>
                <option value="kitchen_manager">Kitchen Manager</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Shift Date *
              </label>
              <input
                type="date"
                required
                value={staffSchedule.shift_date}
                onChange={(e) => setStaffSchedule({...staffSchedule, shift_date: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={staffSchedule.start_time}
                onChange={(e) => setStaffSchedule({...staffSchedule, start_time: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                required
                value={staffSchedule.end_time}
                onChange={(e) => setStaffSchedule({...staffSchedule, end_time: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={staffSchedule.break_duration}
                onChange={(e) => setStaffSchedule({...staffSchedule, break_duration: parseInt(e.target.value) || 30})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes
              </label>
              <textarea
                value={staffSchedule.notes}
                onChange={(e) => setStaffSchedule({...staffSchedule, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional notes about the shift..."
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
              <Users className="w-4 h-4 mr-2" />
              Schedule Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

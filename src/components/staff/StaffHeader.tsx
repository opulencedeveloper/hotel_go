'use client';

import { Plus } from 'lucide-react';

interface StaffHeaderProps {
  onAddStaff: () => void;
}

export default function StaffHeader({ onAddStaff }: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Staff Management</h1>
        <p className="text-secondary-600">Manage your team members, roles, and schedules</p>
      </div>
      <button 
        onClick={onAddStaff}
        className="btn-primary mt-4 sm:mt-0"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Staff
      </button>
    </div>
  );
}
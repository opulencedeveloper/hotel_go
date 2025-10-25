'use client';

import { Staff } from '@/types';

interface StaffStatsProps {
  staff: Staff[];
}

export default function StaffStats({ staff }: StaffStatsProps) {
  const staffStats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
    managers: staff.filter(s => s.role === 'manager').length,
    receptionists: staff.filter(s => s.role === 'receptionist').length,
    housekeeping: staff.filter(s => s.role === 'housekeeping').length,
    kitchen: staff.filter(s => s.role === 'kitchen').length,
    maintenance: staff.filter(s => s.role === 'maintenance').length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="card text-center">
        <div className="text-2xl font-bold text-secondary-900">{staffStats.total}</div>
        <div className="text-sm text-secondary-600">Total Staff</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-green-600">{staffStats.active}</div>
        <div className="text-sm text-secondary-600">Active</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-red-600">{staffStats.inactive}</div>
        <div className="text-sm text-secondary-600">Inactive</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-primary-600">
          ${staff.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
        </div>
        <div className="text-sm text-secondary-600">Total Payroll</div>
      </div>
    </div>
  );
}
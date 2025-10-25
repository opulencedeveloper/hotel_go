'use client';

import { Staff as ReduxStaff } from '@/store/redux/staff-slice';
import { StaffRole, StaffStatus } from '@/utils/enum';

interface DepartmentOverviewProps {
  staff: ReduxStaff[];
}

export default function DepartmentOverview({ staff }: DepartmentOverviewProps) {
  // Helper function to get status breakdown for a specific role
  const getStatusBreakdown = (role: StaffRole) => {
    const roleStaff = staff.filter(s => s.userRole === role);
    return {
      active: roleStaff.filter(s => s.status === StaffStatus.ACTIVE).length,
      inactive: roleStaff.filter(s => s.status === StaffStatus.INACTIVE).length,
      onLeave: roleStaff.filter(s => s.status === StaffStatus.ON_LEAVE).length,
      terminated: roleStaff.filter(s => s.status === StaffStatus.TERMINATED).length,
      suspended: roleStaff.filter(s => s.status === StaffStatus.SUSPENDED).length,
      pending: roleStaff.filter(s => s.status === StaffStatus.PENDING).length,
      total: roleStaff.length
    };
  };

  const departments = [
    { 
      name: 'Management', 
      role: StaffRole.Manager, 
      color: 'bg-purple-100 text-purple-800',
      breakdown: getStatusBreakdown(StaffRole.Manager)
    },
    { 
      name: 'Front Desk', 
      role: StaffRole.FrontDesk, 
      color: 'bg-blue-100 text-blue-800',
      breakdown: getStatusBreakdown(StaffRole.FrontDesk)
    },
    { 
      name: 'Housekeeping', 
      role: StaffRole.HouseKeeping, 
      color: 'bg-green-100 text-green-800',
      breakdown: getStatusBreakdown(StaffRole.HouseKeeping)
    },
    { 
      name: 'Kitchen', 
      role: StaffRole.Kitchen, 
      color: 'bg-orange-100 text-orange-800',
      breakdown: getStatusBreakdown(StaffRole.Kitchen)
    },
    { 
      name: 'Maintenance', 
      role: StaffRole.Maintenance, 
      color: 'bg-yellow-100 text-yellow-800',
      breakdown: getStatusBreakdown(StaffRole.Maintenance)
    },
    { 
      name: 'Accounting', 
      role: StaffRole.Accounting, 
      color: 'bg-indigo-100 text-indigo-800',
      breakdown: getStatusBreakdown(StaffRole.Accounting)
    },
    { 
      name: 'Security', 
      role: StaffRole.Security, 
      color: 'bg-red-100 text-red-800',
      breakdown: getStatusBreakdown(StaffRole.Security)
    },
    { 
      name: 'Guest Services', 
      role: StaffRole.GuestServices, 
      color: 'bg-pink-100 text-pink-800',
      breakdown: getStatusBreakdown(StaffRole.GuestServices)
    }
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">Department Overview with Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {departments.map((dept, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dept.color} mb-2`}>
                {dept.name}
              </div>
              <div className="text-2xl font-bold text-secondary-900">{dept.breakdown.total}</div>
              <div className="text-sm text-secondary-600">total members</div>
            </div>
            
            <div className="space-y-2">
              {dept.breakdown.active > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600">Active</span>
                  <span className="font-medium">{dept.breakdown.active}</span>
                </div>
              )}
              {dept.breakdown.inactive > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-red-600">Inactive</span>
                  <span className="font-medium">{dept.breakdown.inactive}</span>
                </div>
              )}
              {dept.breakdown.onLeave > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-yellow-600">On Leave</span>
                  <span className="font-medium">{dept.breakdown.onLeave}</span>
                </div>
              )}
              {dept.breakdown.terminated > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Terminated</span>
                  <span className="font-medium">{dept.breakdown.terminated}</span>
                </div>
              )}
              {dept.breakdown.suspended > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-orange-600">Suspended</span>
                  <span className="font-medium">{dept.breakdown.suspended}</span>
                </div>
              )}
              {dept.breakdown.pending > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600">Pending</span>
                  <span className="font-medium">{dept.breakdown.pending}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

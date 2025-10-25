'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/redux';
import { Staff as ReduxStaff } from '@/store/redux/staff-slice';
import { Staff } from '@/types';
import { StaffRole, StaffShift, StaffStatus } from '@/utils/enum';
import { useState } from 'react';
import StaffHeader from './StaffHeader';
import StaffStats from './StaffStats';
import DepartmentOverview from './DepartmentOverview';
import StaffFilters from './StaffFilters';
import StaffTable from './StaffTable';
import NewStaffModal from './modals/NewStaffModal';
import StaffDetailsModal from './modals/StaffDetailsModal';
import EditStaffModal from './modals/EditStaffModal';

// Helper function to convert Redux Staff to expected Staff type
const mapReduxStaffToStaff = (reduxStaff: ReduxStaff[]): Staff[] => {
  return reduxStaff.map(staff => ({
    id: staff._id,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phone: staff.phoneNumber,
    role: mapStaffRole(staff.userRole),
    department: staff.userRole, // Use userRole as department for now
    salary: staff.salary,
    hireDate: staff.createdAt,
    status: mapStaffStatus(staff.status),
    shift: mapStaffShift(staff.shift)
  }));
};

// Helper function to map Redux role to expected role format
const mapStaffRole = (userRole: StaffRole): 'manager' | 'receptionist' | 'housekeeping' | 'kitchen' | 'maintenance' | 'admin' | 'accounting' | 'security' | 'guest_services' => {
  switch (userRole) {
    case StaffRole.Manager:
      return 'manager';
    case StaffRole.FrontDesk:
      return 'receptionist';
    case StaffRole.HouseKeeping:
      return 'housekeeping';
    case StaffRole.Kitchen:
      return 'kitchen';
    case StaffRole.Maintenance:
      return 'maintenance';
    case StaffRole.Accounting:
      return 'accounting';
    case StaffRole.Security:
      return 'security';
    case StaffRole.GuestServices:
      return 'guest_services';
    default:
      return 'admin';
  }
};

// Helper function to map Redux shift to expected shift format
const mapStaffShift = (shift: string): 'morning' | 'afternoon' | 'night' => {
  switch (shift.toLowerCase()) {
    case StaffShift.MORNING:
      return 'morning';
    case StaffShift.AFTERNOON:
      return 'afternoon';
    case StaffShift.NIGHT:
      return 'night';
    default:
      return 'morning';
  }
};

// Helper function to map Redux status to expected status format
const mapStaffStatus = (status: string): 'active' | 'inactive' => {
  switch (status) {
    case StaffStatus.ACTIVE:
      return 'active';
    case StaffStatus.INACTIVE:
    case StaffStatus.ON_LEAVE:
    case StaffStatus.TERMINATED:
    case StaffStatus.SUSPENDED:
    case StaffStatus.PENDING:
    default:
      return 'inactive';
  }
};

export default function StaffBody() {
  // Get staff data from Redux state
  const staff = useSelector((state: RootState) => state.staff);
  const { staffs } = staff;

  // Convert Redux staff to expected format
  const mappedStaff = mapReduxStaffToStaff(staffs);

  // Local state for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewStaff, setShowNewStaff] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<ReduxStaff | null>(null);

  // Filter staff based on search and filters
  const filteredStaff = mappedStaff.filter((employee: Staff) => {
    const matchesSearch = employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = (staffId: string) => {
    // This would dispatch an action to update the staff status in Redux
    console.log('Toggle status for staff:', staffId);
    // TODO: Implement Redux action dispatch for status toggle
  };

  const handleViewStaff = (staff: Staff) => {
    // Find the original Redux staff data
    const reduxStaff = staffs.find(s => s._id === staff.id);
    setSelectedStaff(reduxStaff || null);
  };

  const handleEditStaff = (staff: Staff | ReduxStaff) => {
    // If it's already ReduxStaff, use it directly
    if ('_id' in staff) {
      setSelectedStaff(staff);
    } else {
      // Find the original Redux staff data
      const reduxStaff = staffs.find(s => s._id === staff.id);
      setSelectedStaff(reduxStaff || null);
    }
    setShowEditStaff(true);
  };

  const handleEditSuccess = () => {
    // Refresh staff data or show success message
    console.log('Staff updated successfully');
    // TODO: Implement Redux action to refresh staff data
  };

  const handleCloseEditModal = () => {
    setShowEditStaff(false);
    setSelectedStaff(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <StaffHeader onAddStaff={() => setShowNewStaff(true)} />

      {/* Staff Stats */}
      <StaffStats staff={mappedStaff} />

      {/* Department Overview */}
      <DepartmentOverview staff={staffs} />

      {/* Filters */}
      <StaffFilters
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Staff Table */}
      <StaffTable
        staff={filteredStaff}
        onViewStaff={handleViewStaff}
        onEditStaff={handleEditStaff}
        onToggleStatus={handleStatusToggle}
      />

      {/* Modals */}
      <NewStaffModal
        isOpen={showNewStaff}
        onClose={() => setShowNewStaff(false)}
      />

      <StaffDetailsModal
        isOpen={!!selectedStaff && !showEditStaff}
        staff={selectedStaff}
        onClose={() => setSelectedStaff(null)}
        onEdit={() => selectedStaff && handleEditStaff(selectedStaff)}
      />

      <EditStaffModal
        isOpen={showEditStaff}
        staff={selectedStaff}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

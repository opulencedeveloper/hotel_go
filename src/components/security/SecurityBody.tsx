'use client';

import { mockSecurityEvents } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Staff } from '@/store/redux/staff-slice';

// Import the new components
import SecurityHeader from './SecurityHeader';
import SecurityOverviewCards from './SecurityOverviewCards';
import SecurityAlerts from './SecurityAlerts';
import UserManagement from './UserManagement';
import SecurityEvents from './SecurityEvents';
import UserRoles from './UserRoles';
import ManageUsersModal from './modals/ManageUsersModal';
import AccessLogsModal from './modals/AccessLogsModal';
import SecurityAuditModal from './modals/SecurityAuditModal';
import AddUserModal from './modals/AddUserModal';
import { StaffStatus } from '@/utils/enum';

export default function SecurityBody() {
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isClient, setIsClient] = useState(false);
  const [showManageUsersModal, setShowManageUsersModal] = useState(false);
  const [showAccessLogsModal, setShowAccessLogsModal] = useState(false);
  const [showSecurityAuditModal, setShowSecurityAuditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Get staff data from Redux
  const staff = useSelector((state: RootState) => state.staff);
  const { staffs } = staff;

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Filter staff members who have passwords
  const staffWithPasswords = staffs.filter((staff: Staff) => staff.hasPassword === true);
  
  const activeUsers = staffWithPasswords.filter((staff: Staff) => staff.status === StaffStatus.ACTIVE);
  const suspendedUsers = staffWithPasswords.filter((staff: Staff) => staff.status === StaffStatus.SUSPENDED);
  const inactiveUsers = staffWithPasswords.filter((staff: Staff) => staff.status === StaffStatus.INACTIVE);
  const onLeaveUsers = staffWithPasswords.filter((staff: Staff) => staff.status === StaffStatus.ON_LEAVE);
  const terminatedUsers = staffWithPasswords.filter((staff: Staff) => staff.status === StaffStatus.TERMINATED);
  const pendingUsers = staffWithPasswords.filter((staff: Staff) => staff.status === StaffStatus.PENDING);
  
  const recentEvents = mockSecurityEvents.slice(0, 10);
  const criticalEvents = mockSecurityEvents.filter(event => event.severity === 'critical' || event.severity === 'high');

  const filteredUsers = selectedRole === 'all' 
    ? staffWithPasswords 
    : staffWithPasswords.filter((staff: Staff) => staff.userRole === selectedRole);

  const filteredEvents = selectedSeverity === 'all'
    ? recentEvents
    : recentEvents.filter(event => event.severity === selectedSeverity);

  // Form handlers
  const handleManageUsersSubmit = (formData: any) => {
    console.log('Managing users:', formData);
  };

  const handleAccessLogsSubmit = (formData: any) => {
    console.log('Access logs request:', formData);
  };

  const handleSecurityAuditSubmit = (formData: any) => {
    console.log('Security audit request:', formData);
  };

  const handleAddUserSubmit = (formData: any) => {
    console.log('Adding new user:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SecurityHeader
        activeUsers={activeUsers.length}
        criticalEvents={criticalEvents.length}
        onManageUsers={() => setShowManageUsersModal(true)}
        onAccessLogs={() => setShowAccessLogsModal(true)}
        onSecurityAudit={() => setShowSecurityAuditModal(true)}
      />

      {/* Security Overview Cards */}
      <SecurityOverviewCards
        activeUsers={activeUsers.length}
        suspendedUsers={suspendedUsers.length}
        inactiveUsers={inactiveUsers.length}
        onLeaveUsers={onLeaveUsers.length}
        terminatedUsers={terminatedUsers.length}
        pendingUsers={pendingUsers.length}
        recentEvents={recentEvents.length}
        criticalEvents={criticalEvents.length}
      />

      {/* Critical Security Alerts */}
      <SecurityAlerts
        criticalEvents={criticalEvents}
        isClient={isClient}
      />

      {/* User Management */}
      <UserManagement
        users={filteredUsers}
        selectedRole={selectedRole}
        isClient={isClient}
        onRoleFilterChange={setSelectedRole}
        onAddUser={() => setShowAddUserModal(true)}
      />

      {/* Modals */}
      <ManageUsersModal
        isOpen={showManageUsersModal}
        onClose={() => setShowManageUsersModal(false)}
        onSubmit={handleManageUsersSubmit}
      />

      <AccessLogsModal
        isOpen={showAccessLogsModal}
        users={staffWithPasswords}
        securityEventsCount={mockSecurityEvents.length}
        criticalEventsCount={mockSecurityEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length}
        activeUsersCount={activeUsers.length}
        suspendedUsersCount={suspendedUsers.length}
        onClose={() => setShowAccessLogsModal(false)}
        onSubmit={handleAccessLogsSubmit}
      />

      <SecurityAuditModal
        isOpen={showSecurityAuditModal}
        criticalEventsCount={criticalEvents.length}
        activeUsersCount={activeUsers.length}
        suspendedUsersCount={suspendedUsers.length}
        recentEventsCount={recentEvents.length}
        isClient={isClient}
        onClose={() => setShowSecurityAuditModal(false)}
        onSubmit={handleSecurityAuditSubmit}
      />

      <AddUserModal
        isOpen={showAddUserModal}
        roles={[]}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUserSubmit}
      />
    </div>
  );
}

'use client';

import Layout from '@/components/Layout';
import { Lock, Shield, Users, Key, Eye, AlertTriangle, CheckCircle, Clock, Plus, Edit, Trash2, UserCheck, UserX, X } from 'lucide-react';
import { mockUsers, mockRoles, mockSecurityEvents } from '@/data/mockData';
import { useState, useEffect } from 'react';

export default function SecurityPage() {
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isClient, setIsClient] = useState(false);
  const [showManageUsersModal, setShowManageUsersModal] = useState(false);
  const [showAccessLogsModal, setShowAccessLogsModal] = useState(false);
  const [showSecurityAuditModal, setShowSecurityAuditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Form states
  const [manageUsersForm, setManageUsersForm] = useState({
    action: 'view',
    userId: '',
    role: '',
    status: 'active',
    permissions: [] as string[],
    reason: ''
  });

  const [accessLogsForm, setAccessLogsForm] = useState({
    dateRange: '24h',
    userFilter: 'all',
    actionFilter: 'all',
    severityFilter: 'all',
    includeDetails: true
  });

  const [securityAuditForm, setSecurityAuditForm] = useState({
    auditType: 'comprehensive',
    dateRange: '30d',
    includeUsers: true,
    includeAccess: true,
    includeEvents: true,
    generateReport: true
  });

  const [addUserForm, setAddUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active',
    permissions: [] as string[],
    notes: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const activeUsers = mockUsers.filter(user => user.status === 'active');
  const suspendedUsers = mockUsers.filter(user => user.status === 'suspended');
  const recentEvents = mockSecurityEvents.slice(0, 10);
  const criticalEvents = mockSecurityEvents.filter(event => event.severity === 'critical' || event.severity === 'high');

  const filteredUsers = selectedRole === 'all' 
    ? mockUsers 
    : mockUsers.filter(user => user.role_id === selectedRole);

  const filteredEvents = selectedSeverity === 'all'
    ? recentEvents
    : recentEvents.filter(event => event.severity === selectedSeverity);

  // Form handlers
  const handleManageUsersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Managing users:', manageUsersForm);
    setShowManageUsersModal(false);
    // Reset form
    setManageUsersForm({
      action: 'view',
      userId: '',
      role: '',
      status: 'active',
      permissions: [] as string[],
      reason: ''
    });
  };

  const handleAccessLogsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Access logs request:', accessLogsForm);
    setShowAccessLogsModal(false);
    // Reset form
    setAccessLogsForm({
      dateRange: '24h',
      userFilter: 'all',
      actionFilter: 'all',
      severityFilter: 'all',
      includeDetails: true
    });
  };

  const handleSecurityAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Security audit request:', securityAuditForm);
    setShowSecurityAuditModal(false);
    // Reset form
    setSecurityAuditForm({
      auditType: 'comprehensive',
      dateRange: '30d',
      includeUsers: true,
      includeAccess: true,
      includeEvents: true,
      generateReport: true
    });
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new user:', addUserForm);
    setShowAddUserModal(false);
    // Reset form
    setAddUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      status: 'active',
      permissions: [] as string[],
      notes: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Security & Access Control</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">User Permissions & Security</span>
                </div>
              </div>
              
              <p className="text-red-100 text-lg mb-6">
                Manage user access, permissions, and security settings to protect your hotel data and operations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-red-100">Security Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-red-200">Active Users:</span>
                  <span className="font-medium">{activeUsers.length}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-red-200">Critical Events:</span>
                  <span className="font-medium">{criticalEvents.length}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowManageUsersModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Users</span>
                </button>
                <button 
                  onClick={() => setShowAccessLogsModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Key className="w-4 h-4" />
                  <span>Access Logs</span>
                </button>
                <button 
                  onClick={() => setShowSecurityAuditModal(true)}
                  className="bg-white text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Eye className="w-4 h-4" />
                  <span>Security Audit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Active Users</p>
                <p className="text-2xl font-bold text-secondary-900">{activeUsers.length}</p>
                <p className="text-sm text-green-600">All systems secure</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Suspended Users</p>
                <p className="text-2xl font-bold text-secondary-900">{suspendedUsers.length}</p>
                <p className="text-sm text-orange-600">Requires review</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <UserX className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Security Events</p>
                <p className="text-2xl font-bold text-secondary-900">{recentEvents.length}</p>
                <p className="text-sm text-blue-600">Last 24 hours</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-secondary-900">{criticalEvents.length}</p>
                <p className="text-sm text-red-600">Immediate attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Critical Security Alerts */}
        {criticalEvents.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">Critical Security Alerts</h2>
            </div>
            <div className="space-y-3">
              {criticalEvents.slice(0, 3).map((event) => (
                <div key={event.event_id} className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-secondary-900">{event.description}</h3>
                      <p className="text-sm text-secondary-600">
                        {event.event_type} • {event.ip_address} • {isClient ? new Date(event.timestamp).toLocaleString() : '--/--/---- --:--:--'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">User Management</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="role_001">Property Manager</option>
                  <option value="role_002">Receptionist</option>
                  <option value="role_003">Housekeeping</option>
                </select>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">User</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">2FA</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-secondary-600">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-secondary-600">{user.role_id}</td>
                      <td className="py-3 px-4 text-secondary-600">{user.department}</td>
                      <td className="py-3 px-4 text-secondary-600">
                        {isClient ? new Date(user.last_login).toLocaleDateString() : '--/--/----'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.two_factor_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="Edit User">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-400 hover:text-red-600" title="Suspend User">
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Security Events & Roles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Security Events */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary-900">Recent Security Events</h2>
                <select 
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.event_id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-secondary-900">{event.description}</h3>
                        <p className="text-sm text-secondary-600">
                          {event.event_type} • {event.ip_address}
                        </p>
                        <p className="text-sm text-secondary-500">
                          {isClient ? new Date(event.timestamp).toLocaleString() : '--/--/---- --:--:--'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {event.severity}
                        </span>
                        <p className="text-xs text-secondary-500 mt-1">
                          {event.resolved ? 'Resolved' : 'Open'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Roles */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">User Roles</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockRoles.map((role) => (
                  <div key={role.role_id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{role.name}</h3>
                        <p className="text-sm text-secondary-600">{role.description}</p>
                        <p className="text-sm text-secondary-500">
                          {role.permissions.length} permissions
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          role.is_system_role ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {role.is_system_role ? 'System' : 'Custom'}
                        </span>
                        <div className="flex items-center space-x-2 mt-2">
                          <button className="p-1 text-secondary-400 hover:text-secondary-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Manage Users Modal */}
        {showManageUsersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Manage Users</h2>
                <button
                  onClick={() => setShowManageUsersModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleManageUsersSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Action *
                    </label>
                    <select
                      required
                      value={manageUsersForm.action}
                      onChange={(e) => setManageUsersForm({...manageUsersForm, action: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="view">View User Details</option>
                      <option value="edit">Edit User</option>
                      <option value="suspend">Suspend User</option>
                      <option value="activate">Activate User</option>
                      <option value="delete">Delete User</option>
                      <option value="reset">Reset Password</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Select User *
                    </label>
                    <select
                      required
                      value={manageUsersForm.userId}
                      onChange={(e) => setManageUsersForm({...manageUsersForm, userId: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a user</option>
                      {mockUsers.map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.first_name} {user.last_name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Role
                    </label>
                    <select
                      value={manageUsersForm.role}
                      onChange={(e) => setManageUsersForm({...manageUsersForm, role: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select role</option>
                      {mockRoles.map(role => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status
                    </label>
                    <select
                      value={manageUsersForm.status}
                      onChange={(e) => setManageUsersForm({...manageUsersForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Permissions
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['dashboard', 'reservations', 'rooms', 'guests', 'reports', 'settings', 'admin', 'security'].map(permission => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={manageUsersForm.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setManageUsersForm({
                                  ...manageUsersForm,
                                  permissions: [...manageUsersForm.permissions, permission]
                                });
                              } else {
                                setManageUsersForm({
                                  ...manageUsersForm,
                                  permissions: manageUsersForm.permissions.filter(p => p !== permission)
                                });
                              }
                            }}
                            className="mr-2 rounded border-secondary-300"
                          />
                          <span className="text-sm text-secondary-700 capitalize">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Reason (for suspension/deletion)
                    </label>
                    <textarea
                      value={manageUsersForm.reason}
                      onChange={(e) => setManageUsersForm({...manageUsersForm, reason: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter reason for action..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowManageUsersModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Execute Action
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Access Logs Modal */}
        {showAccessLogsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Access Logs</h2>
                <button
                  onClick={() => setShowAccessLogsModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAccessLogsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date Range *
                    </label>
                    <select
                      required
                      value={accessLogsForm.dateRange}
                      onChange={(e) => setAccessLogsForm({...accessLogsForm, dateRange: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="1h">Last Hour</option>
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      User Filter
                    </label>
                    <select
                      value={accessLogsForm.userFilter}
                      onChange={(e) => setAccessLogsForm({...accessLogsForm, userFilter: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Users</option>
                      {mockUsers.map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.first_name} {user.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Action Filter
                    </label>
                    <select
                      value={accessLogsForm.actionFilter}
                      onChange={(e) => setAccessLogsForm({...accessLogsForm, actionFilter: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Actions</option>
                      <option value="login">Login</option>
                      <option value="logout">Logout</option>
                      <option value="failed_login">Failed Login</option>
                      <option value="password_change">Password Change</option>
                      <option value="permission_change">Permission Change</option>
                      <option value="data_access">Data Access</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Severity Filter
                    </label>
                    <select
                      value={accessLogsForm.severityFilter}
                      onChange={(e) => setAccessLogsForm({...accessLogsForm, severityFilter: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Severities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={accessLogsForm.includeDetails}
                        onChange={(e) => setAccessLogsForm({...accessLogsForm, includeDetails: e.target.checked})}
                        className="mr-3 rounded border-secondary-300"
                      />
                      <span className="text-sm text-secondary-700">Include detailed information</span>
                    </label>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Log Information</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Total log entries: {mockSecurityEvents.length}</p>
                    <p>• Last 24 hours: {mockSecurityEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length} critical events</p>
                    <p>• Active users: {activeUsers.length}</p>
                    <p>• Suspended users: {suspendedUsers.length}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowAccessLogsModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Generate Logs
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Security Audit Modal */}
        {showSecurityAuditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Security Audit</h2>
                <button
                  onClick={() => setShowSecurityAuditModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSecurityAuditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Audit Type *
                    </label>
                    <select
                      required
                      value={securityAuditForm.auditType}
                      onChange={(e) => setSecurityAuditForm({...securityAuditForm, auditType: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="comprehensive">Comprehensive Audit</option>
                      <option value="user_access">User Access Review</option>
                      <option value="permissions">Permission Audit</option>
                      <option value="security_events">Security Events Review</option>
                      <option value="compliance">Compliance Check</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date Range *
                    </label>
                    <select
                      required
                      value={securityAuditForm.dateRange}
                      onChange={(e) => setSecurityAuditForm({...securityAuditForm, dateRange: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">Last Year</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="space-y-3">
                      <h4 className="font-medium text-secondary-900">Audit Components</h4>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securityAuditForm.includeUsers}
                          onChange={(e) => setSecurityAuditForm({...securityAuditForm, includeUsers: e.target.checked})}
                          className="mr-3 rounded border-secondary-300"
                        />
                        <span className="text-sm text-secondary-700">Include User Management Audit</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securityAuditForm.includeAccess}
                          onChange={(e) => setSecurityAuditForm({...securityAuditForm, includeAccess: e.target.checked})}
                          className="mr-3 rounded border-secondary-300"
                        />
                        <span className="text-sm text-secondary-700">Include Access Control Review</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securityAuditForm.includeEvents}
                          onChange={(e) => setSecurityAuditForm({...securityAuditForm, includeEvents: e.target.checked})}
                          className="mr-3 rounded border-secondary-300"
                        />
                        <span className="text-sm text-secondary-700">Include Security Events Analysis</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securityAuditForm.generateReport}
                          onChange={(e) => setSecurityAuditForm({...securityAuditForm, generateReport: e.target.checked})}
                          className="mr-3 rounded border-secondary-300"
                        />
                        <span className="text-sm text-secondary-700">Generate Detailed Report</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Security Status</h4>
                  <div className="text-sm text-red-800 space-y-1">
                    <p>• Critical events: {criticalEvents.length}</p>
                    <p>• Active users: {activeUsers.length}</p>
                    <p>• Suspended users: {suspendedUsers.length}</p>
                    <p>• Recent security events: {recentEvents.length}</p>
                    <p>• Last audit: {isClient ? new Date().toLocaleDateString() : '--/--/----'}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowSecurityAuditModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Run Security Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New User</h2>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddUserSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addUserForm.firstName}
                      onChange={(e) => setAddUserForm({...addUserForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addUserForm.lastName}
                      onChange={(e) => setAddUserForm({...addUserForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={addUserForm.email}
                      onChange={(e) => setAddUserForm({...addUserForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={addUserForm.phone}
                      onChange={(e) => setAddUserForm({...addUserForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Role *
                    </label>
                    <select
                      required
                      value={addUserForm.role}
                      onChange={(e) => setAddUserForm({...addUserForm, role: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select role</option>
                      {mockRoles.map(role => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Department
                    </label>
                    <select
                      value={addUserForm.department}
                      onChange={(e) => setAddUserForm({...addUserForm, department: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select department</option>
                      <option value="front-desk">Front Desk</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="food-beverage">Food & Beverage</option>
                      <option value="management">Management</option>
                      <option value="security">Security</option>
                      <option value="accounting">Accounting</option>
                      <option value="sales">Sales & Marketing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={addUserForm.status}
                      onChange={(e) => setAddUserForm({...addUserForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Permissions
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['dashboard', 'reservations', 'rooms', 'guests', 'reports', 'settings', 'admin', 'security'].map(permission => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={addUserForm.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAddUserForm({
                                  ...addUserForm,
                                  permissions: [...addUserForm.permissions, permission]
                                });
                              } else {
                                setAddUserForm({
                                  ...addUserForm,
                                  permissions: addUserForm.permissions.filter(p => p !== permission)
                                });
                              }
                            }}
                            className="mr-2 rounded border-secondary-300"
                          />
                          <span className="text-sm text-secondary-700 capitalize">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={addUserForm.notes}
                      onChange={(e) => setAddUserForm({...addUserForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes about the user..."
                    />
                  </div>
                </div>
                
                {/* User Preview */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-3">User Preview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-secondary-600">Name:</span>
                      <span className="font-medium text-secondary-900 ml-1">
                        {addUserForm.firstName} {addUserForm.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Email:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addUserForm.email || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Role:</span>
                      <span className="font-medium text-secondary-900 ml-1">
                        {addUserForm.role ? mockRoles.find(r => r.role_id === addUserForm.role)?.name || 'Unknown' : 'Not selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Status:</span>
                      <span className={`font-medium ml-1 capitalize ${
                        addUserForm.status === 'active' ? 'text-green-600' : 
                        addUserForm.status === 'suspended' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {addUserForm.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-secondary-600">Permissions:</span>
                    <span className="font-medium text-secondary-900 ml-1">
                      {addUserForm.permissions.length > 0 ? addUserForm.permissions.join(', ') : 'None selected'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

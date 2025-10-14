'use client';

import Layout from '@/components/Layout';
import { Lock, Shield, Users, Key, Eye, AlertTriangle, CheckCircle, Clock, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { mockUsers, mockRoles, mockSecurityEvents } from '@/data/mockData';
import { useState, useEffect } from 'react';

export default function SecurityPage() {
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isClient, setIsClient] = useState(false);

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
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Users className="w-4 h-4" />
                  <span>Manage Users</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Key className="w-4 h-4" />
                  <span>Access Logs</span>
                </button>
                <button className="bg-white text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
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
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
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
      </div>
    </Layout>
  );
}

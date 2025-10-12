'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  UserX,
  Settings,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockStaff } from '@/data/mockData';
import { Staff } from '@/types';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewStaff, setShowNewStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const filteredStaff = staff.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'receptionist': return 'bg-blue-100 text-blue-800';
      case 'housekeeping': return 'bg-green-100 text-green-800';
      case 'kitchen': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'night': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = (staffId: string) => {
    setStaff(prev => prev.map(emp => 
      emp.id === staffId ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' } : emp
    ));
  };

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

  const departments = [
    { name: 'Management', count: staffStats.managers, color: 'bg-purple-100 text-purple-800' },
    { name: 'Front Desk', count: staffStats.receptionists, color: 'bg-blue-100 text-blue-800' },
    { name: 'Housekeeping', count: staffStats.housekeeping, color: 'bg-green-100 text-green-800' },
    { name: 'Kitchen', count: staffStats.kitchen, color: 'bg-orange-100 text-orange-800' },
    { name: 'Maintenance', count: staffStats.maintenance, color: 'bg-yellow-100 text-yellow-800' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Staff Management</h1>
            <p className="text-secondary-600">Manage your team members, roles, and schedules</p>
          </div>
          <button 
            onClick={() => setShowNewStaff(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </button>
        </div>

        {/* Staff Stats */}
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

        {/* Department Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Department Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {departments.map((dept, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dept.color} mb-2`}>
                  {dept.name}
                </div>
                <div className="text-2xl font-bold text-secondary-900">{dept.count}</div>
                <div className="text-sm text-secondary-600">members</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Roles</option>
                <option value="manager">Manager</option>
                <option value="receptionist">Receptionist</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="kitchen">Kitchen</option>
                <option value="maintenance">Maintenance</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="btn-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredStaff.map((employee) => (
                  <tr key={employee.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShiftColor(employee.shift)}`}>
                        {employee.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      ${employee.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {employee.status === 'active' ? (
                          <UserCheck className="w-4 h-4 mr-1" />
                        ) : (
                          <UserX className="w-4 h-4 mr-1" />
                        )}
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedStaff(employee)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedStaff(employee)}
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(employee.id)}
                          className={`${employee.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {employee.status === 'active' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Staff Modal */}
        {showNewStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Add New Staff Member</h3>
                <button
                  onClick={() => setShowNewStaff(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      First Name
                    </label>
                    <input type="text" className="input" placeholder="Enter first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Last Name
                    </label>
                    <input type="text" className="input" placeholder="Enter last name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Email
                    </label>
                    <input type="email" className="input" placeholder="Enter email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Phone
                    </label>
                    <input type="tel" className="input" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Role
                    </label>
                    <select className="input">
                      <option value="">Select role</option>
                      <option value="manager">Manager</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Department
                    </label>
                    <input type="text" className="input" placeholder="Enter department" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Salary
                    </label>
                    <input type="number" min="0" className="input" placeholder="Enter salary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Shift
                    </label>
                    <select className="input">
                      <option value="">Select shift</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="night">Night</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewStaff(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Staff Details Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Staff Details</h3>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-secondary-900">Personal Information</h4>
                    <p className="text-sm text-secondary-600">
                      {selectedStaff.firstName} {selectedStaff.lastName}
                    </p>
                    <p className="text-sm text-secondary-600">{selectedStaff.email}</p>
                    <p className="text-sm text-secondary-600">{selectedStaff.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Employment Details</h4>
                    <p className="text-sm text-secondary-600">Role: {selectedStaff.role}</p>
                    <p className="text-sm text-secondary-600">Department: {selectedStaff.department}</p>
                    <p className="text-sm text-secondary-600">Shift: {selectedStaff.shift}</p>
                    <p className="text-sm text-secondary-600">Hire Date: {new Date(selectedStaff.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-secondary-900">Compensation</h4>
                  <p className="text-sm text-secondary-600">
                    Salary: ${selectedStaff.salary.toLocaleString()}/year
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-secondary-900">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStaff.status)}`}>
                    {selectedStaff.status === 'active' ? (
                      <UserCheck className="w-4 h-4 mr-1" />
                    ) : (
                      <UserX className="w-4 h-4 mr-1" />
                    )}
                    {selectedStaff.status}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Edit Staff Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

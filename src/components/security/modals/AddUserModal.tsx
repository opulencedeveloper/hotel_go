'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { UserRole } from '@/utils/enum';

interface AddUserModalProps {
  isOpen: boolean;
  roles?: any[]; // Keep for backward compatibility, but not used
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

// Helper function to get user-friendly labels for roles
const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    [UserRole.SuperAdmin]: 'Super Admin',
    [UserRole.Manager]: 'Manager',
    [UserRole.FrontDesk]: 'Front Desk',
    [UserRole.HouseKeeping]: 'Housekeeping',
    [UserRole.Kitchen]: 'Kitchen',
    [UserRole.Maintenance]: 'Maintenance',
    [UserRole.Accounting]: 'Accounting',
    [UserRole.Security]: 'Security',
    [UserRole.GuestServices]: 'Guest Services',
  };
  return labels[role] || role;
};

export default function AddUserModal({
  isOpen,
  roles,
  onClose,
  onSubmit,
}: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      status: 'active',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Add New User</h2>
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
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
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
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
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
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select role</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
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
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div>
                <span className="text-secondary-600">Email:</span>
                <span className="font-medium text-secondary-900 ml-1">{formData.email || 'Not set'}</span>
              </div>
              <div>
                <span className="text-secondary-600">Role:</span>
                <span className="font-medium text-secondary-900 ml-1">
                  {formData.role ? getRoleLabel(formData.role as UserRole) : 'Not selected'}
                </span>
              </div>
              <div>
                <span className="text-secondary-600">Status:</span>
                <span className={`font-medium ml-1 capitalize ${
                  formData.status === 'active' ? 'text-green-600' : 
                  formData.status === 'suspended' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {formData.status}
                </span>
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
  );
}








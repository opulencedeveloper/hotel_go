'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { countries } from '@/resources/auth';
import { staffRoleOptions } from '@/resources/staff';
import { StaffShift, StaffRole, StaffStatus } from '@/utils/enum';
import { useHttp } from '@/hooks/useHttp';
import { Staff as ReduxStaff, staffActions } from '@/store/redux/staff-slice';
import { useDispatch } from 'react-redux';

interface EditStaffModalProps {
  isOpen: boolean;
  staff: ReduxStaff | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface StaffFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: StaffRole;
  salary: string;
  shift: StaffShift;
  country: string;
  stateOrProvince: string;
  city: string;
  postalCode?: string;
  address: string;
  status: StaffStatus;
}

export default function EditStaffModal({ isOpen, staff, onClose, onSuccess }: EditStaffModalProps) {
  const { isLoading, sendHttpRequest: updateStaffRequest, error } = useHttp();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    countryCode: countries[0]?.phoneCode || '+1',
    phoneNumber: '',
    role: '' as StaffRole,
    salary: '0',
    shift: '' as StaffShift,
    country: '',
    stateOrProvince: '',
    city: '',
    postalCode: '',
    address: '',
    status: StaffStatus.ACTIVE,
  });

  // Helper function to extract country code from phone number
  const extractCountryCode = (phoneNumber: string) => {
    // Remove any non-numeric characters except +
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Find matching country code from the countries list
    for (const country of countries) {
      if (cleanNumber.startsWith(country.phoneCode)) {
        return country.phoneCode;
      }
    }
    
    // Default to first country if no match found
    return countries[0]?.phoneCode || '+1';
  };

  // Helper function to extract phone number without country code
  const extractPhoneNumber = (phoneNumber: string, countryCode: string) => {
    // Remove country code from the beginning of the phone number
    return phoneNumber.replace(countryCode, '').replace(/^\+/, '');
  };

  // Populate form with staff data when modal opens
  useEffect(() => {
    if (staff && isOpen) {
      const detectedCountryCode = extractCountryCode(staff.phoneNumber);
      const phoneNumber = extractPhoneNumber(staff.phoneNumber, detectedCountryCode);
      
      setFormData({
        firstName: staff.firstName,
        lastName: staff.lastName,
        middleName: staff.middleName || '',
        email: staff.email,
        countryCode: detectedCountryCode,
        phoneNumber: phoneNumber,
        role: staff.userRole,
        salary: staff.salary.toLocaleString(),
        shift: staff.shift as StaffShift,
        country: staff.country,
        stateOrProvince: staff.stateOrProvince,
        city: staff.city,
        postalCode: staff.postalCode || '',
        address: staff.address,
        status: staff.status,
      });
    }
  }, [staff, isOpen]);

  // Helper functions to map between types
  const mapRoleToStaffRole = (role: string): StaffRole => {
    switch (role) {
      case 'manager': return StaffRole.Manager;
      case 'receptionist': return StaffRole.FrontDesk;
      case 'housekeeping': return StaffRole.HouseKeeping;
      case 'kitchen': return StaffRole.Kitchen;
      case 'maintenance': return StaffRole.Maintenance;
      case 'admin': return StaffRole.Accounting; // Default to accounting for admin
      default: return StaffRole.Manager;
    }
  };

  const mapShiftToStaffShift = (shift: string): StaffShift => {
    switch (shift) {
      case 'morning': return StaffShift.MORNING;
      case 'afternoon': return StaffShift.AFTERNOON;
      case 'night': return StaffShift.NIGHT;
      default: return StaffShift.MORNING;
    }
  };

  const mapStatusToStaffStatus = (status: string): StaffStatus => {
    switch (status) {
      case 'active': return StaffStatus.ACTIVE;
      case 'inactive': return StaffStatus.INACTIVE;
      default: return StaffStatus.ACTIVE;
    }
  };

  const handleInputChange = (field: keyof StaffFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalaryChange = (value: string) => {
    // Remove commas and non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Format with commas
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    setFormData(prev => ({
      ...prev,
      salary: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staff) return;

    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      email: formData.email,
      phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
      userRole: formData.role,
      salary: Number(formData.salary.toString().replace(/,/g, '')),
      shift: formData.shift,
      country: formData.country,
      stateOrProvince: formData.stateOrProvince,
      city: formData.city,
      postalCode: formData.postalCode,
      address: formData.address,
      status: formData.status,
    };

    updateStaffRequest({
      successRes: (res: any) => {
        console.log("Staff updated successfully:", res.data);
        const resData = res?.data?.data;

        const updatedStaff = resData?.updatedStaff;

        dispatch(staffActions.updateStaff(updatedStaff));

        onSuccess();
        onClose();
      },
      requestConfig: {
        url: `/hotel/update-staff/?staffId=${staff._id}`,
        method: "PUT",
        body: updateData,
        successMessage: "Staff member updated successfully!",
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Edit Staff Member</h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Phone Number *
                </label>
                <div className="flex">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.phoneCode}>
                        {country.flag} {country.phoneCode}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="flex-1 px-3 py-2 border border-secondary-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Employment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as StaffRole)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Role</option>
                  {staffRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Shift *
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => handleInputChange('shift', e.target.value as StaffShift)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Shift</option>
                  <option value={StaffShift.MORNING}>Morning</option>
                  <option value={StaffShift.AFTERNOON}>Afternoon</option>
                  <option value={StaffShift.NIGHT}>Night</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as StaffStatus)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value={StaffStatus.ACTIVE}>Active</option>
                  <option value={StaffStatus.INACTIVE}>Inactive</option>
                  <option value={StaffStatus.ON_LEAVE}>On Leave</option>
                  <option value={StaffStatus.SUSPENDED}>Suspended</option>
                  <option value={StaffStatus.TERMINATED}>Terminated</option>
                  <option value={StaffStatus.PENDING}>Pending</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Salary *
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => handleSalaryChange(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                placeholder="Enter salary amount"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Country *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  value={formData.stateOrProvince}
                  onChange={(e) => handleInputChange('stateOrProvince', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

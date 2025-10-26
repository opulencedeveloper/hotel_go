'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { countries } from '@/resources/auth';
import { staffRoleOptions } from '@/resources/staff';
import { StaffShift, StaffRole } from '@/utils/enum';
import { useHttp } from '@/hooks/useHttp';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface NewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StaffFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: StaffRole;
  salary: number | string;
  shift: StaffShift;
  country: string;
  stateOrProvince: string;
  city: string;
  postalCode?: string;
  address: string;
}

export default function NewStaffModal({ isOpen, onClose }: NewStaffModalProps) {
  const { isLoading, sendHttpRequest: createStaffRequest, error } = useHttp();
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    countryCode: '+1',
    phoneNumber: '',
    role: '' as StaffRole,
    salary: 0,
    shift: '' as StaffShift,
    country: '',
    stateOrProvince: '',
    city: '',
    postalCode: '',
    address: '',
  });

  const [validationErrors, setValidationErrors] = useState<Partial<StaffFormData>>({});

  const validateField = (field: keyof StaffFormData, value: string | number): string => {
    switch (field) {
      case 'firstName':
        if (!value || (value as string).trim().length === 0) {
          return 'First name is required';
        }
        if ((value as string).trim().length < 2) {
          return 'First name must be at least 2 characters';
        }
        return '';
      
      case 'lastName':
        if (!value || (value as string).trim().length === 0) {
          return 'Last name is required';
        }
        if ((value as string).trim().length < 2) {
          return 'Last name must be at least 2 characters';
        }
        return '';
      
      case 'email':
        if (!value || (value as string).trim().length === 0) {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value as string)) {
          return 'Please enter a valid email address';
        }
        return '';
      
      case 'countryCode':
        if (!value || (value as string).trim().length === 0) {
          return 'Country code is required';
        }
        return '';
      
      case 'phoneNumber':
        if (!value || (value as string).trim().length === 0) {
          return 'Phone number is required';
        }
        const phoneRegex = /^[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(value as string)) {
          return 'Please enter a valid phone number';
        }
        return '';
      
      case 'role':
        if (!value || (value as string).trim().length === 0) {
          return 'Role is required';
        }
        return '';
      
      case 'salary':
        if (!value || value === 0 || value === '') {
          return 'Salary is required';
        }
        const salaryValue = typeof value === 'string' ? parseSalary(value) : value;
        if (salaryValue <= 0) {
          return 'Salary must be a positive number';
        }
        return '';
      
      case 'shift':
        if (!value || (value as string).trim().length === 0) {
          return 'Shift is required';
        }
        return '';
      
      case 'country':
        if (!value || (value as string).trim().length === 0) {
          return 'Country is required';
        }
        return '';
      
      case 'stateOrProvince':
        if (!value || (value as string).trim().length === 0) {
          return 'State/Province is required';
        }
        return '';
      
      case 'city':
        if (!value || (value as string).trim().length === 0) {
          return 'City is required';
        }
        return '';
      
      case 'address':
        if (!value || (value as string).trim().length === 0) {
          return 'Address is required';
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<StaffFormData> = {};
    let isValid = true;

    // Validate all required fields
    const requiredFields: (keyof StaffFormData)[] = [
      'firstName', 'lastName', 'email', 'countryCode', 'phoneNumber', 'role', 
      'salary', 'shift', 'country', 'stateOrProvince', 'city', 'address'
    ];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field] || '');
      if (error) {
        errors[field] = error as any;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const formatSalary = (value: string): string => {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Split by decimal point to handle both integer and decimal parts
    const parts = numericValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Combine integer and decimal parts
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  const parseSalary = (formattedValue: string): number => {
    // Remove commas and convert to number
    const numericValue = formattedValue.replace(/,/g, '');
    return parseFloat(numericValue) || 0;
  };

  const handleInputChange = (field: keyof StaffFormData, value: string | number) => {
    let processedValue = value;
    
    // Special handling for salary field
    if (field === 'salary') {
      if (typeof value === 'string') {
        // Format the display value with commas
        const formattedValue = formatSalary(value);
        setFormData(prev => ({
          ...prev,
          [field]: formattedValue
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const onSuccessHandler = (res: any) => {
      console.log('Staff member created successfully:', res.data);
      // Reset form and validation errors
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        countryCode: '+1',
        phoneNumber: '',
        role: '' as StaffRole,
        salary: 0,
        shift: '' as StaffShift,
        country: '',
        stateOrProvince: '',
        city: '',
        postalCode: '',
        address: '',
      });
      setValidationErrors({});
      onClose();
    };

    // Combine country code and phone number for the API
    // Parse salary to remove commas and convert to number
    // Remove countryCode from request data and rename role to userRole
    const { countryCode, role, ...formDataWithoutCountryCode } = formData;
    const requestData = {
      ...formDataWithoutCountryCode,
      userRole: role,
      phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
      salary: typeof formData.salary === 'string' ? parseSalary(formData.salary) : formData.salary
    };

    createStaffRequest({
      successRes: onSuccessHandler,
      requestConfig: {
        url: '/hotel/create-staff',
        method: 'POST',
        body: requestData,
        successMessage: 'Staff member created successfully'
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Add New Staff Member</h3>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Basic Information Section */}
          <div>
            <h4 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                First Name
              </label>
              <input 
                type="text" 
                className={`input ${validationErrors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Middle Name <span className="text-secondary-500 text-sm">(Optional)</span>
              </label>
              <input 
                type="text" 
                className="input" 
                placeholder="Enter middle name"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Last Name
              </label>
              <input 
                type="text" 
                className={`input ${validationErrors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                className={`input ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Phone Number
              </label>
              <div className="flex rounded-lg overflow-hidden">
                <select
                  className={`w-24 flex-shrink-0 px-3 py-3 bg-secondary-50 border ${
                    validationErrors.countryCode ? 'border-red-500' : 'border-secondary-200'
                  } text-secondary-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.phoneCode} className="bg-white text-secondary-900">
                      {country.flag} {country.phoneCode}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  className={`flex-1 px-4 py-3 bg-white border ${
                    validationErrors.phoneNumber ? 'border-red-500' : 'border-secondary-200'
                  } border-l-0 text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
              {validationErrors.countryCode && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.countryCode}</p>
              )}
              {validationErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Role
              </label>
              <select 
                className={`input ${validationErrors.role ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                <option value="">Select role</option>
                {staffRoleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {validationErrors.role && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Salary ({selectedHotel?.currency || 'USD'})
              </label>
              <input 
                type="text" 
                className={`input ${validationErrors.salary ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter salary (e.g., 50,000)"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
              />
              {validationErrors.salary && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.salary}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Shift
              </label>
              <select 
                className={`input ${validationErrors.shift ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={formData.shift}
                onChange={(e) => handleInputChange('shift', e.target.value)}
              >
                <option value="">Select shift</option>
                <option value={StaffShift.MORNING}>Morning</option>
                <option value={StaffShift.AFTERNOON}>Afternoon</option>
                <option value={StaffShift.NIGHT}>Night</option>
              </select>
              {validationErrors.shift && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.shift}</p>
              )}
            </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="border-t border-secondary-200 pt-6">
            <h4 className="text-lg font-semibold text-secondary-900 mb-4">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Country
                </label>
                <select 
                  className={`input ${validationErrors.country ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name} className="bg-white text-secondary-900">
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                {validationErrors.country && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  State/Province
                </label>
                <input 
                  type="text" 
                  className={`input ${validationErrors.stateOrProvince ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter state or province"
                  value={formData.stateOrProvince}
                  onChange={(e) => handleInputChange('stateOrProvince', e.target.value)}
                />
                {validationErrors.stateOrProvince && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.stateOrProvince}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  City
                </label>
                <input 
                  type="text" 
                  className={`input ${validationErrors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
                {validationErrors.city && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Postal Code
                </label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Address
                </label>
                <input 
                  type="text" 
                  className={`input ${validationErrors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter street address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                {validationErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                )}
              </div>
            </div>
          </div>
          
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Add Staff Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/redux';
import { useGuestsService } from '@/services/guestsService';
import { Guest } from '@/store/slices/guestsSlice';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRole } from '@/utils/enum';

interface GuestFormProps {
  guest?: Guest;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GuestForm = ({ guest, onSuccess, onCancel }: GuestFormProps) => {
  const dispatch = useDispatch();
  const { createGuest, updateGuestById, isLoading } = useGuestsService();
  
  const [formData, setFormData] = useState({
    firstName: guest?.firstName || '',
    lastName: guest?.lastName || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    nationality: guest?.nationality || '',
    idNumber: guest?.idNumber || '',
    preferences: guest?.preferences || [],
    loyaltyPoints: guest?.loyaltyPoints || 0,
    dateOfBirth: guest?.dateOfBirth || '',
    gender: guest?.gender || 'other' as 'male' | 'female' | 'other',
    address: {
      street: guest?.address?.street || '',
      city: guest?.address?.city || '',
      state: guest?.address?.state || '',
      country: guest?.address?.country || '',
      postalCode: guest?.address?.postalCode || ''
    },
    emergencyContact: {
      name: guest?.emergencyContact?.name || '',
      phone: guest?.emergencyContact?.phone || '',
      relationship: guest?.emergencyContact?.relationship || ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPreference, setNewPreference] = useState('');

  const nationalities = [
    'American', 'Canadian', 'British', 'French', 'German', 'Italian', 'Spanish',
    'Chinese', 'Japanese', 'Korean', 'Indian', 'Australian', 'Brazilian', 'Mexican',
    'Egyptian', 'South African', 'Nigerian', 'Other'
  ];

  const preferences = [
    'Non-smoking', 'High floor', 'Ocean view', 'Late checkout', 'Early check-in',
    'Extra pillows', 'Extra towels', 'Room service', 'Wake-up call', 'Newspaper',
    'Halal food', 'Vegetarian', 'Prayer mat', 'Wheelchair accessible', 'Quiet room'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (guest) {
        await updateGuestById(guest.id, formData);
      } else {
        await createGuest(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving guest:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  const addPreference = () => {
    if (newPreference.trim() && !formData.preferences.includes(newPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        preferences: [...prev.preferences, newPreference.trim()]
      }));
      setNewPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.filter(p => p !== preference)
    }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {guest ? 'Edit Guest' : 'Create New Guest'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality *
            </label>
            <select
              value={formData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.nationality ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select nationality</option>
              {nationalities.map(nationality => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number *
            </label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.idNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.idNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <input
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Preferences</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.preferences.map((preference) => (
                <span
                  key={preference}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {preference}
                  <button
                    type="button"
                    onClick={() => removePreference(preference)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <select
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a preference</option>
                {preferences
                  .filter(p => !formData.preferences.includes(p))
                  .map(preference => (
                    <option key={preference} value={preference}>
                      {preference}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addPreference}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Loyalty Points */}
        <RoleGuard allowedRoles={[UserRole.SuperAdmin, UserRole.Manager, UserRole.FrontDesk]}>
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loyalty Points
              </label>
              <input
                type="number"
                min="0"
                value={formData.loyaltyPoints}
                onChange={(e) => handleInputChange('loyaltyPoints', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </RoleGuard>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (guest ? 'Update Guest' : 'Create Guest')}
          </button>
        </div>
      </form>
    </div>
  );
};

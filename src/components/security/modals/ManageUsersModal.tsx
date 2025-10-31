'use client';

import { useEffect, useState } from 'react';
import { X, Users, Key, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Staff, staffActions } from '@/store/redux/staff-slice';
import { staffRoleOptions } from '@/resources/staff';
import { useHttp } from '@/hooks/useHttp';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export default function ManageUsersModal({
  isOpen,
  onClose,
  onSubmit,
}: ManageUsersModalProps) {
  // Get staff data from Redux state
  const staff = useSelector((state: RootState) => state.staff);
  const { fetchedData, staffs } = staff;
  
  const [staffPasswords, setStaffPasswords] = useState<{[key: string]: string}>({});
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [submittingStaff, setSubmittingStaff] = useState<{[key: string]: boolean}>({});
  const [showSubmitPasswordModal, setShowSubmitPasswordModal] = useState(false);
  const [submittedPassword, setSubmittedPassword] = useState('');


   const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();

  const {
    isLoading: isGeneratingPassword,
    sendHttpRequest: generatePasswordRequest,
    error: passwordError,
  } = useHttp();

  const {
    isLoading: isSubmittingPassword,
    sendHttpRequest: submitPasswordRequest,
    error: submitPasswordError,
  } = useHttp();

  useEffect(() => {
    setMounted(true);

    if (fetchedData) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const resData = res?.data?.data;
      const staffs = resData?.staffs;

        console.log("staffs", staffs);

        dispatch(staffActions.setStaffs(staffs));
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/hotel/get-staffs",
        method: "GET",
      },
    });
  }, [dispatch, fetchedData]);

  if (isLoading || !mounted) {
    return<div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-secondary-600 mt-2">Loading staff data...</p>
            </div>;
  }

  if (error) {
    const handleRetry = () => {
      if (fetchedData) return;

      const onFetchUserAndHotelInfoReq = (res: any) => {
        const resData = res?.data?.data;
        const staffs = resData?.staffs;

        console.log("staffs", staffs);

        dispatch(staffActions.setStaffs(staffs));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/hotel/get-staffs",
          method: "GET",
        },
      });
    };

     return (
            <div className="max-w-md w-full">
              <ErrorDisplay
                error={error}
                title="Failed to load dashboard"
                description="We couldn't load your dashboard information. This might be due to a network issue or server problem."
                onRetry={handleRetry}
                showRetry={true}
                size="large"
                variant="error"
              />
            </div>
        );

  }

  // Generate a secure password for a specific staff member
  const generateSecurePassword = (staff: Staff) => {
    setSelectedStaff(staff);
    
    generatePasswordRequest({
      successRes: (res: any) => {
        const resData = res?.data?.data;
        const password = resData?.password;
        
        if (password) {
          setGeneratedPassword(password);
          setStaffPasswords(prev => ({ ...prev, [staff._id]: password }));
          setShowPasswordModal(true);
        }
      },
      requestConfig: {
        url: `/hotel/generate-staff-password?staffId=${staff._id}`,
        method: "POST",
        body: {
          staffId: staff._id,
          email: staff.email,
          firstName: staff.firstName,
          lastName: staff.lastName
        },
        successMessage: "Password generated successfully!",
      },
    });
  };

  // Submit/save password for a specific staff member
  const submitPassword = (staff: Staff) => {
    const password = staffPasswords[staff._id];
    
    if (!password) {
      alert('Please enter or generate a password first.');
      return;
    }

    // Set loading state for this specific staff member
    setSubmittingStaff(prev => ({ ...prev, [staff._id]: true }));

      submitPasswordRequest({
        successRes: (res: any) => {
          // Update the staff in Redux to mark as having password
          dispatch(staffActions.updateStaff({
            ...staff,
            hasPassword: true
          }));
          // Clear loading state for this staff member
          setSubmittingStaff(prev => ({ ...prev, [staff._id]: false }));
          
          // Clear the password input for this staff member
          setStaffPasswords(prev => ({ ...prev, [staff._id]: '' }));
          
          // Show the password confirmation modal
          setSubmittedPassword(password);
          setSelectedStaff(staff);
          setShowSubmitPasswordModal(true);
        },
      requestConfig: {
        url: `/hotel/generate-staff-password?staffId=${staff._id}`,
        method: "POST",
        body: {
          password: password,
        },
        successMessage: "Password saved successfully!",
      },
    }).catch(() => {
      // Clear loading state on error
      setSubmittingStaff(prev => ({ ...prev, [staff._id]: false }));
    });
  };

  // Toggle password visibility for a specific staff member
  const togglePasswordVisibility = (staffId: string) => {
    setShowPasswords(prev => ({ ...prev, [staffId]: !prev[staffId] }));
  };

  // Copy password to clipboard
  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
  };

  // Get existing password for staff member
  const getStaffPassword = (staff: Staff) => {
    return staffPasswords[staff._id] || '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit all staff passwords
    onSubmit({ staffPasswords });
    onClose();
  };

  if (!isOpen) return null;




  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Manage Users</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Staff Password Management</h3>
            <p className="text-sm text-secondary-600">
              Generate or update passwords for staff member(s) to access the dashboard.
            </p>
          </div>

          {staffs.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">No staff members found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {staffs.map((staff) => {
                const currentPassword = getStaffPassword(staff);
                const isPasswordVisible = showPasswords[staff._id] || false;
                
                return (
                  <div key={staff._id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-secondary-900">
                          {staff.firstName} {staff.lastName}
                        </h4>
                        <p className="text-sm text-secondary-600">{staff.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {staff.userRole}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            staff.status === 'active' ? 'bg-green-100 text-green-800' :
                            staff.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {staff.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-secondary-700">
                        Dashboard Access Password
                      </label>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            type={isPasswordVisible ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setStaffPasswords(prev => ({ ...prev, [staff._id]: e.target.value }))}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg font-mono text-sm"
                            placeholder={staff.hasPassword ? "Enter new password" : "No password set"}
                          />
                          {currentPassword && (
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(staff._id)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                            >
                              {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        
                        
                        <button
                          type="button"
                          onClick={() => submitPassword(staff)}
                          disabled={submittingStaff[staff._id] || !currentPassword}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          <span>
                            {submittingStaff[staff._id] ? 'Saving...' : 
                             staff.hasPassword ? 'Update Password' : 'Create Password'}
                          </span>
                        </button>
                        
                        {currentPassword && (
                          <button
                            type="button"
                            onClick={() => copyPassword(currentPassword)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                          >
                            <span>Copy</span>
                          </button>
                        )}
                      </div>
                      
                      {(passwordError || submitPasswordError) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs text-red-600">
                            <strong>Error:</strong> {passwordError || submitPasswordError}
                          </p>
                        </div>
                      )}
                      
                      {currentPassword && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs text-green-600">
                            <strong>Security Note:</strong> Please provide this password securely to the staff member. 
                            They should change it on first login.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
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
              <Users className="w-4 h-4 mr-2" />
              Close
            </button>
          </div>
        </form>
      </div>

      {/* Password Confirmation Modal */}
      {showPasswordModal && selectedStaff && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Password Generated</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setGeneratedPassword('');
                  setSelectedStaff(null);
                }}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Important Security Notice</span>
                </div>
                <p className="text-sm text-yellow-700">
                  This password will only be shown once. Please copy it now and provide it securely to the staff member.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Generated Password for {selectedStaff.firstName} {selectedStaff.lastName}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg font-mono text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => copyPassword(generatedPassword)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-600">
                  <strong>Warning:</strong> This password cannot be viewed again after closing this modal. 
                  Make sure to copy it and provide it securely to the staff member.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setGeneratedPassword('');
                    setSelectedStaff(null);
                  }}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  I've Copied the Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Submit Confirmation Modal */}
      {showSubmitPasswordModal && selectedStaff && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Password Saved Successfully</h3>
              <button
                onClick={() => {
                  setShowSubmitPasswordModal(false);
                  setSubmittedPassword('');
                  setSelectedStaff(null);
                }}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Important Security Notice</span>
                </div>
                <p className="text-sm text-yellow-700">
                  This password has been saved and will only be shown once. Please copy it now and provide it securely to the staff member.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Saved Password for {selectedStaff.firstName} {selectedStaff.lastName}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={submittedPassword}
                    readOnly
                    className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg font-mono text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => copyPassword(submittedPassword)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-600">
                  <strong>Warning:</strong> This password cannot be viewed again after closing this modal. 
                  Make sure to copy it and provide it securely to the staff member.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowSubmitPasswordModal(false);
                    setSubmittedPassword('');
                    setSelectedStaff(null);
                  }}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  I've Copied the Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


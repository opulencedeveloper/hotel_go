'use client';

import { X, UserCheck, UserX, MapPin, Calendar, DollarSign, Building, Phone, Mail } from 'lucide-react';
import { Staff as ReduxStaff } from '@/store/redux/staff-slice';
import { StaffStatus } from '@/utils/enum';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface StaffDetailsModalProps {
  isOpen: boolean;
  staff: ReduxStaff | null;
  onClose: () => void;
  onEdit: () => void;
}

export default function StaffDetailsModal({ 
  isOpen, 
  staff, 
  onClose, 
  onEdit 
}: StaffDetailsModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  if (!isOpen || !staff) return null;

  const getStatusColor = (status: StaffStatus) => {
    switch (status) {
      case StaffStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case StaffStatus.INACTIVE: return 'bg-red-100 text-red-800';
      case StaffStatus.ON_LEAVE: return 'bg-yellow-100 text-yellow-800';
      case StaffStatus.TERMINATED: return 'bg-red-100 text-red-800';
      case StaffStatus.SUSPENDED: return 'bg-orange-100 text-orange-800';
      case StaffStatus.PENDING: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: StaffStatus) => {
    switch (status) {
      case StaffStatus.ACTIVE: return <UserCheck className="w-4 h-4 mr-1" />;
      case StaffStatus.INACTIVE:
      case StaffStatus.TERMINATED:
      case StaffStatus.SUSPENDED:
        return <UserX className="w-4 h-4 mr-1" />;
      default:
        return <UserCheck className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Staff Details</h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900 flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Full Name</label>
                  <p className="text-sm text-secondary-900">
                    {staff.firstName} {staff.middleName && `${staff.middleName} `}{staff.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Email</label>
                  <p className="text-sm text-secondary-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {staff.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Phone</label>
                  <p className="text-sm text-secondary-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {staff.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Created</label>
                  <p className="text-sm text-secondary-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(staff.createdAt).toLocaleDateString()} at {new Date(staff.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Employment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Role</label>
                  <p className="text-sm text-secondary-900">{staff.userRole}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Shift</label>
                  <p className="text-sm text-secondary-900 capitalize font-medium">{staff.shift}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                    {getStatusIcon(staff.status)}
                    {staff.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Compensation
            </h4>
            <div>
              <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Annual Salary</label>
              <p className="text-lg font-semibold text-secondary-900">
                {formatPrice(staff.salary, selectedHotel?.currency)}/year
              </p>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Address</label>
                <p className="text-sm text-secondary-900">{staff.address}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">City</label>
                  <p className="text-sm text-secondary-900">{staff.city}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">State/Province</label>
                  <p className="text-sm text-secondary-900">{staff.stateOrProvince}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Country</label>
                  <p className="text-sm text-secondary-900">{staff.country}</p>
                </div>
              </div>
              {staff.postalCode && (
                <div>
                  <label className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Postal Code</label>
                  <p className="text-sm text-secondary-900">{staff.postalCode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
          <button 
            onClick={onEdit}
            className="btn-primary"
          >
            Edit Staff Member
          </button>
        </div>
      </div>
    </div>
  );
}

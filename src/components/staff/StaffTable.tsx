'use client';

import { 
  Users, 
  Edit, 
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import { Staff } from '@/types';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface StaffTableProps {
  staff: Staff[];
  onViewStaff: (staff: Staff) => void;
  onEditStaff: (staff: Staff) => void;
  onToggleStatus: (staffId: string) => void;
}

export default function StaffTable({ 
  staff, 
  onViewStaff, 
  onEditStaff, 
  onToggleStatus 
}: StaffTableProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
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

  return (
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
            {staff.map((employee) => (
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
                  {formatPrice(employee.salary, selectedHotel?.currency)}
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
                      onClick={() => onViewStaff(employee)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditStaff(employee)}
                      className="text-secondary-600 hover:text-secondary-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(employee.id)}
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
  );
}

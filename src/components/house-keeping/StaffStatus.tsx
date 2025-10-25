'use client';

import { User, CheckCircle, X } from 'lucide-react';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  shift: string;
  status: string;
}

interface StaffStatusProps {
  staff: StaffMember[];
}

export default function StaffStatus({ staff }: StaffStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Staff Status</h3>
      <div className="space-y-3">
        {staff.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-secondary-900">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-secondary-600">{member.shift} shift</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
              {member.status === 'active' ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <X className="w-3 h-3 mr-1" />
              )}
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


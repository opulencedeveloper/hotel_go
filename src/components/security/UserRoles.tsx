'use client';

import { Eye, Edit } from 'lucide-react';

interface Role {
  role_id: string;
  name: string;
  description: string;
  permissions: any[];
  is_system_role: boolean;
}

interface UserRolesProps {
  roles: Role[];
}

export default function UserRoles({ roles }: UserRolesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">User Roles</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {roles.map((role) => (
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
  );
}

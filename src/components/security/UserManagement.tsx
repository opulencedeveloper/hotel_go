"use client";

import { Plus, Eye, Edit, UserX, Users, Search } from "lucide-react";
import { Staff } from "@/store/redux/staff-slice";
import { staffRoleOptions } from "@/resources/staff";

interface UserManagementProps {
  users: Staff[];
  selectedRole: string;
  isClient: boolean;
  onRoleFilterChange: (role: string) => void;
  onAddUser: () => void;
}

export default function UserManagement({
  users,
  selectedRole,
  isClient,
  onRoleFilterChange,
  onAddUser,
}: UserManagementProps) {
  const isEmpty = users.length === 0;
  const isFiltered = selectedRole !== 'all';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">
            User Management
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Roles</option>
              {staffRoleOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button
              onClick={onAddUser}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add User</span>
            </button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="p-12 md:p-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            {/* Icon Container */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full blur-xl opacity-50" />
              <div className="relative p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full">
                {isFiltered ? (
                  <Search className="w-12 h-12 text-primary-600" />
                ) : (
                  <Users className="w-12 h-12 text-primary-600" />
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              {isFiltered ? 'No users found' : 'No users yet'}
            </h3>

            {/* Description */}
            <p className="text-secondary-600 mb-6 text-sm leading-relaxed">
              {isFiltered ? (
                <>
                  No users match the selected role filter. Try changing the filter or{' '}
                  <button
                    onClick={() => onRoleFilterChange('all')}
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    view all roles
                  </button>
                  .
                </>
              ) : (
                'Get started by adding your first user to the system. You can manage roles, permissions, and access levels.'
              )}
            </p>

            {/* Action Button */}
            {!isFiltered && (
              <button
                onClick={onAddUser}
                className="group flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Add Your First User</span>
              </button>
            )}

            {/* Decorative Elements */}
            <div className="mt-8 flex items-center space-x-2 text-xs text-secondary-400">
              <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse" />
              <span>Start building your team</span>
              <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    Staff Member
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    Department
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    Shift
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    Password
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((staff) => (
                  <tr
                    key={staff._id}
                    className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-secondary-900">
                          {staff.firstName} {staff.lastName}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {staff.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-secondary-600 capitalize">
                      {staff.userRole}
                    </td>
                    <td className="py-3 px-4 text-secondary-600 capitalize">
                      {staff.userRole}
                    </td>
                    <td className="py-3 px-4 text-secondary-600">
                      {staff.shift}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          staff.hasPassword
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {staff.hasPassword ? "Set" : "Not Set"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          staff.status === "active"
                            ? "bg-green-100 text-green-800"
                            : staff.status === "suspended"
                            ? "bg-red-100 text-red-800"
                            : staff.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : staff.status === "on_leave"
                            ? "bg-yellow-100 text-yellow-800"
                            : staff.status === "terminated"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {staff.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

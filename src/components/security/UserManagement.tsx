"use client";

import { Plus, Eye, Edit, UserX } from "lucide-react";
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
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Roles</option>
              {staffRoleOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
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
                {/* <th className="text-left py-3 px-4 font-medium text-secondary-600">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((staff) => (
                <tr
                  key={staff._id}
                  className="border-b border-secondary-100 hover:bg-secondary-50"
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
                  {/* <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 text-secondary-400 hover:text-secondary-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-secondary-400 hover:text-secondary-600"
                        title="Edit Staff"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Suspend Staff"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { staffRoleOptions } from "@/resources/staff";
import { Search, Filter } from "lucide-react";

interface StaffFiltersProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onRoleFilterChange: (role: string) => void;
  onStatusFilterChange: (status: string) => void;
}

export default function StaffFilters({
  searchTerm,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
}: StaffFiltersProps) {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 input"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="input"
          >
            <option value="all">All Roles</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="kitchen">Kitchen</option>
            <option value="maintenance">Maintenance</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
            <option value="terminated">Terminated</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}

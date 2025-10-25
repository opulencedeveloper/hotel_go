'use client';

import { UserCheck, UserX, Shield, AlertTriangle, UserMinus, Clock, Ban, Plus } from 'lucide-react';

interface SecurityOverviewCardsProps {
  activeUsers: number;
  suspendedUsers: number;
  inactiveUsers: number;
  onLeaveUsers: number;
  terminatedUsers: number;
  pendingUsers: number;
  recentEvents: number;
  criticalEvents: number;
}

export default function SecurityOverviewCards({
  activeUsers,
  suspendedUsers,
  inactiveUsers,
  onLeaveUsers,
  terminatedUsers,
  pendingUsers,
  recentEvents,
  criticalEvents,
}: SecurityOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Active Users */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-secondary-600">Active</p>
            <p className="text-xl font-bold text-secondary-900">{activeUsers}</p>
            <p className="text-xs text-green-600">Working</p>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <UserCheck className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </div>

      {/* Suspended Users */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-secondary-600">Suspended</p>
            <p className="text-xl font-bold text-secondary-900">{suspendedUsers}</p>
            <p className="text-xs text-red-600">Disciplinary</p>
          </div>
          <div className="p-2 bg-red-100 rounded-full">
            <UserX className="w-4 h-4 text-red-600" />
          </div>
        </div>
      </div>

      {/* Inactive Users */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-secondary-600">Inactive</p>
            <p className="text-xl font-bold text-secondary-900">{inactiveUsers}</p>
            <p className="text-xs text-gray-600">Deactivated</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <UserMinus className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* On Leave Users */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-secondary-600">On Leave</p>
            <p className="text-xl font-bold text-secondary-900">{onLeaveUsers}</p>
            <p className="text-xs text-yellow-600">Vacation</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-full">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Terminated Users */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-secondary-600">Terminated</p>
            <p className="text-xl font-bold text-secondary-900">{terminatedUsers}</p>
            <p className="text-xs text-red-600">No longer employed</p>
          </div>
          <div className="p-2 bg-red-100 rounded-full">
            <Ban className="w-4 h-4 text-red-600" />
          </div>
        </div>
      </div>

      {/* Pending Users */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-secondary-600">Pending</p>
            <p className="text-xl font-bold text-secondary-900">{pendingUsers}</p>
            <p className="text-xs text-blue-600">Awaiting setup</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

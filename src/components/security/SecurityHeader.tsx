'use client';

import { Shield, Users, Key, Eye } from 'lucide-react';

interface SecurityHeaderProps {
  activeUsers: number;
  criticalEvents: number;
  onManageUsers: () => void;
  onAccessLogs: () => void;
  onSecurityAudit: () => void;
}

export default function SecurityHeader({
  activeUsers,
  criticalEvents,
  onManageUsers,
  onAccessLogs,
  onSecurityAudit,
}: SecurityHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Security & Access Control</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">User Permissions & Security</span>
            </div>
          </div>
          
          <p className="text-red-100 text-lg mb-6">
            Manage user access, permissions, and security settings to protect your hotel data and operations.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Shield className="w-4 h-4" />
              <span className="text-red-100">Security Active</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-red-200">Active Users:</span>
              <span className="font-medium">{activeUsers}</span>
            </div>
            {/* <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-red-200">Critical Events:</span>
              <span className="font-medium">{criticalEvents}</span>
            </div> */}
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="flex flex-col gap-3">
            <button 
              onClick={onManageUsers}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Users className="w-4 h-4" />
              <span>Manage Users</span>
            </button>
            {/* <button 
              onClick={onAccessLogs}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Key className="w-4 h-4" />
              <span>Access Logs</span>
            </button>
            <button 
              onClick={onSecurityAudit}
              className="bg-white text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Eye className="w-4 h-4" />
              <span>Security Audit</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}





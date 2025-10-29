'use client';

import { CheckCircle, Users, AlertCircle } from 'lucide-react';

export default function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Security Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">CCTV Systems</span>
              <span className="font-semibold text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Access Control</span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Alarm Systems</span>
              <span className="font-semibold text-green-600">Armed</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Staff login - Front Desk</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Guest check-in - Room 201</span>
            </div>
            <div className="flex items-center text-yellow-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Maintenance access - Floor 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}












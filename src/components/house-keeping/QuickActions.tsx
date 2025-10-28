'use client';

import { Sparkles, Wrench, Droplets } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-700">Mark Room Clean</p>
              <p className="text-xs text-green-600">Update room status</p>
            </div>
          </div>
        </button>
        <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
          <div className="flex items-center">
            <Wrench className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-700">Report Maintenance</p>
              <p className="text-xs text-blue-600">Create maintenance task</p>
            </div>
          </div>
        </button>
        <button className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
          <div className="flex items-center">
            <Droplets className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-700">Request Supplies</p>
              <p className="text-xs text-yellow-600">Order cleaning supplies</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}





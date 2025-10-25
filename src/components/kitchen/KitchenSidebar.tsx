'use client';

import { ChefHat, Users, Utensils, AlertTriangle, CheckCircle } from 'lucide-react';

interface KitchenSidebarProps {
  onMenuManager: () => void;
  onStaffSchedule: () => void;
  onInventoryCheck: () => void;
  onReportIssue: () => void;
}

export default function KitchenSidebar({ 
  onMenuManager, 
  onStaffSchedule, 
  onInventoryCheck, 
  onReportIssue 
}: KitchenSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Kitchen Performance */}
      {/* <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Kitchen Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Avg. Prep Time</span>
            <span className="font-semibold text-secondary-900">18 min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Orders Today</span>
            <span className="font-semibold text-secondary-900">47</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Completion Rate</span>
            <span className="font-semibold text-green-600">94%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Kitchen Efficiency</span>
            <span className="font-semibold text-blue-600">Excellent</span>
          </div>
        </div>
      </div> */}
      
      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button 
            onClick={onMenuManager}
            className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <ChefHat className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-secondary-900">Add Menu Item</span>
          </button>
          {/* <button 
            onClick={onStaffSchedule}
            className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-secondary-900">Staff Schedule</span>
          </button>
          <button 
            onClick={onInventoryCheck}
            className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Utensils className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-secondary-900">Inventory Check</span>
          </button> */}
          {/* <button 
            onClick={onReportIssue}
            className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-secondary-900">Report Issue</span>
          </button> */}
        </div>
      </div>
      
      {/* Kitchen Alerts */}
      {/* <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Kitchen Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
              <p className="text-xs text-yellow-700">Salmon fillets running low</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Equipment Issue</p>
              <p className="text-xs text-red-700">Oven #2 needs maintenance</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Staff Update</p>
              <p className="text-xs text-blue-700">Chef Mike started shift</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

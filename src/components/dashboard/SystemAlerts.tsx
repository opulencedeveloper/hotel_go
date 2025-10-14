'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';

interface SystemAlertsProps {
  overbookRisk: number;
  lowInventoryAlerts: number;
  syncErrors: number;
  pendingPayments: number;
}

export default function SystemAlerts({ 
  overbookRisk, 
  lowInventoryAlerts, 
  syncErrors, 
  pendingPayments 
}: SystemAlertsProps) {
  const totalAlerts = overbookRisk + lowInventoryAlerts + syncErrors + pendingPayments;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">System Alerts</h3>
        <span className="text-sm text-red-600">
          {totalAlerts}
        </span>
      </div>
      <div className="space-y-3">
        {overbookRisk > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-900">Overbook Risk</p>
              <p className="text-sm text-secondary-600">{overbookRisk} room(s) overbooked</p>
            </div>
          </div>
        )}
        {lowInventoryAlerts > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-900">Low Inventory</p>
              <p className="text-sm text-secondary-600">{lowInventoryAlerts} item(s) running low</p>
            </div>
          </div>
        )}
        {syncErrors > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-900">Sync Error</p>
              <p className="text-sm text-secondary-600">{syncErrors} sync error(s)</p>
            </div>
          </div>
        )}
        {pendingPayments > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <div className="p-2 bg-orange-100 rounded-full">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-900">Pending Payments</p>
              <p className="text-sm text-secondary-600">{pendingPayments} payment(s) pending</p>
            </div>
          </div>
        )}
        {totalAlerts === 0 && (
          <div className="text-center py-4 text-secondary-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">No alerts at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}


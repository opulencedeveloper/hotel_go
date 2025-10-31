'use client';

import { Plus, RefreshCw } from 'lucide-react';

interface FolioHeaderProps {
  onAddCharge: () => void;
  onProcessPayment: () => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onRefetch?: () => void;
  isLoading?: boolean;
}

export default function FolioHeader({ 
  onAddCharge, 
  onProcessPayment,
  selectedPeriod = '30d',
  onPeriodChange,
  onRefetch,
  isLoading = false
}: FolioHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Payment Management</h1>
          <p className="text-secondary-600">Centralized payment processing for all hotel services</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {/* <button 
            onClick={onAddCharge}
            className="btn-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Charge
          </button>
          <button 
            onClick={onProcessPayment}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Process Payment
          </button> */}
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="bg-white border border-secondary-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary-700 mb-2">Time Period Filter</label>
            <div className="flex gap-2">
              {onPeriodChange && (
                <select 
                  value={selectedPeriod}
                  onChange={(e) => onPeriodChange(e.target.value)}
                  className="flex-1 border border-secondary-300 bg-white text-secondary-900 rounded-lg px-3 py-2 text-sm hover:border-secondary-400 transition-colors cursor-pointer focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isLoading}
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              )}
              {onRefetch && (
                <button
                  onClick={onRefetch}
                  disabled={isLoading}
                  className="bg-primary-600 text-white hover:bg-primary-700 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

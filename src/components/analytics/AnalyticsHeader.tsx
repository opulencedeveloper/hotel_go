'use client';

import { Database, Download, RefreshCw, Filter } from 'lucide-react';

interface AnalyticsHeaderProps {
  onExportClick: () => void;
  onRefreshClick: () => void;
  onFiltersClick: () => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onApplyFilter?: () => void;
  isLoading?: boolean;
}

export default function AnalyticsHeader({
  onExportClick,
  onRefreshClick,
  onFiltersClick,
  selectedPeriod = '30d',
  onPeriodChange,
  onApplyFilter,
  isLoading = false,
}: AnalyticsHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Business Analytics</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">Data Insights & Reports</span>
            </div>
          </div>
          
          <p className="text-blue-100 text-lg mb-6">
            Comprehensive analytics and insights to drive data-driven decisions for your hotel operations.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Database className="w-4 h-4" />
              <span className="text-blue-100">Analytics Active</span>
            </div>
            {/* <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-blue-200">Data Points:</span>
              <span className="font-medium">2.4M</span>
            </div> */}
            {/* <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-blue-200">Last Update:</span>
              <span className="font-medium">5 min ago</span>
            </div> */}
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Time Period Filter
            </label>
            <div className="flex gap-2">
              {onPeriodChange && (
                <select 
                  value={selectedPeriod}
                  onChange={(e) => onPeriodChange(e.target.value)}
                  className="flex-1 border border-white/30 bg-white/10 text-white rounded-lg px-3 py-2 text-sm hover:border-white/50 transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="1d" className="bg-blue-600">Last 24 hours</option>
                  <option value="7d" className="bg-blue-600">Last 7 days</option>
                  <option value="30d" className="bg-blue-600">Last 30 days</option>
                  <option value="90d" className="bg-blue-600">Last 90 days</option>
                  <option value="1y" className="bg-blue-600">Last year</option>
                </select>
              )}
              {onApplyFilter && (
                <button
                  onClick={onApplyFilter}
                  disabled={isLoading || !onApplyFilter}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {isLoading ? 'Loading...' : 'Apply Filter'}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={onExportClick}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button 
              onClick={onRefreshClick}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

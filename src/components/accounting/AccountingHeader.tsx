'use client';

import { Receipt, PieChart, FileText } from 'lucide-react';

interface AccountingHeaderProps {
  onViewTransactions: () => void;
  onFinancialReports: () => void;
  onGenerateInvoice: () => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onApplyFilter?: () => void;
  isLoading?: boolean;
}

export default function AccountingHeader({
  onViewTransactions,
  onFinancialReports,
  onGenerateInvoice,
  selectedPeriod = '30d',
  onPeriodChange,
  onApplyFilter,
  isLoading = false,
}: AccountingHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Accounting & Finance</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">Financial Management</span>
            </div>
          </div>
          
          <p className="text-green-100 text-lg mb-6">
            Comprehensive financial management and accounting tools for your hotel operations.
          </p>
          
          {/* Time Period Filter */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-green-100 mb-2">Time Period Filter</label>
            <div className="flex gap-2">
              {onPeriodChange && (
                <select 
                  value={selectedPeriod}
                  onChange={(e) => onPeriodChange(e.target.value)}
                  className="flex-1 border border-white/30 bg-white/10 text-white rounded-lg px-3 py-2 text-sm hover:border-white/50 transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="1d" className="bg-green-600">Last 24 hours</option>
                  <option value="7d" className="bg-green-600">Last 7 days</option>
                  <option value="30d" className="bg-green-600">Last 30 days</option>
                  <option value="90d" className="bg-green-600">Last 90 days</option>
                  <option value="1y" className="bg-green-600">Last year</option>
                </select>
              )}
              {onApplyFilter && (
                <button
                  onClick={onApplyFilter}
                  disabled={isLoading || !onApplyFilter}
                  className="bg-white text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {isLoading ? 'Loading...' : 'Apply Filter'}
                </button>
              )}
            </div>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Receipt className="w-4 h-4" />
              <span className="text-green-100">Real-time Accounting</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-green-200">Fiscal Year:</span>
              <span className="font-medium">{new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-green-200">Last Reconciliation:</span>
              <span className="font-medium">Today</span>
            </div>
          </div> */}
        </div>
        
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="flex flex-col gap-3">
            <button 
              onClick={onViewTransactions}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Receipt className="w-4 h-4" />
              <span>View Transactions</span>
            </button>
            {/* <button 
              onClick={onFinancialReports}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <PieChart className="w-4 h-4" />
              <span>Financial Reports</span>
            </button>
            <button 
              onClick={onGenerateInvoice}
              className="bg-white text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Invoice</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}


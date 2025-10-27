'use client';

import { formatPrice } from '@/helper';

interface RevenueChartProps {
  selectedPeriod: string;
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
  currency?: string;
}

export default function RevenueChart({
  selectedPeriod,
  monthlyRevenue,
  currency,
}: RevenueChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Monthly Revenue</h2>
          <div className="flex items-center gap-2">
            <div className="text-sm text-secondary-600">
              {selectedPeriod === '1d' && 'Last 24 hours'}
              {selectedPeriod === '7d' && 'Last 7 days'}
              {selectedPeriod === '30d' && 'Last 30 days'}
              {selectedPeriod === '90d' && 'Last 90 days'}
              {selectedPeriod === '1y' && 'Last year'}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {monthlyRevenue.slice(-6).map((month, index) => (
            <div key={month.month} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-secondary-900">{month.month}</span>
              </div>
              <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900">{formatPrice(month.revenue, currency)}</p>
                <p className="text-xs text-secondary-600">{month.bookings} bookings</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

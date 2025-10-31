'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const data = monthlyRevenue.slice(-6);

  // Custom tooltip formatter
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Revenue') {
      return formatPrice(value, currency);
    }
    return `${value} ${name}`;
  };

  // Format Y-axis for revenue
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Stay Monthly Revenue</h2>
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
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              yAxisId="revenue"
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              tickFormatter={formatYAxis}
              label={{ value: 'Revenue', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
            />
            <YAxis 
              yAxisId="bookings"
              orientation="right"
              stroke="#10b981"
              fontSize={12}
              tick={{ fill: '#10b981' }}
              label={{ value: 'Stays', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#10b981' } }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              formatter={formatTooltipValue}
              labelStyle={{ color: '#111827', fontWeight: 600, marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              yAxisId="revenue"
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              yAxisId="bookings"
              type="monotone" 
              dataKey="bookings" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Stays"
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

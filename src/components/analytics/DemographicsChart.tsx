'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DemographicsChartProps {
  demographics: {
    totalAdults: number;
    totalChildren: number;
    totalGuests: number;
    adultPercentage: string;
    childrenPercentage: string;
  };
}

const COLORS = ['#3b82f6', '#10b981'];

export default function DemographicsChart({ demographics }: DemographicsChartProps) {
  const { totalAdults, totalChildren, totalGuests } = demographics;

  const data = [
    { name: 'Adults', value: totalAdults, color: COLORS[0] },
    { name: 'Children', value: totalChildren, color: COLORS[1] },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Guest Demographics</h2>
      </div>
      <div className="p-6">
        {totalGuests === 0 ? (
          <div className="flex items-center justify-center h-64 text-secondary-500">
            <p className="text-sm">No demographic data available for selected period</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Guests Header */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
              <p className="text-3xl font-bold text-secondary-900">{totalGuests.toLocaleString()}</p>
              <p className="text-sm text-secondary-600 mt-1">Total Guests</p>
            </div>

            {/* Donut Chart */}
            <div className="relative">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    innerRadius={70}
                    paddingAngle={4}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number, name: string) => {
                      const percentage = totalGuests > 0 ? ((value / totalGuests) * 100).toFixed(1) : '0';
                      return [`${value.toLocaleString()} (${percentage}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-secondary-900">Adults</span>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {totalGuests > 0 ? ((totalAdults / totalGuests) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{totalAdults.toLocaleString()}</p>
                <p className="text-xs text-secondary-600 mt-1">guests</p>
              </div>
              <div className="bg-green-50 rounded-lg p-5 border border-green-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-secondary-900">Children</span>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {totalGuests > 0 ? ((totalChildren / totalGuests) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-green-600">{totalChildren.toLocaleString()}</p>
                <p className="text-xs text-secondary-600 mt-1">guests</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

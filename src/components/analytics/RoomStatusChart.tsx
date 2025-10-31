'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RoomStatusChartProps {
  availableRooms: number;
  totalRooms: number;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function RoomStatusChart({ availableRooms, totalRooms }: RoomStatusChartProps) {
  const occupiedRooms = totalRooms - availableRooms;
  
  const data = [
    { name: 'Available', value: availableRooms },
    { name: 'Occupied', value: occupiedRooms },
  ].filter(item => item.value > 0);


  if (totalRooms === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Room Status Distribution</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-64 text-secondary-500">
            <p className="text-sm">No room data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Room Status Distribution</h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {/* Total Rooms */}
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary-900">{totalRooms}</p>
            <p className="text-sm text-secondary-600 mt-1">Total Rooms</p>
          </div>

          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
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
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => {
                  const percentage = totalRooms > 0 ? ((value / totalRooms) * 100).toFixed(1) : '0';
                  return [`${value} rooms (${percentage}%)`, name];
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value: string) => {
                  const item = data.find(d => d.name === value);
                  const percentage = item && totalRooms > 0 ? ((item.value / totalRooms) * 100).toFixed(1) : '0';
                  return `${value} (${percentage}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary */}
          <div className="pt-4 border-t border-secondary-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-secondary-900">{availableRooms}</p>
                <p className="text-xs text-secondary-600">Available</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-secondary-900">{occupiedRooms}</p>
                <p className="text-xs text-secondary-600">Occupied</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

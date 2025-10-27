'use client';

interface RevenueBreakdownProps {
  roomsRevenue: number;
  fAndBRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
}

export default function RevenueBreakdown({
  roomsRevenue,
  fAndBRevenue,
  otherRevenue,
  totalRevenue,
}: RevenueBreakdownProps) {
  const roomsPercentage = totalRevenue > 0 ? ((roomsRevenue / totalRevenue) * 100).toFixed(0) : '0';
  const fAndBPercentage = totalRevenue > 0 ? ((fAndBRevenue / totalRevenue) * 100).toFixed(0) : '0';
  const otherPercentage = totalRevenue > 0 ? ((otherRevenue / totalRevenue) * 100).toFixed(0) : '0';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Revenue by Outlet</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="font-medium text-secondary-900">Rooms</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-secondary-900">${roomsRevenue.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">{roomsPercentage}%</p>
            </div>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${roomsPercentage}%` }}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="font-medium text-secondary-900">Food & Beverage</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-secondary-900">${fAndBRevenue.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">{fAndBPercentage}%</p>
            </div>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${fAndBPercentage}%` }}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="font-medium text-secondary-900">Other Services</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-secondary-900">${otherRevenue.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">{otherPercentage}%</p>
            </div>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${otherPercentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}


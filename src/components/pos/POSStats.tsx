'use client';

interface POSStatsProps {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  totalRevenue: number;
}

export default function POSStats({
  totalOrders,
  pendingOrders,
  preparingOrders,
  readyOrders,
  totalRevenue
}: POSStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="card text-center">
        <div className="text-2xl font-bold text-secondary-900">{totalOrders}</div>
        <div className="text-sm text-secondary-600">Total Orders</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
        <div className="text-sm text-secondary-600">Pending</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-blue-600">{preparingOrders}</div>
        <div className="text-sm text-secondary-600">Preparing</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-green-600">{readyOrders}</div>
        <div className="text-sm text-secondary-600">Ready</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-primary-600">${totalRevenue.toFixed(2)}</div>
        <div className="text-sm text-secondary-600">Total Revenue</div>
      </div>
    </div>
  );
}

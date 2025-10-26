'use client';

interface RevenueBreakdownProps {
  stats: any;
}

export default function RevenueBreakdown({ stats }: RevenueBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {formatCurrency(stats.revenue_by_outlet.rooms)}
          </div>
          <div className="text-sm text-gray-500">Rooms</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.revenue_by_outlet.f_and_b)}
          </div>
          <div className="text-sm text-gray-500">Food & Beverage</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {formatCurrency(stats.revenue_by_outlet.other)}
          </div>
          <div className="text-sm text-gray-500">Other Services</div>
        </div>
      </div>
    </div>
  );
}








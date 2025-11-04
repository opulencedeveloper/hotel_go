'use client';

import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import FeatureGuard from '@/components/auth/FeatureGuard';

interface AccountingDashboardProps {
  stats: any;
}

export default function AccountingDashboard({ stats }: AccountingDashboardProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureGuard permission="financials.view_revenue">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Today's Revenue</span>
              <span className="font-semibold text-green-600">{formatPrice(stats?.revenue_by_outlet?.rooms || 8450, selectedHotel?.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">F&B Revenue</span>
              <span className="font-semibold text-green-600">{formatPrice(stats?.revenue_by_outlet?.f_and_b || 2340, selectedHotel?.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Pending Payments</span>
              <span className="font-semibold text-orange-600">{stats?.pending_payments || 3}</span>
            </div>
          </div>
        </div>
        </FeatureGuard>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Transactions</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Room 201 - Payment</span>
              <span className="text-green-600">+$150.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Restaurant - Bill</span>
              <span className="text-green-600">+$45.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Room Service - Refund</span>
              <span className="text-red-600">-$25.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








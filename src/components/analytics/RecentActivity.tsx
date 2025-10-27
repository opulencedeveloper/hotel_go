'use client';

import { CheckCircle } from 'lucide-react';
import { formatPrice } from '@/helper';

interface Stay {
  _id: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount?: number;
  status: string;
}

interface RecentActivityProps {
  stays: Stay[];
  isClient: boolean;
  currency?: string;
}

export default function RecentActivity({ stays, isClient, currency }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Recent Activity</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {stays.slice(0, 5).map((stay) => (
            <div key={stay._id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    {stay.guestName}
                  </p>
                  <p className="text-xs text-secondary-600">
                    {isClient ? new Date(stay.checkInDate).toLocaleDateString() : '--/--/----'} - 
                    {isClient ? new Date(stay.checkOutDate).toLocaleDateString() : '--/--/----'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-secondary-900">{formatPrice(stay.totalAmount || 0, currency)}</p>
                <p className="text-xs text-secondary-600 capitalize">{stay.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

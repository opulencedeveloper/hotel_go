'use client';

import { DollarSign, Calendar, Bed, Users } from 'lucide-react';
import { formatPrice } from '@/helper';

interface KPICardsProps {
  totalRevenue: number;
  totalBookings: number;
  averageStay: number;
  occupancyRate: number;
  currency?: string;
}

export default function KPICards({
  totalRevenue,
  totalBookings,
  averageStay,
  occupancyRate,
  currency,
}: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(totalRevenue, currency)}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Bookings</p>
            <p className="text-2xl font-bold text-secondary-900">{totalBookings}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Average Stay</p>
            <p className="text-2xl font-bold text-secondary-900">{averageStay.toFixed(1)} nights</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Bed className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Occupancy Rate</p>
            <p className="text-2xl font-bold text-secondary-900">{occupancyRate.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

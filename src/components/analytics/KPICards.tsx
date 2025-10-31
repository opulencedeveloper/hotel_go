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
    <div className="space-y-6">
      {/* Primary KPI - Total Revenue (Featured) */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 shadow-lg border-2 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Total Revenue</p>
            </div>
            <p className="text-4xl font-bold text-green-900 mb-1">{formatPrice(totalRevenue, currency)}</p>
            <p className="text-sm text-green-700">All revenue sources combined</p>
          </div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-secondary-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-secondary-900">{totalBookings}</p>
            <p className="text-xs text-secondary-500 mt-2">Stay reservations</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-secondary-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Bed className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600 mb-1">Average Stay</p>
            <p className="text-3xl font-bold text-secondary-900">{averageStay.toFixed(1)}</p>
            <p className="text-xs text-secondary-500 mt-2">nights per booking</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-secondary-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600 mb-1">Occupancy Rate</p>
            <p className="text-3xl font-bold text-secondary-900">{occupancyRate.toFixed(1)}%</p>
            <p className="text-xs text-secondary-500 mt-2">rooms occupied</p>
          </div>
        </div>
      </div>
    </div>
  );
}

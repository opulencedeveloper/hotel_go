'use client';

import { DollarSign, Receipt, Calculator, PieChart } from 'lucide-react';
import { formatPrice } from '@/helper';

interface FinancialOverviewCardsProps {
  totalRevenue: number;
  scheduledServicesRevenue: number;
  roomsRevenue: number;
  fAndBRevenue: number;
  currency: string;
}

export default function FinancialOverviewCards({
  totalRevenue,
  scheduledServicesRevenue,
  roomsRevenue,
  fAndBRevenue,
  currency,
}: FinancialOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(totalRevenue, currency)}</p>
            <p className="text-sm text-green-600">All revenue sources combined</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Services Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(scheduledServicesRevenue, currency)}</p>
            <p className="text-sm text-indigo-600">Service bookings revenue</p>
          </div>
          <div className="p-3 bg-indigo-100 rounded-full">
            <PieChart className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Room Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(roomsRevenue, currency)}</p>
            <p className="text-sm text-blue-600">Active paid stays</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Calculator className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">F&B Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(fAndBRevenue, currency)}</p>
            <p className="text-sm text-purple-600">Food & beverage sales</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { DollarSign, Receipt, Calculator, PieChart } from 'lucide-react';

interface FinancialOverviewCardsProps {
  totalRevenue: number;
  totalOutstanding: number;
  roomsRevenue: number;
  fAndBRevenue: number;
  openFoliosCount: number;
}

export default function FinancialOverviewCards({
  totalRevenue,
  totalOutstanding,
  roomsRevenue,
  fAndBRevenue,
  openFoliosCount,
}: FinancialOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600">+12.5% vs last month</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Outstanding Balance</p>
            <p className="text-2xl font-bold text-secondary-900">${totalOutstanding.toLocaleString()}</p>
            <p className="text-sm text-orange-600">{openFoliosCount} open folios</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Receipt className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Room Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">${roomsRevenue.toLocaleString()}</p>
            <p className="text-sm text-blue-600">68% of total</p>
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
            <p className="text-2xl font-bold text-secondary-900">${fAndBRevenue.toLocaleString()}</p>
            <p className="text-sm text-purple-600">25% of total</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}


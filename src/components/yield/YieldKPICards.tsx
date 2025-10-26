'use client';

import { DollarSign, TrendingUp, BarChart3, Target } from 'lucide-react';

interface YieldMetrics {
  adr: number;
  revpar: number;
  occupancy: number;
  arr: number;
}

interface YieldKPICardsProps {
  metrics: YieldMetrics;
}

export default function YieldKPICards({ metrics }: YieldKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Current ADR</p>
              <p className="text-2xl font-bold text-secondary-900">${metrics.adr}</p>
              <p className="text-sm text-secondary-500">Average Daily Rate</p>
            </div>
          <div className="p-3 bg-green-100 rounded-full">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">RevPAR</p>
            <p className="text-2xl font-bold text-secondary-900">${metrics.revpar}</p>
            <p className="text-sm text-secondary-500">Revenue per Available Room</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Occupancy</p>
            <p className="text-2xl font-bold text-secondary-900">{metrics.occupancy}%</p>
            <p className="text-sm text-secondary-500">Current Occupancy Rate</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">ARR</p>
            <p className="text-2xl font-bold text-secondary-900">${metrics.arr}</p>
            <p className="text-sm text-secondary-500">Average Revenue per Room</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

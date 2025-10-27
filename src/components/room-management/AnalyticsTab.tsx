'use client';

import { TrendingUp, DollarSign, BarChart3, Calendar } from "lucide-react";

export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">
        Room Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Occupancy Rate
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                78.5%
              </p>
              <p className="text-sm text-green-600">
                +5.2% vs last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                ADR
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                $245
              </p>
              <p className="text-sm text-blue-600">
                +8.3% vs last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                RevPAR
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                $192
              </p>
              <p className="text-sm text-purple-600">
                +12.5% vs last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Average Stay
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                2.8 nights
              </p>
              <p className="text-sm text-orange-600">
                +0.3 vs last month
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









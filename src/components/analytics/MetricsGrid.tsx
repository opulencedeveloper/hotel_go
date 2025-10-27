'use client';

import { TrendingUp } from 'lucide-react';

interface Metric {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface MetricsGridProps {
  metrics: Metric[];
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Key Performance Metrics</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{metric.value}</h3>
                <p className="text-sm text-secondary-600">{metric.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

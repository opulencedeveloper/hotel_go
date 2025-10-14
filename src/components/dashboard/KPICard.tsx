'use client';

import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  period: string;
  mtd: string;
  ytd: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function KPICard({
  title,
  value,
  period,
  mtd,
  ytd,
  change,
  changeType,
  icon: Icon,
  color,
  bgColor
}: KPICardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          <p className="text-xs text-secondary-500">{period}</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-xs">
              <span className="text-secondary-500">MTD: </span>
              <span className="font-medium">{mtd}</span>
            </div>
            <div className="text-xs">
              <span className="text-secondary-500">YTD: </span>
              <span className="font-medium">{ytd}</span>
            </div>
          </div>
          <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change} vs yesterday
          </p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}


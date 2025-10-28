'use client';

import { DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/helper';

interface FolioStatsProps {
  totalFolios: number;
  openFolios: number;
  totalOutstanding: number;
  totalCharges: number;
  currency: string;
}

export default function FolioStats({ 
  totalFolios, 
  openFolios, 
  totalOutstanding, 
  totalCharges,
  currency
}: FolioStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Folios</p>
            <p className="text-2xl font-bold text-secondary-900">{totalFolios}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Open Folios</p>
            <p className="text-2xl font-bold text-yellow-600">{openFolios}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Outstanding</p>
            <p className="text-2xl font-bold text-red-600">{formatPrice(totalOutstanding, currency)}</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Charges</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(totalCharges, currency)}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}


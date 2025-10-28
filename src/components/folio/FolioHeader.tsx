'use client';

import { Plus } from 'lucide-react';

interface FolioHeaderProps {
  onAddCharge: () => void;
  onProcessPayment: () => void;
}

export default function FolioHeader({ onAddCharge, onProcessPayment }: FolioHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Payment Management</h1>
        <p className="text-secondary-600">Centralized payment processing for all hotel services</p>
      </div>
      <div className="flex space-x-2 mt-4 sm:mt-0">
        {/* <button 
          onClick={onAddCharge}
          className="btn-secondary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Charge
        </button>
        <button 
          onClick={onProcessPayment}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Process Payment
        </button> */}
      </div>
    </div>
  );
}

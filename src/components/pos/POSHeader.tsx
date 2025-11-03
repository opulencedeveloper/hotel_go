'use client';

import { Printer, Receipt } from 'lucide-react';

interface POSHeaderProps {
  onNewOrder: () => void;
}

export default function POSHeader({ onNewOrder }: POSHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Point of Sale</h1>
        <p className="text-secondary-600">Manage restaurant, bar, and mini-bar sales</p>
      </div>
      <div className="flex space-x-2 mt-4 sm:mt-0">
        {/* <button className="btn-secondary">
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </button> */}
        {/* <button 
          onClick={onNewOrder}
          className="btn-primary"
        >
          <Receipt className="w-4 h-4 mr-2" />
          New Order
        </button> */}
      </div>
    </div>
  );
}

'use client';

import { Users, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/helper';

interface Stay {
  _id: string;
  guestName: string;
  adults: number;
  children: number;
  paymentStatus: string;
  totalAmount?: number;
}

interface Order {
  _id: string;
  status: string;
  items: Array<{
    priceWhenOrdered: number;
    quantity: number;
  }>;
}

interface StatsSummaryProps {
  stays: Stay[];
  orders: Order[];
  currency?: string;
}

export default function StatsSummary({ stays, orders, currency }: StatsSummaryProps) {
  // Calculate total guests (adults + children)
  const totalGuests = stays.reduce((sum, stay) => sum + (stay.adults || 0) + (stay.children || 0), 0);
  
  // Calculate payment status breakdown
  const paidStays = stays.filter(stay => stay.paymentStatus?.toLowerCase().includes('paid')).length;
  const pendingStays = stays.filter(stay => stay.paymentStatus?.toLowerCase().includes('pending')).length;
  
  // Calculate orders statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'paid' || order.status === 'completed').length;
  
  // Calculate total revenue from paid stays
  const paidRevenue = stays
    .filter(stay => stay.paymentStatus?.toLowerCase().includes('paid'))
    .reduce((sum, stay) => sum + (stay.totalAmount || 0), 0);
  
  // Calculate pending revenue
  const pendingRevenue = stays
    .filter(stay => stay.paymentStatus?.toLowerCase().includes('pending'))
    .reduce((sum, stay) => sum + (stay.totalAmount || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Guests</p>
            <p className="text-2xl font-bold text-secondary-900">{totalGuests}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Paid Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(paidRevenue, currency)}</p>
            <p className="text-xs text-secondary-500">{paidStays} paid stays</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Pending Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(pendingRevenue, currency)}</p>
            <p className="text-xs text-secondary-500">{pendingStays} pending stays</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Orders</p>
            <p className="text-2xl font-bold text-secondary-900">{totalOrders}</p>
            <p className="text-xs text-secondary-500">{completedOrders} completed</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}


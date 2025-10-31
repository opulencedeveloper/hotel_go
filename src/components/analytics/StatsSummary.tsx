'use client';

import { Users, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/helper';
import { PaymentStatus } from '@/utils/enum';
import { OrderStatus } from '@/lib/server/order/enum';
import { useMemo } from 'react';

interface Stay {
  _id: string;
  guestName: string;
  adults: number;
  children: number;
  paymentStatus: string;
  checkInDate?: string;
  checkOutDate?: string;
  totalAmount?: number;
}

interface Order {
  _id: string;
  status: string;
  items: Array<{
    priceWhenOrdered: number;
    quantity: number;
  }>;
  discount?: number;
}

interface ScheduledService {
  _id: string;
  paymentStatus: string;
  totalAmount: number;
}

interface StatsSummaryProps {
  stays: Stay[];
  orders: Order[];
  scheduledServices?: ScheduledService[];
  currency?: string;
}

export default function StatsSummary({ stays, orders, scheduledServices = [], currency }: StatsSummaryProps) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Calculate total guests (adults + children)
  const totalGuests = useMemo(() => {
    return stays.reduce((sum, stay) => sum + (stay.adults || 0) + (stay.children || 0), 0);
  }, [stays]);

  // Calculate room revenue from stays
  // Only count stays where ALL conditions are met:
  // 1. checkInDate is in the past (guest has already checked in)
  // 2. Current date is within checkInDate and checkOutDate (active stay period)
  // 3. paymentStatus is PAID (only paid stays count as revenue)
  const paidRevenue = useMemo(() => {
    return stays.reduce((sum, stay) => {
      // Check if stay should be included in revenue
      const checkInDate = stay.checkInDate ? new Date(stay.checkInDate) : null;
      const checkOutDate = stay.checkOutDate ? new Date(stay.checkOutDate) : null;
      
      if (!checkInDate || !checkOutDate) return sum;
      
      // Set time to midnight for accurate date comparison
      const checkIn = new Date(checkInDate);
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(checkOutDate);
      checkOut.setHours(0, 0, 0, 0);
      
      // Check if checkInDate is in the past
      const isCheckInPast = checkIn <= today;
      
      // Check if today is within checkInDate and checkOutDate
      const isTodayWithinStayPeriod = today >= checkIn && today <= checkOut;
      
      // Check if payment status is PAID - only paid stays count as revenue
      const isPaid = stay.paymentStatus === PaymentStatus.PAID;
      
      // Only add revenue if ALL conditions are met
      if (isCheckInPast && isTodayWithinStayPeriod && isPaid) {
        return sum + (stay.totalAmount || 0);
      }
      
      return sum;
    }, 0);
  }, [stays, today]);

  // Calculate F&B revenue from orders
  // Only count orders with status = PAID (pending orders cannot be counted as revenue)
  const ordersRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      // Only include PAID orders - pending/ready/cancelled orders don't count as revenue
      if (order.status !== OrderStatus.PAID) return sum;
      
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (item.priceWhenOrdered * item.quantity);
      }, 0);
      return sum + orderTotal - (order.discount || 0);
    }, 0);
  }, [orders]);

  // Calculate scheduled services revenue
  // Include paid or pending services (they are bookings within the period)
  const scheduledServicesRevenue = useMemo(() => {
    return scheduledServices.reduce((sum, scheduledService) => {
      // Include paid or pending services
      // - Paid: Already collected revenue
      // - Pending: Booked but not yet paid (still counts as revenue for accounting purposes)
      if (scheduledService.paymentStatus !== PaymentStatus.PAID && scheduledService.paymentStatus !== PaymentStatus.PENDING) {
        return sum;
      }
      
      // Count the total amount (all scheduled services in period that are paid/pending)
      return sum + (scheduledService.totalAmount || 0);
    }, 0);
  }, [scheduledServices]);

  // Calculate scheduled services count
  const paidScheduledServices = useMemo(() => {
    return scheduledServices.filter(service => 
      service.paymentStatus === PaymentStatus.PAID || service.paymentStatus === PaymentStatus.PENDING
    ).length;
  }, [scheduledServices]);
  
  // Calculate payment status breakdown
  const paidStays = useMemo(() => {
    return stays.filter(stay => stay.paymentStatus === PaymentStatus.PAID).length;
  }, [stays]);
  
  const pendingStays = useMemo(() => {
    return stays.filter(stay => stay.paymentStatus === PaymentStatus.PENDING).length;
  }, [stays]);
  
  // Calculate orders statistics
  const totalOrders = useMemo(() => orders.length, [orders]);
  const completedOrders = useMemo(() => {
    return orders.filter(order => order.status === OrderStatus.PAID).length;
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center space-x-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary-300 to-transparent"></div>
        <h3 className="text-lg font-semibold text-secondary-900 px-4">Revenue Breakdown</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary-300 to-transparent"></div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md border border-blue-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-sm">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-700 mb-1">Room Revenue</p>
            <p className="text-2xl font-bold text-blue-900">{formatPrice(paidRevenue, currency)}</p>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-600">{paidStays} paid stays</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-md border border-orange-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-xl shadow-sm">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-orange-700 mb-1">F&B Revenue</p>
            <p className="text-2xl font-bold text-orange-900">{formatPrice(ordersRevenue, currency)}</p>
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="text-xs text-orange-600">{completedOrders} paid orders</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-md border border-indigo-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500 rounded-xl shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-700 mb-1">Services Revenue</p>
            <p className="text-2xl font-bold text-indigo-900">{formatPrice(scheduledServicesRevenue, currency)}</p>
            <div className="mt-3 pt-3 border-t border-indigo-200">
              <p className="text-xs text-indigo-600">{paidScheduledServices} bookings</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 shadow-md border border-secondary-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary-600 rounded-xl shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary-700 mb-1">Total Guests</p>
            <p className="text-2xl font-bold text-secondary-900">{totalGuests.toLocaleString()}</p>
            <div className="mt-3 pt-3 border-t border-secondary-200">
              <p className="text-xs text-secondary-600">All guests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


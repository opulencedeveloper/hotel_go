'use client';

import { PaymentStatus, StayStatus, OrderStatus } from '@/utils/enum';
import { 
  Bed,
  Utensils,
  Heart,
  Calendar,
  Tag
} from 'lucide-react';
import { formatPrice } from '@/helper';

interface ServiceCategoriesProps {
  stays: any[];
  orders: any[];
  scheduledServices?: any[];
  currency?: string;
  scheduledServicesRevenue?: number;
  onViewStays?: () => void;
  onViewOrders?: () => void;
  onViewPayments?: () => void;
  onViewDetails?: () => void;
  onViewServices?: () => void;
}

export default function ServiceCategories({ 
  stays, 
  orders,
  scheduledServices = [],
  currency = 'USD',
  scheduledServicesRevenue = 0,
  onViewStays, 
  onViewOrders, 
  onViewPayments, 
  onViewDetails,
  onViewServices 
}: ServiceCategoriesProps) {
  // Calculate actual data from Redux state
  const currentStays = [...stays].filter(stay => 
    stay.status === StayStatus.CHECKED_IN || stay.status === StayStatus.CONFIRMED
  );
  
  const pendingOrders = [...orders].filter(order => 
    order.status === OrderStatus.PENDING
  );
  
  const totalOrders = orders.length;
  const totalStays = stays.length;
  const totalScheduledServices = scheduledServices.length;
  
  // Scheduled services statistics
  const paidServices = scheduledServices.filter((s: any) => s.paymentStatus === PaymentStatus.PAID).length;
  const pendingServices = scheduledServices.filter((s: any) => s.paymentStatus === PaymentStatus.PENDING).length;
  const cancelledServices = scheduledServices.filter((s: any) => s.paymentStatus === PaymentStatus.CANCELLED).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Room Stays */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Bed className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-blue-600">Room Stays</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Total Stays</span>
            <span className="text-sm font-medium text-secondary-900">{totalStays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Current Guests</span>
            <span className="text-sm font-medium text-orange-600">{currentStays.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Checked In</span>
            <span className="text-sm font-medium text-green-600">
              {stays.filter(s => s.status === StayStatus.CHECKED_IN).length}
            </span>
          </div>
        </div>
        <button 
          onClick={onViewStays}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          View Stays
        </button>
      </div>

      {/* Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Utensils className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-600">Orders</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Total Orders</span>
            <span className="text-sm font-medium text-secondary-900">{totalOrders}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Pending Orders</span>
            <span className="text-sm font-medium text-orange-600">{pendingOrders.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Completed</span>
            <span className="text-sm font-medium text-green-600">
              {orders.filter(o => o.status === OrderStatus.PAID).length}
            </span>
          </div>
        </div>
        <button 
          onClick={onViewOrders}
          className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          View Orders
        </button>
      </div>

      {/* Payment Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Heart className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-purple-600">Payment Status</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Paid Stays</span>
            <span className="text-sm font-medium text-secondary-900">
              {stays.filter(s => s.paymentStatus === PaymentStatus.PAID).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Pending Payment</span>
            <span className="text-sm font-medium text-orange-600">
              {stays.filter(s => s.paymentStatus === PaymentStatus.PENDING).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Cancelled Payment</span>
            <span className="text-sm font-medium text-red-600">
              {stays.filter(s => s.paymentStatus === PaymentStatus.CANCELLED).length}
            </span>
          </div>
        </div>
        <button 
          onClick={onViewPayments}
          className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          View Payments
        </button>
      </div>

      {/* Scheduled Services */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Tag className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-indigo-600">Scheduled Services</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Total Services</span>
            <span className="text-sm font-medium text-secondary-900">{totalScheduledServices}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-600">Paid</span>
            <span className="text-sm font-medium text-green-600">{paidServices}</span>
          </div>
        </div>
        <button 
          onClick={onViewServices || onViewDetails}
          className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          View Services
        </button>
      </div>
    </div>
  );
}

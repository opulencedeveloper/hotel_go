'use client';

import { PaymentMethod, OrderStatus } from '@/utils/enum';
import { 
  CreditCard,
  DollarSign,
  Building2,
  CheckCircle,
  Clock
} from 'lucide-react';

interface PaymentOverviewProps {
  stays: any[];
  orders: any[];
}

export default function PaymentOverview({ stays, orders }: PaymentOverviewProps) {
  // Calculate payment method distribution from stays
  const paymentMethods = stays.reduce((acc, stay) => {
    const method = stay.paymentMethod || 'unknown';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalStays = stays.length;
  const recentStays = [...stays]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Methods Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {Object.entries(paymentMethods).map(([method, count]) => {
            const percentage = totalStays > 0 ? Math.round((count as number / totalStays) * 100) : 0;
            const methodIcons = {
              [PaymentMethod.CARD_PAYMENT]: CreditCard,
              [PaymentMethod.CASH]: DollarSign,
              [PaymentMethod.BANK_TRANSFER]: Building2,
              'default': CreditCard
            };
            const IconComponent = methodIcons[method as keyof typeof methodIcons] || methodIcons.default;
            const bgColor = method === PaymentMethod.CARD_PAYMENT ? 'blue' : method === PaymentMethod.CASH ? 'green' : 'purple';
            
            return (
              <div key={method} className={`flex items-center justify-between p-3 bg-${bgColor}-50 rounded-lg`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${bgColor}-100 rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 text-${bgColor}-600`} />
                  </div>
                  <span className="font-medium text-secondary-900 capitalize">
                    {method.replace('_', ' ')}
                  </span>
                </div>
                       <div className="text-right">
                         <div className="font-semibold text-secondary-900">{count as number}</div>
                         <div className="text-sm text-secondary-600">{percentage}% of total</div>
                       </div>
              </div>
            );
          })}
          {Object.keys(paymentMethods).length === 0 && (
            <div className="text-center text-secondary-500 py-4">
              No payment data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentStays.map((stay) => (
            <div key={stay._id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-secondary-900">
                    {stay.roomId?.roomNumber || 'N/A'} - {stay.guestName}
                  </div>
                  <div className="text-sm text-secondary-600">
                    {stay.paymentMethod} • {new Date(stay.checkInDate).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-secondary-900">{stay.status}</div>
              </div>
            </div>
          ))}
          
          {recentOrders.map((order) => (
            <div key={order._id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.status === OrderStatus.PAID ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {order.status === OrderStatus.PAID ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-secondary-900">
                    Order #{order._id.slice(-6)} - {order.orderType}
                  </div>
                  <div className="text-sm text-secondary-600">
                    {order.status} • {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-secondary-900">{order.items.length} items</div>
              </div>
            </div>
          ))}
          
          {recentStays.length === 0 && recentOrders.length === 0 && (
            <div className="text-center text-secondary-500 py-4">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

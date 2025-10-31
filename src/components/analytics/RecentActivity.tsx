'use client';

import { CheckCircle, Utensils, Calendar } from 'lucide-react';
import { formatPrice } from '@/helper';
import { useMemo } from 'react';

interface Stay {
  _id: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount?: number;
  status: string;
  createdAt?: string;
}

interface Order {
  _id: string;
  items: Array<{ menuId: { itemName: string }; quantity: number; priceWhenOrdered: number }>;
  status: string;
  createdAt: string;
  discount?: number;
}

interface ScheduledService {
  _id: string;
  hotelServiceId: { name: string; category: string };
  scheduledAt: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}

interface RecentActivityProps {
  stays: Stay[];
  orders?: Order[];
  scheduledServices?: ScheduledService[];
  isClient: boolean;
  currency?: string;
}

interface ActivityItem {
  id: string;
  type: 'stay' | 'order' | 'service';
  title: string;
  subtitle: string;
  amount: number;
  status: string;
  date: Date;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export default function RecentActivity({ stays, orders = [], scheduledServices = [], isClient, currency }: RecentActivityProps) {
  const activities = useMemo(() => {
    const allActivities: ActivityItem[] = [];

    // Add stays
    stays.forEach((stay) => {
      allActivities.push({
        id: stay._id,
        type: 'stay',
        title: stay.guestName,
        subtitle: isClient 
          ? `${new Date(stay.checkInDate).toLocaleDateString()} - ${new Date(stay.checkOutDate).toLocaleDateString()}`
          : 'Stay booking',
        amount: stay.totalAmount || 0,
        status: stay.status,
        date: new Date(stay.createdAt || stay.checkInDate),
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
      });
    });

    // Add orders
    orders.forEach((order) => {
      const totalAmount = order.items.reduce((sum, item) => 
        sum + (item.priceWhenOrdered * item.quantity), 0
      ) - (order.discount || 0);
      
      const itemNames = order.items.map(item => item.menuId?.itemName || 'Item').slice(0, 2).join(', ');
      const moreItems = order.items.length > 2 ? ` +${order.items.length - 2} more` : '';
      
      allActivities.push({
        id: order._id,
        type: 'order',
        title: itemNames + moreItems,
        subtitle: `Order #${order._id.slice(-6)}`,
        amount: totalAmount,
        status: order.status,
        date: new Date(order.createdAt),
        icon: <Utensils className="w-4 h-4" />,
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
      });
    });

    // Add scheduled services
    scheduledServices.forEach((service) => {
      allActivities.push({
        id: service._id,
        type: 'service',
        title: service.hotelServiceId.name,
        subtitle: `${service.hotelServiceId.category.replace('_', ' ')} • ${new Date(service.scheduledAt).toLocaleDateString()}`,
        amount: service.totalAmount,
        status: service.paymentStatus,
        date: new Date(service.createdAt),
        icon: <Calendar className="w-4 h-4" />,
        bgColor: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
      });
    });

    // Sort by date (most recent first) and take top 5
    return allActivities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [stays, orders, scheduledServices, isClient]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Recent Activity</h2>
      </div>
      <div className="p-6">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-secondary-500">
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`p-2 ${activity.bgColor} rounded-lg flex-shrink-0`}>
                    <div className={activity.iconColor}>
                      {activity.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-secondary-600 truncate">
                      {activity.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <p className="text-sm font-semibold text-secondary-900">{formatPrice(activity.amount, currency)}</p>
                  <p className="text-xs text-secondary-600 capitalize">{activity.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

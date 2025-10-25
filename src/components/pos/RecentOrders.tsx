'use client';

import { Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { POSOrder } from '@/types';

interface RecentOrdersProps {
  orders: POSOrder[];
  onViewOrder: (order: POSOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: POSOrder['status']) => void;
}

export default function RecentOrders({
  orders,
  onViewOrder,
  onUpdateOrderStatus
}: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <AlertCircle className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'served': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div key={order.order_id} className="flex items-center justify-between p-3 bg-secondary-50 rounded">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary-900">
                  Order #{order.order_id}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </div>
              <p className="text-xs text-secondary-600">
                {order.table_number && `Table ${order.table_number}`}
                {order.room_number && `Room ${order.room_number}`}
                {!order.table_number && !order.room_number && 'Takeout'}
              </p>
              <p className="text-xs text-secondary-600">
                ${order.total.toFixed(2)} • {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onViewOrder(order)}
                className="text-primary-600 hover:text-primary-700"
              >
                <Eye className="w-4 h-4" />
              </button>
              {order.status === 'pending' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.order_id, 'preparing')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Start
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.order_id, 'ready')}
                  className="text-green-600 hover:text-green-700"
                >
                  Ready
                </button>
              )}
              {order.status === 'ready' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.order_id, 'served')}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Served
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

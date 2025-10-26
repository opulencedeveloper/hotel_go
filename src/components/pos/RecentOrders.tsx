'use client';

import { Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Order } from '@/store/redux/order-slice';
import { OrderStatus } from '@/lib/server/order/enum';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatPrice } from '@/helper';

interface RecentOrdersProps {
  onViewOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function RecentOrders({
  onViewOrder,
  onUpdateOrderStatus
}: RecentOrdersProps) {

  const order = useSelector((state: RootState) => state.order);
  const hotel = useSelector((state: RootState) => state.hotel);
  const { orders: fetchedOrders } = order;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  console.log("fetchedOrders", fetchedOrders)
  
  // Filter orders to show only today's orders
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  const todaysOrders = fetchedOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= todayStart && orderDate < todayEnd;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {todaysOrders.slice(0, 5).map((order) => (
          <div key={order._id} className="flex items-center justify-between p-3 bg-secondary-50 rounded">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary-900">
                  Order #{order._id}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </div>
              <p className="text-xs text-secondary-600">
                {order.tableNumber && `Table ${order.tableNumber}`}
                {order.roomId && `Room ${order.roomId}`}
                {!order.tableNumber && !order.roomId && 'Takeout'}
              </p>
              <p className="text-xs text-secondary-600">
                {formatPrice(order.items.reduce((sum, item) => sum + (item.priceWhenOrdered * item.quantity), 0), selectedHotel?.currency)} • {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

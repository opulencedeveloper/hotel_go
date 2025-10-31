'use client';

import { X, Clock, AlertTriangle, CheckCircle, Utensils } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { OrderStatus, OrderType } from '@/utils/enum';
import { formatPrice } from '@/helper';

interface ViewOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewOrdersModal({ isOpen, onClose }: ViewOrdersModalProps) {
  // Get orders from Redux state
  const order = useSelector((state: RootState) => state.order);
  const hotel = useSelector((state: RootState) => state.hotel);
  const { orders: reduxOrders } = order;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  // Transform Redux orders to display format
  const orders = reduxOrders?.map((reduxOrder: any) => ({
    id: reduxOrder._id,
    customer: reduxOrder.orderType === OrderType.HOTEL_GUEST ? 'Hotel Guest' : 
              reduxOrder.orderType === OrderType.RESTAURANT ? 'Restaurant Customer' : 'Walk-in Customer',
    table: reduxOrder.tableNumber || reduxOrder.roomId || 'N/A',
    status: reduxOrder.status,
    orderTime: (() => {
      if (reduxOrder.createdAt) {
        const orderDate = new Date(reduxOrder.createdAt);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
        
        let relativeTime = '';
        if (diffInMinutes < 1) {
          relativeTime = 'Just now';
        } else if (diffInMinutes < 60) {
          relativeTime = `${diffInMinutes} min ago`;
        } else if (diffInMinutes < 1440) {
          const hours = Math.floor(diffInMinutes / 60);
          relativeTime = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
          const days = Math.floor(diffInMinutes / 1440);
          relativeTime = `${days} day${days > 1 ? 's' : ''} ago`;
        }
        
        return relativeTime;
      }
      return 'Unknown time';
    })(),
    total: reduxOrder.items?.reduce((sum: number, item: any) => sum + (item.priceWhenOrdered || 0), 0) || 0,
    itemCount: reduxOrder.items?.length || 0
  })) || [];

  // Calculate order counts by status
  const orderCounts = {
    pending: orders.filter(order => order.status === OrderStatus.PENDING).length,
    ready: orders.filter(order => order.status === OrderStatus.READY).length,
    paid: orders.filter(order => order.status === OrderStatus.PAID).length,
    cancelled: orders.filter(order => order.status === OrderStatus.CANCELLED).length,
  };

  // Helper function to get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-500';
      case OrderStatus.READY:
        return 'bg-green-500';
      case OrderStatus.PAID:
        return 'bg-blue-500';
      case OrderStatus.CANCELLED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Kitchen Orders</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{orderCounts.pending}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Ready</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{orderCounts.ready}</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Paid</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{orderCounts.paid}</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Cancelled</span>
              </div>
              <p className="text-2xl font-bold text-red-900">{orderCounts.cancelled}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-secondary-900">All Orders ({orders.length})</h3>
            <div className="space-y-2">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                  <p className="text-secondary-500 text-lg font-medium">No orders found</p>
                  <p className="text-secondary-400 text-sm">No orders have been placed yet</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${getStatusColor(order.status)} rounded-full`}></div>
                      <div>
                        <p className="font-medium text-secondary-900">Order #{order.id.slice(-6)}</p>
                        <p className="text-sm text-secondary-600">
                          {order.table} • {order.customer} • {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary-900">{formatPrice(order.total, selectedHotel?.currency)}</p>
                      <p className="text-xs text-secondary-600">{order.orderTime}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

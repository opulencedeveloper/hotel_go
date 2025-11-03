'use client';

import { X, Printer, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Order } from '@/store/redux/order-slice';
import { OrderStatus } from '@/lib/server/order/enum';
import { POSItem } from '@/types';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface OrderDetailsModalProps {
  order: Order | null;
  items: POSItem[];
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  items,
  onClose
}: OrderDetailsModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  if (!order) return null;

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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Order Details</h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-secondary-900">Order Information</h4>
              <p className="text-sm text-secondary-600">Order #: {order._id}</p>
              <p className="text-sm text-secondary-600">
                Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </p>
              <p className="text-sm text-secondary-600">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900">Location</h4>
              {order.tableNumber && (
                <p className="text-sm text-secondary-600">Table: {order.tableNumber}</p>
              )}
              {order.roomId && (
                <p className="text-sm text-secondary-600">Room: {order.roomId}</p>
              )}
              {!order.tableNumber && !order.roomId && (
                <p className="text-sm text-secondary-600">Takeout Order</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-secondary-900">Items</h4>
            <div className="space-y-2 mt-2">
              {order.items.map((item, index) => {
                const menuItem = items.find(i => i.item_id === item.menuId._id);
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-secondary-900">
                        {menuItem?.name || item.menuId.itemName}
                      </p>
                      <p className="text-xs text-secondary-600">
                        Qty: {item.quantity} × {formatPrice(item.priceWhenOrdered, selectedHotel?.currency)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-secondary-900">
                      {formatPrice(item.quantity * item.priceWhenOrdered, selectedHotel?.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-secondary-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-secondary-900">Total</span>
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(order.items.reduce((sum, item) => sum + (item.priceWhenOrdered * item.quantity), 0), selectedHotel?.currency)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
          {/* <button className="btn-primary">
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </button> */}
        </div>
      </div>
    </div>
  );
}

'use client';

import { X, Printer, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { POSOrder, POSItem } from '@/types';

interface OrderDetailsModalProps {
  order: POSOrder | null;
  items: POSItem[];
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  items,
  onClose
}: OrderDetailsModalProps) {
  if (!order) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <p className="text-sm text-secondary-600">Order #: {order.order_id}</p>
              <p className="text-sm text-secondary-600">
                Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </p>
              <p className="text-sm text-secondary-600">
                Created: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900">Location</h4>
              {order.table_number && (
                <p className="text-sm text-secondary-600">Table: {order.table_number}</p>
              )}
              {order.room_number && (
                <p className="text-sm text-secondary-600">Room: {order.room_number}</p>
              )}
              {!order.table_number && !order.room_number && (
                <p className="text-sm text-secondary-600">Takeout Order</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-secondary-900">Items</h4>
            <div className="space-y-2 mt-2">
              {order.items.map((item, index) => {
                const menuItem = items.find(i => i.item_id === item.item_id);
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-secondary-900">
                        {menuItem?.name || 'Unknown Item'}
                      </p>
                      <p className="text-xs text-secondary-600">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-secondary-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-secondary-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-secondary-900">Total</span>
              <span className="text-lg font-bold text-primary-600">${order.total.toFixed(2)}</span>
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
          <button className="btn-primary">
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

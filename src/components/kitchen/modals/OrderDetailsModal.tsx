'use client';

import { X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { OrderStatus } from '@/utils/enum';

interface Order {
  id: string;
  customer: string;
  table: string;
  status: OrderStatus;
  orderTime: string;
  paymentMethod?: string;
  items: Array<{
    name: string;
    category: string;
    price: number;
    status: 'pending' | 'cooking' | 'ready';
  }>;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOrderAction: (action: string, orderId: string) => void;
}

export default function OrderDetailsModal({ 
  isOpen, 
  onClose, 
  order, 
  onOrderAction 
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  // Helper function to get status info
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          text: 'Pending',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: <Clock className="w-4 h-4" />
        };
      case OrderStatus.READY:
        return {
          text: 'Ready',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case OrderStatus.PAID:
        return {
          text: 'Paid',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case OrderStatus.CANCELLED:
        return {
          text: 'Cancelled',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: <AlertCircle className="w-4 h-4" />
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Order Details - #{order.id}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary-50 rounded-lg p-4">
              <h3 className="font-medium text-secondary-900 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Customer:</span>
                  <span className="font-medium text-secondary-900">{order.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Table/Room:</span>
                  <span className="font-medium text-secondary-900">{order.table}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Order Time:</span>
                  <span className="font-medium text-secondary-900">{order.orderTime}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-4">
              <h3 className="font-medium text-secondary-900 mb-3">Order Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-600">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.text}</span>
                  </span>
                </div>
                {order.status === OrderStatus.PAID && order.paymentMethod && (
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Payment Method:</span>
                    <span className="font-medium text-secondary-900 capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <h3 className="font-medium text-secondary-900 mb-3">Order Items ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-secondary-200 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-secondary-900">{item.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'ready' ? 'bg-green-100 text-green-800' :
                        item.status === 'cooking' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 capitalize">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-secondary-500 mb-1">Price during order</div>
                    <span className="font-medium text-secondary-900">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-secondary-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-secondary-900">Total:</span>
                <span className="text-lg font-bold text-primary-600">
                  ${order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors"
            >
              Close
            </button>
            {order.status === OrderStatus.PENDING && (
              <>
                <button
                  onClick={() => onOrderAction('Mark Ready', order.id)}
                  className="btn-primary flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Ready
                </button>
                <button
                  onClick={() => onOrderAction('Cancel Order', order.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Order
                </button>
              </>
            )}
            {order.status === OrderStatus.READY && (
              <button
                onClick={() => onOrderAction('Mark Paid', order.id)}
                className="btn-primary flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Paid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

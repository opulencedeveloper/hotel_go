'use client';

import { Plus, Eye, Download, Utensils, Calendar } from 'lucide-react';
import { formatPrice } from '@/helper';
import { PaymentStatus } from '@/utils/enum';
import { OrderStatus } from '@/lib/server/order/enum';

interface Folio {
  folio_id: string;
  booking_id: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_address?: string;
  room_number?: string;
  room_id?: string;
  type?: string;
  check_in?: string;
  check_out?: string;
  adults?: number;
  children?: number;
  total_amount?: number;
  paid_amount?: number;
  charges: any[];
  payments: any[];
  balance: number;
  status: string;
  payment_status?: string;
  payment_method?: string;
  payment_date?: string;
}

interface Order {
  _id: string;
  items: Array<{ menuId: { itemName: string }; quantity: number; priceWhenOrdered: number }>;
  status: string;
  createdAt: string;
  discount?: number;
  tableNumber?: string;
  orderType?: string;
}

interface ScheduledService {
  _id: string;
  hotelServiceId: { name: string; category: string };
  scheduledAt: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}

interface UnifiedItem {
  id: string;
  type: 'stay' | 'order' | 'service';
  title: string;
  description: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
  paymentStatus?: string;
  date: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  originalData: Folio | Order | ScheduledService;
}

interface OpenFoliosTableProps {
  openFolios: Folio[];
  orders?: Order[];
  scheduledServices?: ScheduledService[];
  onNewFolio?: () => void;
  onViewFolio?: (item: Folio | Order | ScheduledService, type: 'stay' | 'order' | 'service') => void;
  onDownloadFolio?: (item: Folio | Order | ScheduledService) => void;
  currency: string;
}

export default function OpenFoliosTable({ openFolios, orders = [], scheduledServices = [], onNewFolio, onViewFolio, onDownloadFolio, currency }: OpenFoliosTableProps) {
  // Combine all items into unified structure
  const allItems: UnifiedItem[] = [];

  // Add open folios (stays)
  openFolios.forEach((folio) => {
    allItems.push({
      id: folio.folio_id,
      type: 'stay',
      title: folio.guest_name || 'N/A',
      description: `Room ${folio.room_number || 'N/A'} • ${folio.type || 'Booking'}`,
      amount: folio.total_amount || 0,
      paidAmount: folio.paid_amount || 0,
      balance: folio.balance,
      status: folio.status,
      paymentStatus: folio.payment_status,
      date: folio.check_in || '',
      icon: <Eye className="w-4 h-4" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      originalData: folio
    });
  });

  // Add pending/unpaid orders
  orders.forEach((order) => {
    if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.CANCELLED) {
      const orderTotal = order.items.reduce((sum, item) => 
        sum + (item.priceWhenOrdered * item.quantity), 0
      ) - (order.discount || 0);
      
      const itemNames = order.items.map(item => item.menuId?.itemName || 'Item').slice(0, 2).join(', ');
      const moreItems = order.items.length > 2 ? ` +${order.items.length - 2} more` : '';
      
      allItems.push({
        id: order._id,
        type: 'order',
        title: itemNames + moreItems,
        description: order.tableNumber ? `Table ${order.tableNumber}` : `Order #${order._id.slice(-6)}`,
        amount: orderTotal,
        paidAmount: 0,
        balance: orderTotal,
        status: order.status,
        paymentStatus: order.status === OrderStatus.PAID ? PaymentStatus.PAID : PaymentStatus.PENDING,
        date: order.createdAt,
        icon: <Utensils className="w-4 h-4" />,
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
        originalData: order
      });
    }
  });

  // Add pending/unpaid scheduled services
  scheduledServices.forEach((service) => {
    if (service.paymentStatus !== PaymentStatus.PAID && service.paymentStatus !== PaymentStatus.CANCELLED) {
      allItems.push({
        id: service._id,
        type: 'service',
        title: service.hotelServiceId.name,
        description: `${service.hotelServiceId.category.replace('_', ' ')} • ${new Date(service.scheduledAt).toLocaleDateString()}`,
        amount: service.totalAmount,
        paidAmount: 0,
        balance: service.totalAmount,
        status: 'pending',
        paymentStatus: service.paymentStatus,
        date: service.scheduledAt,
        icon: <Calendar className="w-4 h-4" />,
        bgColor: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        originalData: service
      });
    }
  });

  // Sort by date (most recent first)
  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary-900">Open Items</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 text-secondary-500">
            <p className="text-sm">No open items available</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string, type: 'stay' | 'order' | 'service') => {
    if (status === 'paid' || status === PaymentStatus.PAID || status === OrderStatus.PAID) {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'pending' || status === PaymentStatus.PENDING) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (status === 'cancelled' || status === PaymentStatus.CANCELLED || status === OrderStatus.CANCELLED) {
      return 'bg-red-100 text-red-800';
    }
    if (type === 'stay' && status === 'open') {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: 'stay' | 'order' | 'service') => {
    switch (type) {
      case 'stay':
        return 'Stay';
      case 'order':
        return 'Order';
      case 'service':
        return 'Service';
      default:
        return 'Item';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Open Items</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Item</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Description</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Total Amount</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Paid</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Balance</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item) => (
                <tr key={item.id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${item.bgColor} rounded-lg`}>
                        <div className={item.iconColor}>
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">{item.title}</p>
                        <p className="text-xs text-secondary-500">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'stay' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'order' ? 'bg-orange-100 text-orange-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary-600 text-sm">{item.description}</td>
                  <td className="py-3 px-4 text-secondary-900 font-medium">{formatPrice(item.amount, currency)}</td>
                  <td className="py-3 px-4 text-secondary-600">{formatPrice(item.paidAmount, currency)}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      item.balance > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {formatPrice(item.balance, currency)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status || item.paymentStatus || '', item.type)}`}>
                      {item.status || item.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onViewFolio && onViewFolio(item.originalData, item.type)}
                        className="p-2 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


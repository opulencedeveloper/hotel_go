'use client';

import { useState, useEffect } from 'react';
import { User, Bed, Printer, Mail, Eye, Clock, CheckCircle, AlertCircle, Utensils, Calendar, Tag } from 'lucide-react';
import { formatPrice } from '@/helper';

interface Folio {
  id: string;
  type: 'stay' | 'order' | 'service';
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  totalCharges: number;
  totalPayments: number;
  balance: number;
  status: string;
  lastActivity: string;
  orderItems?: string;
  serviceCategory?: string;
}

interface FolioTableProps {
  folios: Folio[];
  onViewFolio: (folio: Folio) => void;
  currency: string;
}

export default function FolioTable({ folios, onViewFolio, currency }: FolioTableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const getTypeIcon = (type: 'stay' | 'order' | 'service') => {
    switch (type) {
      case 'stay':
        return <Bed className="w-4 h-4 text-blue-600" />;
      case 'order':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'service':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      default:
        return <User className="w-4 h-4" />;
    }
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

  const getTypeColor = (type: 'stay' | 'order' | 'service') => {
    switch (type) {
      case 'stay':
        return 'bg-blue-100 text-blue-800';
      case 'order':
        return 'bg-orange-100 text-orange-800';
      case 'service':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string, type: 'stay' | 'order' | 'service') => {
    if (status === 'paid' || status === 'closed') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    if (type === 'stay' && (status === 'checked_in' || status === 'checked_out')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'closed': 
        return <CheckCircle className="w-4 h-4" />;
      case 'pending': 
        return <Clock className="w-4 h-4" />;
      case 'cancelled': 
        return <AlertCircle className="w-4 h-4" />;
      default: 
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Location/Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Date/Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Charges
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Payments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {folios.map((folio) => (
              <tr key={folio.id} className="hover:bg-secondary-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(folio.type)}`}>
                      {getTypeIcon(folio.type)}
                    </div>
                    <div className="ml-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(folio.type)}`}>
                        {getTypeLabel(folio.type)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-secondary-900">{folio.guest}</div>
                  <div className="text-xs text-secondary-500 mt-1">#{folio.id.slice(-6)}</div>
                  <div className="text-xs text-secondary-400 mt-1">{folio.lastActivity}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-secondary-900">{folio.room}</div>
                  {folio.type === 'order' && folio.orderItems && (
                    <div className="text-xs text-secondary-500 mt-1">{folio.orderItems}</div>
                  )}
                  {folio.type === 'service' && folio.serviceCategory && (
                    <div className="text-xs text-secondary-500 mt-1 capitalize">{folio.serviceCategory}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900">
                    {isClient ? (
                      folio.type === 'stay' 
                        ? `${new Date(folio.checkIn).toLocaleDateString()} - ${new Date(folio.checkOut).toLocaleDateString()}`
                        : new Date(folio.checkIn).toLocaleDateString()
                    ) : '--/--/----'}
                  </div>
                  {folio.type === 'service' && isClient && (
                    <div className="text-xs text-secondary-500 mt-1">
                      {new Date(folio.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {formatPrice(folio.totalCharges, currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {formatPrice(folio.totalPayments, currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    folio.balance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatPrice(folio.balance, currency)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(folio.status, folio.type)}`}>
                    {getStatusIcon(folio.status)}
                    <span className="ml-1 capitalize">{folio.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewFolio(folio)}
                      className="text-primary-600 hover:text-primary-900"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* <button className="text-secondary-600 hover:text-secondary-900" title="Print">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Email">
                      <Mail className="w-4 h-4" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Bed, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Eye, 
  Edit,
  Printer
} from 'lucide-react';
import { Booking } from '@/types';

interface BookingTableProps {
  bookings: Booking[];
  onViewBooking: (booking: Booking) => void;
  onEditBooking: (booking: Booking) => void;
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
  onPrintReceipt: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  onViewBooking,
  onEditBooking,
  onCheckIn,
  onCheckOut,
  onPrintReceipt
}: BookingTableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Clock className="w-4 h-4" />;
      case 'checked-in': return <CheckCircle className="w-4 h-4" />;
      case 'checked-out': return <X className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'no-show': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Guest
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Room
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Check-in
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Check-out
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Amount
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
          {bookings.map((booking) => (
            <tr key={booking.booking_id} className="hover:bg-secondary-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-secondary-900">
                      {booking.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest'}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {booking.guest?.email || 'No email'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 text-secondary-400 mr-2" />
                  <span className="text-sm text-secondary-900">
                    {booking.allocations?.[0]?.room_id || 'TBD'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                {isClient ? new Date(booking.arrival_date).toLocaleDateString() : '--/--/----'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                {isClient ? new Date(booking.departure_date).toLocaleDateString() : '--/--/----'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-secondary-400 mr-1" />
                  <span className="text-sm font-medium text-secondary-900">
                    ${booking.total_amount}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-1 capitalize">{booking.status.replace('-', ' ')}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewBooking(booking)}
                    className="text-primary-600 hover:text-primary-900"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditBooking(booking)}
                    className="text-secondary-600 hover:text-secondary-900"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onPrintReceipt(booking)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => onCheckIn(booking.booking_id)}
                      className="text-green-600 hover:text-green-900 text-xs"
                    >
                      Check In
                    </button>
                  )}
                  {booking.status === 'checked-in' && (
                    <button
                      onClick={() => onCheckOut(booking.booking_id)}
                      className="text-blue-600 hover:text-blue-900 text-xs"
                    >
                      Check Out
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


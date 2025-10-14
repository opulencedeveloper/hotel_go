'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Eye, 
  Bed, 
  Edit, 
  Printer, 
  Building, 
  Plane,
  CheckCircle,
  Clock,
  UserCheck,
  X
} from 'lucide-react';
import { Booking } from '@/types';

interface GuestCardProps {
  booking: Booking;
  type: 'arrival' | 'departure' | 'inhouse';
  folio?: any;
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onRoomAssignment?: (booking: Booking) => void;
  onCheckIn?: (booking: Booking) => void;
  onCheckOut?: (booking: Booking) => void;
  onPrintReceipt?: (type: 'checkin' | 'checkout', guest: any) => void;
}

export default function GuestCard({
  booking,
  type,
  folio,
  onView,
  onEdit,
  onRoomAssignment,
  onCheckIn,
  onCheckOut,
  onPrintReceipt
}: GuestCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'checked-in': return <UserCheck className="w-4 h-4" />;
      case 'checked-out': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCardColor = () => {
    switch (type) {
      case 'arrival': return 'bg-primary-100';
      case 'departure': return 'bg-blue-100';
      case 'inhouse': return 'bg-green-100';
      default: return 'bg-primary-100';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'arrival': return 'text-primary-600';
      case 'departure': return 'text-blue-600';
      case 'inhouse': return 'text-green-600';
      default: return 'text-primary-600';
    }
  };

  const nights = type === 'inhouse' ? 
    Math.ceil((new Date(booking.departure_date).getTime() - new Date(booking.arrival_date).getTime()) / (1000 * 60 * 60 * 24)) : 
    null;

  return (
    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${getCardColor()} rounded-full flex items-center justify-center`}>
          <User className={`w-6 h-6 ${getIconColor()}`} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-secondary-900">
              {booking.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest'}
            </h4>
            {booking.source === 'corporate' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Building className="w-3 h-3 mr-1" />
                Corporate
              </span>
            )}
            {booking.source === 'ota' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Plane className="w-3 h-3 mr-1" />
                OTA
              </span>
            )}
          </div>
          <p className="text-sm text-secondary-600">
            {type === 'arrival' && `Booking: ${booking.booking_id} • Party of ${booking.adults + booking.children}`}
            {type === 'departure' && `Room ${booking.allocations?.[0]?.room_id || 'TBD'} • Booking: ${booking.booking_id}`}
            {type === 'inhouse' && `Room ${booking.allocations?.[0]?.room_id || 'TBD'} • ${nights} nights`}
          </p>
          <p className="text-sm text-secondary-500">
            {type === 'arrival' && `${booking.guest?.email || 'No email'} • ${booking.guest?.phone || 'No phone'}`}
            {type === 'departure' && `Check-in: ${isClient ? new Date(booking.arrival_date).toLocaleDateString() : '--/--/----'}`}
            {type === 'inhouse' && `Check-in: ${isClient ? new Date(booking.arrival_date).toLocaleDateString() : '--/--/----'}`}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-secondary-900">
            {type === 'arrival' && (isClient ? new Date(booking.arrival_date).toLocaleDateString() : '--/--/----')}
            {type === 'departure' && (isClient ? new Date(booking.departure_date).toLocaleDateString() : '--/--/----')}
            {type === 'inhouse' && `Balance: $${folio?.balance || 0}`}
          </p>
          {type === 'arrival' && (
            <p className="text-sm text-secondary-600">${booking.total_amount}</p>
          )}
          {type === 'departure' && (
            <p className={`text-sm font-medium ${
              folio && folio.balance > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              Balance: ${folio?.balance || 0}
            </p>
          )}
          {type === 'inhouse' && (
            <p className="text-sm text-secondary-600">
              Check-out: {isClient ? new Date(booking.departure_date).toLocaleDateString() : '--/--/----'}
            </p>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            type === 'departure' && folio && folio.balance > 0 ? 'bg-red-100 text-red-800' : 
            type === 'departure' ? 'bg-green-100 text-green-800' :
            type === 'inhouse' ? 'bg-green-100 text-green-800' :
            getStatusColor(booking.status)
          }`}>
            {type === 'inhouse' ? (
              <>
                <UserCheck className="w-3 h-3 mr-1" />
                In-House
              </>
            ) : type === 'departure' ? (
              folio && folio.balance > 0 ? 'Outstanding' : 'Settled'
            ) : (
              <>
                {getStatusIcon(booking.status)}
                <span className="ml-1 capitalize">{booking.status.replace('-', ' ')}</span>
              </>
            )}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(booking)}
            className="text-primary-600 hover:text-primary-700 p-2"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {type === 'arrival' && onRoomAssignment && (
            <button
              onClick={() => onRoomAssignment(booking)}
              className="text-secondary-600 hover:text-secondary-700 p-2"
              title="Assign Room"
            >
              <Bed className="w-4 h-4" />
            </button>
          )}
          {type === 'departure' && onPrintReceipt && (
            <button
              onClick={() => onPrintReceipt('checkout', booking)}
              className="text-secondary-600 hover:text-secondary-700 p-2"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}
          {type === 'inhouse' && onPrintReceipt && (
            <button
              onClick={() => onPrintReceipt('checkin', booking)}
              className="text-orange-600 hover:text-orange-700 p-2"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}
          {type === 'inhouse' && onEdit && (
            <button
              onClick={() => onEdit(booking)}
              className="text-secondary-600 hover:text-secondary-700 p-2"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {type === 'arrival' && onCheckIn && (
            <button
              onClick={() => onCheckIn(booking)}
              className="btn-primary text-sm"
            >
              Check In
            </button>
          )}
          {type === 'departure' && onCheckOut && (
            <button
              onClick={() => onCheckOut(booking)}
              className="btn-primary text-sm"
            >
              Check Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

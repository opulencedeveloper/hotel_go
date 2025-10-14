'use client';

import { 
  User, 
  Bed, 
  DollarSign, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
}

export default function BookingCard({ booking, onView, onEdit }: BookingCardProps) {
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
    <div className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-secondary-900">
              {booking.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest'}
            </div>
            <div className="text-xs text-secondary-500">
              {booking.source} booking
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {getStatusIcon(booking.status)}
          <span className="ml-1 capitalize">{booking.status.replace('-', ' ')}</span>
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-secondary-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(booking.arrival_date).toLocaleDateString()} - {new Date(booking.departure_date).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <Bed className="w-4 h-4 mr-2" />
          {booking.allocations?.[0]?.room_id || 'Room TBD'}
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          ${booking.total_amount}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          {booking.adults} adults, {booking.children} children
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onView(booking)}
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          View
        </button>
        <button
          onClick={() => onEdit(booking)}
          className="text-secondary-600 hover:text-secondary-700 text-sm"
        >
          Edit
        </button>
      </div>
    </div>
  );
}


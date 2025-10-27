'use client';

import { AlertCircle, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface BookingsBreakdownProps {
  bookingsByStatus: {
    confirmed: number;
    checkedIn: number;
    checkedOut: number;
    cancelled: number;
  };
  currency?: string;
}

export default function BookingsBreakdown({ bookingsByStatus, currency }: BookingsBreakdownProps) {
  const total = bookingsByStatus.confirmed + bookingsByStatus.checkedIn + 
                bookingsByStatus.checkedOut + bookingsByStatus.cancelled;

  if (total === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Bookings Status</h2>
        <p className="text-sm text-secondary-500 text-center py-8">No bookings data available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'checked_in':
        return 'bg-green-500';
      case 'checked_out':
        return 'bg-purple-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Calendar className="w-4 h-4" />;
      case 'checked_in':
        return <Clock className="w-4 h-4" />;
      case 'checked_out':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'checked_in':
        return 'Checked In';
      case 'checked_out':
        return 'Checked Out';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const statuses = [
    { key: 'confirmed', label: 'Confirmed', value: bookingsByStatus.confirmed },
    { key: 'checked_in', label: 'Checked In', value: bookingsByStatus.checkedIn },
    { key: 'checked_out', label: 'Checked Out', value: bookingsByStatus.checkedOut },
    { key: 'cancelled', label: 'Cancelled', value: bookingsByStatus.cancelled },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Bookings Status</h2>
        <p className="text-sm text-secondary-600 mt-1">Breakdown by status</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {statuses.map((status) => {
            const percentage = total > 0 ? ((status.value / total) * 100).toFixed(1) : '0';
            return (
              <div key={status.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 ${getStatusColor(status.key)} rounded-full`}></div>
                    <span className="text-sm font-medium text-secondary-900">{status.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-secondary-900">{status.value}</span>
                    <span className="text-xs text-secondary-600 ml-2">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`${getStatusColor(status.key)} h-2 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-secondary-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{total}</p>
              <p className="text-xs text-secondary-600 mt-1">Total Bookings</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {bookingsByStatus.checkedIn + bookingsByStatus.checkedOut}
              </p>
              <p className="text-xs text-secondary-600 mt-1">Active/Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

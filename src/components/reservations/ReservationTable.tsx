'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/redux';
import { Reservation } from '@/store/slices/reservationsSlice';
import { useReservationsService } from '@/services/reservationsService';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRole } from '@/lib/auth';
import StatusBadge from '@/components/common/StatusBadge';

interface ReservationTableProps {
  reservations: Reservation[];
  onEdit?: (reservation: Reservation) => void;
  onView?: (reservation: Reservation) => void;
}

export const ReservationTable = ({ reservations, onEdit, onView }: ReservationTableProps) => {
  const { checkInGuest, checkOutGuest, cancelReservation, isLoading } = useReservationsService();
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'checked-out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckIn = async (reservationId: string) => {
    try {
      await checkInGuest(reservationId);
    } catch (error) {
      console.error('Error checking in guest:', error);
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    try {
      await checkOutGuest(reservationId);
    } catch (error) {
      console.error('Error checking out guest:', error);
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(reservationId);
      } catch (error) {
        console.error('Error cancelling reservation:', error);
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReservations(reservations.map(r => r.id));
    } else {
      setSelectedReservations([]);
    }
  };

  const handleSelectReservation = (reservationId: string, checked: boolean) => {
    if (checked) {
      setSelectedReservations(prev => [...prev, reservationId]);
    } else {
      setSelectedReservations(prev => prev.filter(id => id !== reservationId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Reservations ({reservations.length})
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {selectedReservations.length} selected
            </span>
            <RoleGuard allowedRoles={['admin', 'manager']}>
              <button
                onClick={() => {/* Handle bulk actions */}}
                disabled={selectedReservations.length === 0}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
              >
                Bulk Actions
              </button>
            </RoleGuard>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedReservations.length === reservations.length && reservations.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedReservations.includes(reservation.id)}
                    onChange={(e) => handleSelectReservation(reservation.id, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.guest?.firstName} {reservation.guest?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reservation.guest?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Room {reservation.room?.room_number}
                  </div>
                  <div className="text-sm text-gray-500">
                    Floor {reservation.room?.floor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(reservation.checkIn)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(reservation.checkOut)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge 
                    status={reservation.status}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(reservation.totalAmount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Paid: {formatCurrency(reservation.paidAmount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView?.(reservation)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </button>
                    
                    <RoleGuard allowedRoles={['admin', 'manager', 'front_desk']}>
                      <button
                        onClick={() => onEdit?.(reservation)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    </RoleGuard>

                    {reservation.status === 'confirmed' && (
                      <RoleGuard allowedRoles={['admin', 'manager', 'front_desk']}>
                        <button
                          onClick={() => handleCheckIn(reservation.id)}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Check In
                        </button>
                      </RoleGuard>
                    )}

                    {reservation.status === 'checked-in' && (
                      <RoleGuard allowedRoles={['admin', 'manager', 'front_desk']}>
                        <button
                          onClick={() => handleCheckOut(reservation.id)}
                          disabled={isLoading}
                          className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                        >
                          Check Out
                        </button>
                      </RoleGuard>
                    )}

                    {reservation.status !== 'checked-out' && reservation.status !== 'cancelled' && (
                      <RoleGuard allowedRoles={['admin', 'manager']}>
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </RoleGuard>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reservations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new reservation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

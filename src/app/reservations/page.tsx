'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Bed, 
  DollarSign,
  CheckCircle,
  Clock,
  X,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { mockReservations, mockGuests, mockRooms } from '@/data/mockData';
import { Reservation } from '@/types';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guest?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.guest?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.room?.number.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Clock className="w-4 h-4" />;
      case 'checked-in': return <CheckCircle className="w-4 h-4" />;
      case 'checked-out': return <X className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleCheckIn = (reservationId: string) => {
    setReservations(prev => prev.map(res => 
      res.id === reservationId ? { ...res, status: 'checked-in' as const } : res
    ));
  };

  const handleCheckOut = (reservationId: string) => {
    setReservations(prev => prev.map(res => 
      res.id === reservationId ? { ...res, status: 'checked-out' as const } : res
    ));
  };

  const handleCancel = (reservationId: string) => {
    setReservations(prev => prev.map(res => 
      res.id === reservationId ? { ...res, status: 'cancelled' as const } : res
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Reservations</h1>
            <p className="text-secondary-600">Manage guest reservations and check-ins</p>
          </div>
          <button 
            onClick={() => setShowNewReservation(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Reservation
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by guest name or room number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="btn-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="card">
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
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {reservation.guest?.firstName} {reservation.guest?.lastName}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {reservation.guest?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 text-secondary-400 mr-2" />
                        <span className="text-sm text-secondary-900">
                          Room {reservation.room?.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {new Date(reservation.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {new Date(reservation.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-secondary-400 mr-1" />
                        <span className="text-sm font-medium text-secondary-900">
                          ${reservation.totalAmount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="ml-1 capitalize">{reservation.status.replace('-', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleCheckIn(reservation.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Check In
                          </button>
                        )}
                        {reservation.status === 'checked-in' && (
                          <button
                            onClick={() => handleCheckOut(reservation.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Check Out
                          </button>
                        )}
                        {reservation.status !== 'cancelled' && reservation.status !== 'checked-out' && (
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Reservation Modal */}
        {showNewReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">New Reservation</h3>
                <button
                  onClick={() => setShowNewReservation(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Guest Name
                    </label>
                    <input type="text" className="input" placeholder="Enter guest name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Email
                    </label>
                    <input type="email" className="input" placeholder="Enter email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Phone
                    </label>
                    <input type="tel" className="input" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Room
                    </label>
                    <select className="input">
                      <option value="">Select room</option>
                      {mockRooms.filter(room => room.status === 'available').map(room => (
                        <option key={room.id} value={room.id}>
                          Room {room.number} - {room.type} (${room.price}/night)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Check-in Date
                    </label>
                    <input type="date" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Check-out Date
                    </label>
                    <input type="date" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Adults
                    </label>
                    <input type="number" min="1" className="input" defaultValue="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Children
                    </label>
                    <input type="number" min="0" className="input" defaultValue="0" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Special Requests
                  </label>
                  <textarea 
                    className="input" 
                    rows={3} 
                    placeholder="Any special requests or notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewReservation(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reservation Details Modal */}
        {selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Reservation Details</h3>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-secondary-900">Guest Information</h4>
                    <p className="text-sm text-secondary-600">
                      {selectedReservation.guest?.firstName} {selectedReservation.guest?.lastName}
                    </p>
                    <p className="text-sm text-secondary-600">{selectedReservation.guest?.email}</p>
                    <p className="text-sm text-secondary-600">{selectedReservation.guest?.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Reservation Details</h4>
                    <p className="text-sm text-secondary-600">
                      Room: {selectedReservation.room?.number}
                    </p>
                    <p className="text-sm text-secondary-600">
                      Check-in: {new Date(selectedReservation.checkIn).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-secondary-600">
                      Check-out: {new Date(selectedReservation.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-secondary-900">Payment Information</h4>
                  <p className="text-sm text-secondary-600">
                    Total Amount: ${selectedReservation.totalAmount}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Paid Amount: ${selectedReservation.paidAmount}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Balance: ${selectedReservation.totalAmount - selectedReservation.paidAmount}
                  </p>
                </div>
                
                {selectedReservation.specialRequests && (
                  <div>
                    <h4 className="font-medium text-secondary-900">Special Requests</h4>
                    <p className="text-sm text-secondary-600">{selectedReservation.specialRequests}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Edit Reservation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

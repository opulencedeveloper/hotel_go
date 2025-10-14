'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchPanel from '@/components/reservations/SearchPanel';
import BookingTable from '@/components/reservations/BookingTable';
import BookingCard from '@/components/reservations/BookingCard';
import Modal from '@/components/common/Modal';
import { 
  Plus,
  Users,
  Grid,
  List,
  Download,
  X
} from 'lucide-react';
import { 
  mockBookings, 
  mockGuests, 
  mockRooms, 
  mockRoomTypes, 
  mockRatePlans,
  mockProperties 
} from '@/data/mockData';
import { Booking, Room, RoomType, RatePlan, Guest } from '@/types';

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(mockRoomTypes);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>(mockRatePlans);
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  
  // Search & Availability Panel
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    roomType: '',
    ratePlan: ''
  });
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showGroupBooking, setShowGroupBooking] = useState(false);
  const [showRateRules, setShowRateRules] = useState(false);
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [overbookingAlerts, setOverbookingAlerts] = useState<string[]>([]);

  // Search availability
  const searchAvailability = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return;
    
    const availableRooms = rooms.filter(room => {
      // Check if room is available for the selected dates
      const isBooked = bookings.some(booking => 
        booking.allocations?.some(allocation => 
          allocation.room_id === room.room_id &&
          ((searchParams.checkIn >= allocation.check_in_date && searchParams.checkIn < allocation.check_out_date) ||
           (searchParams.checkOut > allocation.check_in_date && searchParams.checkOut <= allocation.check_out_date))
        )
      );
      
      return !isBooked && room.status === 'available';
    });
    
    setSearchResults(availableRooms);
    
    // Check for overbooking risk
    const totalRooms = rooms.length;
    const requestedRooms = 1; // For now, assuming 1 room per search
    const occupancyRate = (bookings.length / totalRooms) * 100;
    
    if (occupancyRate > 90) {
      setOverbookingAlerts(['High occupancy risk - consider closing to arrival']);
    } else {
      setOverbookingAlerts([]);
    }
  };

  useEffect(() => {
    searchAvailability();
  }, [searchParams]);


  const handleBookingAction = (bookingId: string, action: string) => {
    setBookings(prev => prev.map(booking => 
      booking.booking_id === bookingId 
        ? { ...booking, status: action as any }
        : booking
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Reservations & Booking</h1>
            <p className="text-secondary-600">Manage bookings, availability, and rate rules</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button 
              onClick={() => setShowGroupBooking(true)}
              className="btn-secondary"
            >
              <Users className="w-4 h-4 mr-2" />
              Group Booking
            </button>
            <button 
              onClick={() => setShowNewBooking(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </button>
          </div>
        </div>

        {/* Search & Availability Panel */}
        <SearchPanel
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          roomTypes={roomTypes}
          ratePlans={ratePlans}
          searchResults={searchResults}
          overbookingAlerts={overbookingAlerts}
          onRateRulesClick={() => setShowRateRules(true)}
        />

        {/* Booking Grid/Calendar View */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Booking Grid</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button className="btn-secondary text-sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <BookingTable
              bookings={bookings}
              onViewBooking={setSelectedBooking}
              onEditBooking={setSelectedBooking}
              onCheckIn={(bookingId) => handleBookingAction(bookingId, 'checked-in')}
              onCheckOut={(bookingId) => handleBookingAction(bookingId, 'checked-out')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.booking_id}
                  booking={booking}
                  onView={setSelectedBooking}
                  onEdit={setSelectedBooking}
                />
              ))}
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-secondary-900">Guest Information</h4>
                  {selectedBooking.guest ? (
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedBooking.guest.firstName} {selectedBooking.guest.lastName}</p>
                      <p><span className="font-medium">Email:</span> {selectedBooking.guest.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedBooking.guest.phone}</p>
                      <p><span className="font-medium">Nationality:</span> {selectedBooking.guest.nationality}</p>
                      <p><span className="font-medium">ID:</span> {selectedBooking.guest.idNumber}</p>
                      {selectedBooking.guest.loyaltyPoints > 0 && (
                        <p><span className="font-medium">Loyalty Points:</span> {selectedBooking.guest.loyaltyPoints}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary-500">No guest information available</p>
                  )}
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-secondary-900">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Booking ID:</span> {selectedBooking.booking_id}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)}
                        <span className="ml-1 capitalize">{selectedBooking.status.replace('-', ' ')}</span>
                      </span>
                    </p>
                    <p><span className="font-medium">Source:</span> {selectedBooking.source}</p>
                    <p><span className="font-medium">Check-in:</span> {new Date(selectedBooking.arrival_date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Check-out:</span> {new Date(selectedBooking.departure_date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Guests:</span> {selectedBooking.adults} adults, {selectedBooking.children} children</p>
                    <p><span className="font-medium">Total Amount:</span> ${selectedBooking.total_amount}</p>
                    {selectedBooking.special_requests && (
                      <p><span className="font-medium">Special Requests:</span> {selectedBooking.special_requests}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Edit Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Booking Modal */}
        {showNewBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">New Booking</h3>
                <button
                  onClick={() => setShowNewBooking(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-6">
                {/* Guest Information */}
                <div>
                  <h4 className="font-medium text-secondary-900 mb-3">Guest Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        First Name
                      </label>
                      <input type="text" className="input" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Last Name
                      </label>
                      <input type="text" className="input" placeholder="Enter last name" />
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
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h4 className="font-medium text-secondary-900 mb-3">Booking Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Room Type
                      </label>
                      <select className="input">
                        <option value="">Select room type</option>
                        {roomTypes.map(type => (
                          <option key={type.room_type_id} value={type.room_type_id}>
                            {type.name} - ${type.base_rate}/night
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Rate Plan
                      </label>
                      <select className="input">
                        <option value="">Select rate plan</option>
                        {ratePlans.map(plan => (
                          <option key={plan.rate_plan_id} value={plan.rate_plan_id}>
                            {plan.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Adults
                      </label>
                      <input type="number" min="1" className="input" defaultValue="2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Children
                      </label>
                      <input type="number" min="0" className="input" defaultValue="0" />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
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
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowNewBooking(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rate Rules Modal */}
        {showRateRules && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Rate Rules Editor</h3>
                <button
                  onClick={() => setShowRateRules(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {ratePlans.map(plan => (
                    <div key={plan.rate_plan_id} className="border border-secondary-200 rounded-lg p-4">
                      <h4 className="font-medium text-secondary-900 mb-3">{plan.name}</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Code:</span> {plan.code}</p>
                        <p><span className="font-medium">Min LOS:</span> {plan.rules.min_los} nights</p>
                        <p><span className="font-medium">Max LOS:</span> {plan.rules.max_los} nights</p>
                        <p><span className="font-medium">Advance Booking:</span> {plan.rules.advance_booking_days} days</p>
                        <p><span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {plan.status}
                          </span>
                        </p>
                      </div>
                      <div className="mt-3">
                        <button className="btn-secondary text-sm">
                          Edit Rules
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setShowRateRules(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Add New Rate Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/app/(dashboard)/layout';
import QuickActions from '@/components/front-desk/QuickActions';
import GuestCard from '@/components/front-desk/GuestCard';
import Modal from '@/components/common/Modal';
import { 
  Search,
  Plus,
  Printer,
  RefreshCw,
  Wifi,
  WifiOff,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  User,
  Building,
  Plane,
  X,
  Bed,
  Clock,
  History
} from 'lucide-react';
// Removed mock data imports - using Redux state instead
import { Room, RoomType, Folio } from '@/types';
import { StaySliceParams } from '@/store/redux/stay-slice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { stayActions } from '@/store/redux/stay-slice';
import { StayStatus } from '@/utils/enum';

export default function FrontDeskBody() {
  const [selectedTab, setSelectedTab] = useState('arrivals');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showRoomAssignment, setShowRoomAssignment] = useState(false);
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const dispatch = useDispatch();
  const stay = useSelector((state: RootState) => state.stay);
  const room = useSelector((state: RootState) => state.room);
  const hotel = useSelector((state: RootState) => state.hotel);
  const { stays } = stay;
  const { hotelRooms, hotelRoomTypes } = room;

  // Use Redux data instead of mock data
  const rooms = hotelRooms || [];
  const roomTypes = hotelRoomTypes || [];
  const folios: Folio[] = []; // TODO: Add folio slice to Redux store

  // New Reservation Form State
  const [newReservationForm, setNewReservationForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    roomType: '',
    specialRequests: ''
  });

  // Use Redux stays data directly
  const staysData = useMemo(() => {
    console.log('FrontDesk stays data:', stays);
    return stays || [];
  }, [stays]);

  // Filter data based on current date and status
  const today = new Date().toISOString().split('T')[0];
  const todayISO = new Date().toISOString();

  console.log('Today:', today);
  console.log('Today ISO:', todayISO);
  console.log('All stays:', staysData);

  const arrivals = staysData.filter(stay => {
    // Arrivals: status is CONFIRMED and check-in date is today
    const arrivalDate = new Date(stay.checkInDate).toISOString().split('T')[0];
    const isArrival = arrivalDate === today && stay.status === StayStatus.CONFIRMED;
    console.log(`Stay ${stay._id}: checkInDate=${stay.checkInDate} (${arrivalDate}), status=${stay.status}, isArrival=${isArrival}`);
    return isArrival;
  });

  const departures = staysData.filter(stay => {
    // Departures: status is CHECKED_IN and check-out date is today
    const departureDate = new Date(stay.checkOutDate).toISOString().split('T')[0];
    const isDeparture = departureDate === today && stay.status === StayStatus.CHECKED_IN;
    console.log(`Stay ${stay._id}: checkOutDate=${stay.checkOutDate} (${departureDate}), status=${stay.status}, isDeparture=${isDeparture}`);
    return isDeparture;
  });

  const inHouse = staysData.filter(stay => {
    // In-house: status is CHECKED_IN (regardless of dates)
    const isInHouse = stay.status === StayStatus.CHECKED_IN;
    console.log(`Stay ${stay._id}: status=${stay.status}, isInHouse=${isInHouse}`);
    return isInHouse;
  });

  console.log('Arrivals count:', arrivals.length);
  console.log('Departures count:', departures.length);
  console.log('In-house count:', inHouse.length);


  const handleCheckIn = (booking: StaySliceParams) => {
    setSelectedGuest(booking);
    setShowCheckInModal(true);
  };

  const handleCheckOut = (booking: StaySliceParams) => {
    setSelectedGuest(booking);
    setShowCheckOutModal(true);
  };

  const handleRoomAssignment = (booking: StaySliceParams) => {
    setSelectedGuest(booking);
    setShowRoomAssignment(true);
  };

  const completeCheckIn = (stayId: string, roomId: string) => {
    // Update Redux state
    const stayToUpdate = stays.find(stay => stay._id === stayId);
    if (stayToUpdate) {
      const updatedStay = {
        ...stayToUpdate,
        status: 'checked_in',
        roomId: {
          ...stayToUpdate.roomId,
          _id: roomId
        }
      };
      dispatch(stayActions.updateStay(updatedStay));
    }

    setShowCheckInModal(false);
    setShowRoomAssignment(false);
  };

  const completeCheckOut = (stayId: string) => {
    // Update Redux state
    const stayToUpdate = stays.find(stay => stay._id === stayId);
    if (stayToUpdate) {
      const updatedStay = {
        ...stayToUpdate,
        status: 'checked_out'
      };
      dispatch(stayActions.updateStay(updatedStay));
    }

    setShowCheckOutModal(false);
  };

  const handleCancel = (booking: StaySliceParams) => {
    // Update Redux state to cancel the stay
    const updatedStay = {
      ...booking,
      status: StayStatus.CANCELLED
    };
    dispatch(stayActions.updateStay(updatedStay));
  };

  const printReceipt = (type: 'checkin' | 'checkout', guest: any) => {
    // Simulate printing
    console.log(`Printing ${type} receipt for ${guest.guest || guest.firstName} ${guest.lastName}`);
    alert(`${type === 'checkin' ? 'Check-in' : 'Check-out'} receipt printed successfully!`);
  };

  const getGuestFolio = (stayId: string) => {
    return folios.find(folio => folio.booking_id === stayId);
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => room.roomStatus === 'available');
  };

  const handleNewReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new reservation:', newReservationForm);
    setShowNewReservationModal(false);
    // Reset form
    setNewReservationForm({
      guestName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      roomType: '',
      specialRequests: ''
    });
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Front Desk</h1>
            <p className="text-secondary-600">Manage arrivals, departures, and in-house guests</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* Offline Status */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isOffline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
            </div>
            
            <div className="flex space-x-2">
              <Link 
                href="/stays"
                className="btn-secondary"
              >
                <History className="w-4 h-4 mr-2" />
                Stay History
              </Link>
              <button 
                onClick={() => setShowWalkInModal(true)}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Walk-in
              </button>
              <button 
                onClick={() => setShowNewReservationModal(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Reservation
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions
          arrivalsCount={arrivals.length}
          departuresCount={departures.length}
          inHouseCount={inHouse.length}
          onArrivalsClick={() => setSelectedTab('arrivals')}
          onDeparturesClick={() => setSelectedTab('departures')}
          onInHouseClick={() => setSelectedTab('inhouse')}
        />

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-secondary-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'arrivals', name: 'Arrivals', count: arrivals.length, icon: ArrowRight },
                { id: 'departures', name: 'Departures', count: departures.length, icon: ArrowLeft },
                { id: 'inhouse', name: 'In-House', count: inHouse.length, icon: UserCheck }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    selectedTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  <span className={`py-0.5 px-2 rounded-full text-xs ${
                    selectedTab === tab.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-secondary-100 text-secondary-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search guests, rooms, or booking references..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input w-full"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="btn-secondary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
                <button className="btn-secondary">
                  <Printer className="w-4 h-4 mr-2" />
                  Print List
                </button>
              </div>
            </div>

            {selectedTab === 'arrivals' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">Today's Arrivals</h3>
                <div className="space-y-3">
                  {arrivals.filter(arrival =>
                    !searchTerm ||
                    arrival.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    arrival._id.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((arrival) => (
                    <GuestCard
                      key={arrival._id}
                      booking={arrival}
                      type="arrival"
                      onView={setSelectedGuest}
                      onEdit={setSelectedGuest}
                      onRoomAssignment={handleRoomAssignment}
                      onCheckIn={handleCheckIn}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'departures' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">Today's Departures</h3>
                <div className="space-y-3">
                  {departures.filter(departure =>
                    !searchTerm ||
                    departure.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    departure._id.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((departure) => {
                    const folio = getGuestFolio(departure._id);
                    return (
                      <GuestCard
                        key={departure._id}
                        booking={departure}
                        type="departure"
                        folio={folio}
                        onView={setSelectedGuest}
                        onEdit={setSelectedGuest}
                        onPrintReceipt={() => printReceipt('checkout', departure)}
                        onCheckOut={handleCheckOut}
                        onCancel={handleCancel}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {selectedTab === 'inhouse' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">In-House Guests</h3>
                <div className="space-y-3">
                  {inHouse.filter(guest =>
                    !searchTerm ||
                    guest.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    guest._id.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((guest) => {
                    const folio = getGuestFolio(guest._id);
                    const nights = Math.ceil((new Date(guest.checkOutDate).getTime() - new Date(guest.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <GuestCard
                        key={guest._id}
                        booking={guest}
                        type="inhouse"
                        folio={folio}
                        onView={setSelectedGuest}
                        onEdit={setSelectedGuest}
                        onPrintReceipt={() => printReceipt('checkin', guest)}
                        onCancel={handleCancel}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Walk-in Modal */}
        {showWalkInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Walk-in Check-in</h3>
                <button
                  onClick={() => setShowWalkInModal(false)}
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
                        First Name *
                      </label>
                      <input type="text" className="input" placeholder="Enter first name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Last Name *
                      </label>
                      <input type="text" className="input" placeholder="Enter last name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Email
                      </label>
                      <input type="email" className="input" placeholder="Enter email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Phone *
                      </label>
                      <input type="tel" className="input" placeholder="Enter phone number" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        ID Type
                      </label>
                      <select className="input">
                        <option value="">Select ID type</option>
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="national_id">National ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        ID Number
                      </label>
                      <input type="text" className="input" placeholder="Enter ID number" />
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h4 className="font-medium text-secondary-900 mb-3">Booking Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Room Type *
                      </label>
                      <select className="input" required>
                        <option value="">Select room type</option>
                        {roomTypes.map(type => (
                          <option key={type._id} value={type._id}>
                            {type.name} - ${type.price}/night
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Nights *
                      </label>
                      <input type="number" min="1" className="input" placeholder="Number of nights" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Adults *
                      </label>
                      <input type="number" min="1" className="input" placeholder="Number of adults" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Children
                      </label>
                      <input type="number" min="0" className="input" placeholder="Number of children" />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h4 className="font-medium text-secondary-900 mb-3">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Payment Method *
                      </label>
                      <select className="input" required>
                        <option value="">Select payment method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Credit Card</option>
                        <option value="debit">Debit Card</option>
                        <option value="company">Company Account</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Deposit Amount
                      </label>
                      <input type="number" className="input" placeholder="Enter deposit amount" />
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
                    onClick={() => setShowWalkInModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Complete Walk-in Check-in
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Check-in Modal */}
        {showCheckInModal && selectedGuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Check-in Guest</h3>
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h4 className="font-medium text-secondary-900 mb-3">Guest Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedGuest.guestName || 'Guest'}</p>
                      <p><span className="font-medium">Email:</span> {selectedGuest.emailAddress || 'No email'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedGuest.phoneNumber || 'No phone'}</p>
                      <p><span className="font-medium">Address:</span> {selectedGuest.address || 'No address'}</p>
                      <p><span className="font-medium">Stay ID:</span> {selectedGuest._id}</p>
                      <p><span className="font-medium">Hotel ID:</span> {selectedGuest.hotelId}</p>
                      <p><span className="font-medium">Room:</span> {selectedGuest.roomId?.roomNumber || 'TBD'} ({selectedGuest.roomId?.roomTypeId?.name || 'Unknown Type'})</p>
                      <p><span className="font-medium">Check-in Date:</span> {new Date(selectedGuest.checkInDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Check-out Date:</span> {new Date(selectedGuest.checkOutDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Adults:</span> {selectedGuest.adults}</p>
                      <p><span className="font-medium">Children:</span> {selectedGuest.children}</p>
                      <p><span className="font-medium">Party Size:</span> {selectedGuest.adults + selectedGuest.children} guests</p>
                      <p><span className="font-medium">Type:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedGuest.type === 'reservation' ? 'bg-green-100 text-green-800' :
                        selectedGuest.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                        selectedGuest.type === 'walk-in' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{selectedGuest.type || 'Unknown'}</span></p>
                      <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedGuest.status === StayStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                        selectedGuest.status === StayStatus.CHECKED_IN ? 'bg-green-100 text-green-800' :
                        selectedGuest.status === StayStatus.CHECKED_OUT ? 'bg-gray-100 text-gray-800' :
                        selectedGuest.status === StayStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{selectedGuest.status || 'Unknown'}</span></p>
                      <p><span className="font-medium">Payment Method:</span> {selectedGuest.paymentMethod}</p>
                      <p><span className="font-medium">Payment Status:</span> {selectedGuest.paymentStatus}</p>
                      {selectedGuest.paymentDate && <p><span className="font-medium">Payment Date:</span> {new Date(selectedGuest.paymentDate).toLocaleDateString()}</p>}
                      {selectedGuest.specialRequests && <p><span className="font-medium">Special Requests:</span> {selectedGuest.specialRequests}</p>}
                    </div>
                  </div>

                  {/* Room Assignment */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Room Assignment</h4>
                    <div className="space-y-3">
                      {getAvailableRooms().slice(0, 5).map(room => (
                        <div key={room._id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
                          <div>
                            <p className="font-medium text-secondary-900">Room {room.roomNumber}</p>
                            <p className="text-sm text-secondary-600">
                              {roomTypes.find(type => type._id === room.roomTypeId)?.name} • Floor {room.floor}
                            </p>
                          </div>
                          <button
                            onClick={() => completeCheckIn(selectedGuest._id, room._id)}
                            className="btn-primary text-sm"
                          >
                            Assign
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Check-in Process */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Check-in Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="id-verified" className="rounded" />
                        <label htmlFor="id-verified" className="text-sm text-secondary-700">
                          ID verified and scanned
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="payment-verified" className="rounded" />
                        <label htmlFor="payment-verified" className="text-sm text-secondary-700">
                          Payment method verified
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="keycard-issued" className="rounded" />
                        <label htmlFor="keycard-issued" className="text-sm text-secondary-700">
                          Keycard issued
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="wifi-info" className="rounded" />
                        <label htmlFor="wifi-info" className="text-sm text-secondary-700">
                          WiFi information provided
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="amenities" className="rounded" />
                        <label htmlFor="amenities" className="text-sm text-secondary-700">
                          Hotel amenities explained
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Folio Preview */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Folio Preview</h4>
                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Payment Status:</span>
                          <span>{selectedGuest.paymentStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span>{selectedGuest.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t border-secondary-200 pt-2">
                          <span>Stay Duration:</span>
                          <span>{Math.ceil((new Date(selectedGuest.checkOutDate).getTime() - new Date(selectedGuest.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => printReceipt('checkin', selectedGuest)}
                      className="btn-secondary flex-1"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Receipt
                    </button>
                    <button
                      onClick={() => setShowCheckInModal(false)}
                      className="btn-primary flex-1"
                    >
                      Complete Check-in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check-out Modal */}
        {showCheckOutModal && selectedGuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Check-out Guest</h3>
                <button
                  onClick={() => setShowCheckOutModal(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h4 className="font-medium text-secondary-900 mb-3">Guest Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedGuest.guestName || 'Guest'}</p>
                      <p><span className="font-medium">Email:</span> {selectedGuest.emailAddress || 'No email'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedGuest.phoneNumber || 'No phone'}</p>
                      <p><span className="font-medium">Address:</span> {selectedGuest.address || 'No address'}</p>
                      <p><span className="font-medium">Room:</span> {selectedGuest.roomId?.roomNumber || 'TBD'} ({selectedGuest.roomId?.roomTypeId?.name || 'Unknown Type'})</p>
                      <p><span className="font-medium">Check-in:</span> {new Date(selectedGuest.checkInDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Check-out:</span> {new Date(selectedGuest.checkOutDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Stay ID:</span> {selectedGuest._id}</p>
                      <p><span className="font-medium">Hotel ID:</span> {selectedGuest.hotelId}</p>
                      <p><span className="font-medium">Adults:</span> {selectedGuest.adults}</p>
                      <p><span className="font-medium">Children:</span> {selectedGuest.children}</p>
                      <p><span className="font-medium">Party Size:</span> {selectedGuest.adults + selectedGuest.children} guests</p>
                      <p><span className="font-medium">Type:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedGuest.type === 'reservation' ? 'bg-green-100 text-green-800' :
                        selectedGuest.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                        selectedGuest.type === 'walk-in' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{selectedGuest.type || 'Unknown'}</span></p>
                      <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedGuest.status === StayStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                        selectedGuest.status === StayStatus.CHECKED_IN ? 'bg-green-100 text-green-800' :
                        selectedGuest.status === StayStatus.CHECKED_OUT ? 'bg-gray-100 text-gray-800' :
                        selectedGuest.status === StayStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{selectedGuest.status || 'Unknown'}</span></p>
                      <p><span className="font-medium">Payment Method:</span> {selectedGuest.paymentMethod}</p>
                      <p><span className="font-medium">Payment Status:</span> {selectedGuest.paymentStatus}</p>
                      {selectedGuest.paymentDate && <p><span className="font-medium">Payment Date:</span> {new Date(selectedGuest.paymentDate).toLocaleDateString()}</p>}
                      {selectedGuest.specialRequests && <p><span className="font-medium">Special Requests:</span> {selectedGuest.specialRequests}</p>}
                    </div>
                  </div>

                  {/* Check-out Process */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Check-out Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="room-inspected" className="rounded" />
                        <label htmlFor="room-inspected" className="text-sm text-secondary-700">
                          Room inspection completed
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="keycard-returned" className="rounded" />
                        <label htmlFor="keycard-returned" className="text-sm text-secondary-700">
                          Keycard returned
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="final-bill" className="rounded" />
                        <label htmlFor="final-bill" className="text-sm text-secondary-700">
                          Final bill reviewed
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="payment-settled" className="rounded" />
                        <label htmlFor="payment-settled" className="text-sm text-secondary-700">
                          Payment settled
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Invoice */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Final Invoice</h4>
                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Stay Duration:</span>
                          <span>{Math.ceil((new Date(selectedGuest.checkOutDate).getTime() - new Date(selectedGuest.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Room Service:</span>
                          <span>$45.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mini Bar:</span>
                          <span>$23.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes & Fees:</span>
                          <span>$12.75</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Status:</span>
                          <span className="text-green-600">{selectedGuest.paymentStatus}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t border-secondary-200 pt-2">
                          <span>Balance Due:</span>
                          <span>$81.25</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Payment Method</h4>
                    <select className="input w-full">
                      <option value="">Select payment method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Credit Card</option>
                      <option value="debit">Debit Card</option>
                      <option value="company">Company Account</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => printReceipt('checkout', selectedGuest)}
                      className="btn-secondary flex-1"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Invoice
                    </button>
                    <button
                      onClick={() => completeCheckOut(selectedGuest._id)}
                      className="btn-primary flex-1"
                    >
                      Complete Check-out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Assignment Modal */}
        {showRoomAssignment && selectedGuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Room Assignment</h3>
                <button
                  onClick={() => setShowRoomAssignment(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div>
                  <div className="bg-secondary-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-secondary-900 mb-2">Guest Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedGuest.guestName || 'Guest'}</p>
                      <p><span className="font-medium">Email:</span> {selectedGuest.emailAddress || 'No email'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedGuest.phoneNumber || 'No phone'}</p>
                      <p><span className="font-medium">Stay ID:</span> {selectedGuest._id}</p>
                      <p><span className="font-medium">Hotel ID:</span> {selectedGuest.hotelId}</p>
                      <p><span className="font-medium">Check-in:</span> {new Date(selectedGuest.checkInDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Check-out:</span> {new Date(selectedGuest.checkOutDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Adults:</span> {selectedGuest.adults}</p>
                      <p><span className="font-medium">Children:</span> {selectedGuest.children}</p>
                      <p><span className="font-medium">Party:</span> {selectedGuest.adults + selectedGuest.children} guests</p>
                      <p><span className="font-medium">Type:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedGuest.type === 'reservation' ? 'bg-green-100 text-green-800' :
                        selectedGuest.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                        selectedGuest.type === 'walk-in' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{selectedGuest.type || 'Unknown'}</span></p>
                      <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedGuest.status === StayStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                        selectedGuest.status === StayStatus.CHECKED_IN ? 'bg-green-100 text-green-800' :
                        selectedGuest.status === StayStatus.CHECKED_OUT ? 'bg-gray-100 text-gray-800' :
                        selectedGuest.status === StayStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{selectedGuest.status || 'Unknown'}</span></p>
                      <p><span className="font-medium">Payment:</span> {selectedGuest.paymentMethod} ({selectedGuest.paymentStatus})</p>
                      {selectedGuest.specialRequests && <p><span className="font-medium">Requests:</span> {selectedGuest.specialRequests}</p>}
                    </div>
                  </div>
                </div>

                {/* Available Rooms */}
                <div>
                  <h4 className="font-medium text-secondary-900 mb-3">Available Rooms</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getAvailableRooms().map(room => {
                      const roomType = roomTypes.find(type => type._id === room.roomTypeId);
                      return (
                        <div key={room._id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <Bed className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900">Room {room.roomNumber}</p>
                              <p className="text-sm text-secondary-600">
                                {roomType?.name} • Floor {room.floor}
                              </p>
                              <p className="text-sm text-secondary-500">
                                ${roomType?.price}/night
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              completeCheckIn(selectedGuest._id, room._id);
                            }}
                            className="btn-primary"
                          >
                            Assign Room
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Reservation Modal */}
        {showNewReservationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">New Reservation</h2>
                <button
                  onClick={() => setShowNewReservationModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleNewReservationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReservationForm.guestName}
                      onChange={(e) => setNewReservationForm({...newReservationForm, guestName: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter guest name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newReservationForm.email}
                      onChange={(e) => setNewReservationForm({...newReservationForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="guest@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newReservationForm.phone}
                      onChange={(e) => setNewReservationForm({...newReservationForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room Type
                    </label>
                    <select
                      value={newReservationForm.roomType}
                      onChange={(e) => setNewReservationForm({...newReservationForm, roomType: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select room type</option>
                      {roomTypes.map(type => (
                        <option key={type._id} value={type._id}>
                          {type.name} - ${type.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newReservationForm.checkIn}
                      onChange={(e) => setNewReservationForm({...newReservationForm, checkIn: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newReservationForm.checkOut}
                      onChange={(e) => setNewReservationForm({...newReservationForm, checkOut: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Adults
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newReservationForm.adults}
                      onChange={(e) => setNewReservationForm({...newReservationForm, adults: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Children
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newReservationForm.children}
                      onChange={(e) => setNewReservationForm({...newReservationForm, children: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={newReservationForm.specialRequests}
                    onChange={(e) => setNewReservationForm({...newReservationForm, specialRequests: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any special requests or notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewReservationModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}
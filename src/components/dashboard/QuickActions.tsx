'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, Clock, Users, X, User, Phone, Mail, MapPin, CreditCard, Bed, Calendar as CalendarIcon, DollarSign, Save, Search } from 'lucide-react';

export default function QuickActions() {
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Reservation form state
  const [reservationForm, setReservationForm] = useState({
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

  // Check-in form state
  const [checkInForm, setCheckInForm] = useState({
    bookingId: '',
    guestName: '',
    roomNumber: '',
    idType: '',
    idNumber: '',
    paymentMethod: '',
    notes: ''
  });

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    roomType: '',
    paymentMethod: '',
    specialRequests: ''
  });

  // Staff form state
  const [staffForm, setStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    salary: ''
  });

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle reservation creation
    console.log('Creating reservation:', reservationForm);
    setShowReservationModal(false);
    // Reset form
    setReservationForm({
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

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle check-in
    console.log('Processing check-in:', checkInForm);
    setShowCheckInModal(false);
    // Reset form
    setCheckInForm({
      bookingId: '',
      guestName: '',
      roomNumber: '',
      idType: '',
      idNumber: '',
      paymentMethod: '',
      notes: ''
    });
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle walk-in
    console.log('Processing walk-in:', walkInForm);
    setShowWalkInModal(false);
    // Reset form
    setWalkInForm({
      guestName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      roomType: '',
      paymentMethod: '',
      specialRequests: ''
    });
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle staff addition
    console.log('Adding staff:', staffForm);
    setShowAddStaffModal(false);
    // Reset form
    setStaffForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      hireDate: '',
      salary: ''
    });
  };

  return (
    <>
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowReservationModal(true)}
            className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors"
          >
          <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-primary-700">New Reservation</p>
        </button>
          <button 
            onClick={() => setShowCheckInModal(true)}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
          >
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-700">Check In Guest</p>
        </button>
          <button 
            onClick={() => setShowWalkInModal(true)}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
          >
          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-700">Walk-in Guest</p>
        </button>
          <button 
            onClick={() => setShowAddStaffModal(true)}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
          >
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-purple-700">Add Staff</p>
        </button>
      </div>
    </div>

      {/* New Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">New Reservation</h2>
              <button
                onClick={() => setShowReservationModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reservationForm.guestName}
                    onChange={(e) => setReservationForm({...reservationForm, guestName: e.target.value})}
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
                    value={reservationForm.email}
                    onChange={(e) => setReservationForm({...reservationForm, email: e.target.value})}
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
                    value={reservationForm.phone}
                    onChange={(e) => setReservationForm({...reservationForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Type
                  </label>
                  <select
                    value={reservationForm.roomType}
                    onChange={(e) => setReservationForm({...reservationForm, roomType: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select room type</option>
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={reservationForm.checkIn}
                    onChange={(e) => setReservationForm({...reservationForm, checkIn: e.target.value})}
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
                    value={reservationForm.checkOut}
                    onChange={(e) => setReservationForm({...reservationForm, checkOut: e.target.value})}
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
                    value={reservationForm.adults}
                    onChange={(e) => setReservationForm({...reservationForm, adults: parseInt(e.target.value)})}
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
                    value={reservationForm.children}
                    onChange={(e) => setReservationForm({...reservationForm, children: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={reservationForm.specialRequests}
                  onChange={(e) => setReservationForm({...reservationForm, specialRequests: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requests or notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Check-in Guest</h2>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Booking ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={checkInForm.bookingId}
                      onChange={(e) => setCheckInForm({...checkInForm, bookingId: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter booking ID"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={checkInForm.guestName}
                    onChange={(e) => setCheckInForm({...checkInForm, guestName: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Guest name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={checkInForm.roomNumber}
                    onChange={(e) => setCheckInForm({...checkInForm, roomNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 201"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    ID Type
                  </label>
                  <select
                    value={checkInForm.idType}
                    onChange={(e) => setCheckInForm({...checkInForm, idType: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select ID type</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={checkInForm.idNumber}
                    onChange={(e) => setCheckInForm({...checkInForm, idNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="ID number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={checkInForm.paymentMethod}
                    onChange={(e) => setCheckInForm({...checkInForm, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="company_account">Company Account</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={checkInForm.notes}
                  onChange={(e) => setCheckInForm({...checkInForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special notes for check-in..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check In Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Walk-in Guest</h2>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInForm.guestName}
                    onChange={(e) => setWalkInForm({...walkInForm, guestName: e.target.value})}
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
                    value={walkInForm.email}
                    onChange={(e) => setWalkInForm({...walkInForm, email: e.target.value})}
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
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({...walkInForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    required
                    value={walkInForm.roomType}
                    onChange={(e) => setWalkInForm({...walkInForm, roomType: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select room type</option>
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={walkInForm.checkIn}
                    onChange={(e) => setWalkInForm({...walkInForm, checkIn: e.target.value})}
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
                    value={walkInForm.checkOut}
                    onChange={(e) => setWalkInForm({...walkInForm, checkOut: e.target.value})}
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
                    value={walkInForm.adults}
                    onChange={(e) => setWalkInForm({...walkInForm, adults: parseInt(e.target.value)})}
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
                    value={walkInForm.children}
                    onChange={(e) => setWalkInForm({...walkInForm, children: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    required
                    value={walkInForm.paymentMethod}
                    onChange={(e) => setWalkInForm({...walkInForm, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="debit_card">Debit Card</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={walkInForm.specialRequests}
                  onChange={(e) => setWalkInForm({...walkInForm, specialRequests: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requests or notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Process Walk-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Add Staff Member</h2>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffForm.firstName}
                    onChange={(e) => setStaffForm({...staffForm, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffForm.lastName}
                    onChange={(e) => setStaffForm({...staffForm, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="staff@hotel.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Department *
                  </label>
                  <select
                    required
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({...staffForm, department: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select department</option>
                    <option value="front_desk">Front Desk</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="food_beverage">Food & Beverage</option>
                    <option value="management">Management</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffForm.position}
                    onChange={(e) => setStaffForm({...staffForm, position: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Front Desk Agent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Hire Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={staffForm.hireDate}
                    onChange={(e) => setStaffForm({...staffForm, hireDate: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={staffForm.salary}
                    onChange={(e) => setStaffForm({...staffForm, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


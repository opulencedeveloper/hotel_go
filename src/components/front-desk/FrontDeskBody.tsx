'use client';

import { useState, useEffect, useMemo } from 'react';
import QuickActions from '@/components/front-desk/QuickActions';
import { Room, RoomType, Folio } from '@/types';
import { StaySliceParams } from '@/store/redux/stay-slice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { stayActions } from '@/store/redux/stay-slice';
import { StayStatus } from '@/utils/enum';

// Import individual front desk components
import FrontDeskHeader from './FrontDeskHeader';
import FrontDeskTabs from './FrontDeskTabs';
import FrontDeskSearch from './FrontDeskSearch';
import FrontDeskContent from './FrontDeskContent';
import WalkInModal from './WalkInModal';
import CheckInModal from './CheckInModal';
import CheckOutModal from './CheckOutModal';
import RoomAssignmentModal from './RoomAssignmentModal';
import NewReservationModal from './NewReservationModal';

export default function FrontDeskBody() {
  const [selectedTab, setSelectedTab] = useState('arrivals');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showRoomAssignment, setShowRoomAssignment] = useState(false);
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
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
      <FrontDeskHeader 
        isOffline={isOffline}
        onWalkInClick={() => setShowWalkInModal(true)}
        onNewReservationClick={() => setShowNewReservationModal(true)}
      />

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
        <FrontDeskTabs
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          arrivalsCount={arrivals.length}
          departuresCount={departures.length}
          inHouseCount={inHouse.length}
        />

        {/* Tab Content */}
        <div className="p-6">
          {/* Search Bar */}
          <FrontDeskSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={() => console.log('Refresh clicked')}
            onPrintList={() => console.log('Print list clicked')}
          />

          {/* Content */}
          <FrontDeskContent
            selectedTab={selectedTab}
            searchTerm={searchTerm}
            arrivals={arrivals}
            departures={departures}
            inHouse={inHouse}
            getGuestFolio={getGuestFolio}
            onView={setSelectedGuest}
            onEdit={setSelectedGuest}
            onRoomAssignment={handleRoomAssignment}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onCancel={handleCancel}
            onPrintReceipt={printReceipt}
          />
        </div>
      </div>

      {/* Modals */}
      <WalkInModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        roomTypes={roomTypes}
      />

      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        selectedGuest={selectedGuest}
        availableRooms={getAvailableRooms()}
        roomTypes={roomTypes}
        onCompleteCheckIn={completeCheckIn}
        onPrintReceipt={printReceipt}
      />

      <CheckOutModal
        isOpen={showCheckOutModal}
        onClose={() => setShowCheckOutModal(false)}
        selectedGuest={selectedGuest}
        onCompleteCheckOut={completeCheckOut}
        onPrintReceipt={printReceipt}
      />

      <RoomAssignmentModal
        isOpen={showRoomAssignment}
        onClose={() => setShowRoomAssignment(false)}
        selectedGuest={selectedGuest}
        availableRooms={getAvailableRooms()}
        roomTypes={roomTypes}
        onCompleteCheckIn={completeCheckIn}
      />

      <NewReservationModal
        isOpen={showNewReservationModal}
        onClose={() => setShowNewReservationModal(false)}
        roomTypes={roomTypes}
        newReservationForm={newReservationForm}
        onFormChange={(field, value) => setNewReservationForm({...newReservationForm, [field]: value})}
        onSubmit={handleNewReservationSubmit}
      />
    </div>
  );
}
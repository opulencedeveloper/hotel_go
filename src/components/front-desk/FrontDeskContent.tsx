'use client';

import GuestCard from '@/components/front-desk/GuestCard';
import { StaySliceParams } from '@/store/redux/stay-slice';
import { Folio } from '@/types';

interface FrontDeskContentProps {
  selectedTab: string;
  searchTerm: string;
  arrivals: StaySliceParams[];
  departures: StaySliceParams[];
  inHouse: StaySliceParams[];
  getGuestFolio: (stayId: string) => Folio | undefined;
  onView: (guest: any) => void;
  onEdit: (guest: any) => void;
  onRoomAssignment: (booking: StaySliceParams) => void;
  onCheckIn: (booking: StaySliceParams) => void;
  onCheckOut: (booking: StaySliceParams) => void;
  onCancel: (booking: StaySliceParams) => void;
  onPrintReceipt: (type: 'checkin' | 'checkout', guest: any) => void;
}

export default function FrontDeskContent({
  selectedTab,
  searchTerm,
  arrivals,
  departures,
  inHouse,
  getGuestFolio,
  onView,
  onEdit,
  onRoomAssignment,
  onCheckIn,
  onCheckOut,
  onCancel,
  onPrintReceipt,
}: FrontDeskContentProps) {
  const filterGuests = (guests: StaySliceParams[]) => {
    return guests.filter(guest =>
      !searchTerm ||
      guest.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      {selectedTab === 'arrivals' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900">Today's Arrivals</h3>
          <div className="space-y-3">
            {filterGuests(arrivals).map((arrival) => (
              <GuestCard
                key={arrival._id}
                booking={arrival}
                type="arrival"
                onView={onView}
                onEdit={onEdit}
                onRoomAssignment={onRoomAssignment}
                onCheckIn={onCheckIn}
                onCancel={onCancel}
              />
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'departures' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900">Today's Departures</h3>
          <div className="space-y-3">
            {filterGuests(departures).map((departure) => {
              const folio = getGuestFolio(departure._id);
              return (
                <GuestCard
                  key={departure._id}
                  booking={departure}
                  type="departure"
                  folio={folio}
                  onView={onView}
                  onEdit={onEdit}
                  onPrintReceipt={() => onPrintReceipt('checkout', departure)}
                  onCheckOut={onCheckOut}
                  onCancel={onCancel}
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
            {filterGuests(inHouse).map((guest) => {
              const folio = getGuestFolio(guest._id);
              return (
                <GuestCard
                  key={guest._id}
                  booking={guest}
                  type="inhouse"
                  folio={folio}
                  onView={onView}
                  onEdit={onEdit}
                  onPrintReceipt={() => onPrintReceipt('checkin', guest)}
                  onCancel={onCancel}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}







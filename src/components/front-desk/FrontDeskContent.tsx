'use client';

import React from 'react';
import GuestCard from '@/components/front-desk/GuestCard';
import { StaySliceParams } from '@/store/redux/stay-slice';
import { Folio } from '@/types';
import { ArrowRight, ArrowLeft, Users } from 'lucide-react';

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

  const filteredArrivals = filterGuests(arrivals);
  const filteredDepartures = filterGuests(departures);
  const filteredInHouse = filterGuests(inHouse);

  const renderEmptyState = (
    icon: React.ReactNode,
    title: string,
    description: string,
    iconBgColor: string = 'from-blue-100 to-blue-200',
    iconBgLight: string = 'from-blue-50 to-blue-100',
    iconTextColor: string = 'text-blue-600'
  ) => (
    <div className="py-12 px-6">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Icon Container */}
        <div className="relative mb-6">
          <div className={`absolute inset-0 bg-gradient-to-br ${iconBgColor} rounded-full blur-xl opacity-50`} />
          <div className={`relative p-6 bg-gradient-to-br ${iconBgLight} rounded-full`}>
            <div className={iconTextColor}>
              {icon}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-secondary-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {selectedTab === 'arrivals' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900">Today's Arrivals</h3>
          {filteredArrivals.length === 0 ? (
            renderEmptyState(
              <ArrowRight className="w-12 h-12" />,
              searchTerm ? 'No arrivals found' : 'No arrivals today',
              searchTerm 
                ? 'No guests match your search criteria. Try adjusting your search terms.'
                : 'There are no guests scheduled to arrive today. New arrivals will appear here once reservations are made.',
              'from-green-100 to-green-200',
              'from-green-50 to-green-100',
              'text-green-600'
            )
          ) : (
          <div className="space-y-3">
              {filteredArrivals.map((arrival) => (
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
          )}
        </div>
      )}

      {selectedTab === 'departures' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900">Today's Departures</h3>
          {filteredDepartures.length === 0 ? (
            renderEmptyState(
              <ArrowLeft className="w-12 h-12" />,
              searchTerm ? 'No departures found' : 'No departures today',
              searchTerm
                ? 'No guests match your search criteria. Try adjusting your search terms.'
                : 'There are no guests scheduled to depart today. Departures will appear here when check-out dates arrive.',
              'from-orange-100 to-orange-200',
              'from-orange-50 to-orange-100',
              'text-orange-600'
            )
          ) : (
          <div className="space-y-3">
              {filteredDepartures.map((departure) => {
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
          )}
        </div>
      )}

      {selectedTab === 'inhouse' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900">In-House Guests</h3>
          {filteredInHouse.length === 0 ? (
            renderEmptyState(
              <Users className="w-12 h-12" />,
              searchTerm ? 'No guests found' : 'No guests in-house',
              searchTerm
                ? 'No guests match your search criteria. Try adjusting your search terms.'
                : 'There are currently no checked-in guests. Guests will appear here after successful check-in.',
              'from-blue-100 to-blue-200',
              'text-blue-600'
            )
          ) : (
          <div className="space-y-3">
              {filteredInHouse.map((guest) => {
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
          )}
        </div>
      )}
    </>
  );
}












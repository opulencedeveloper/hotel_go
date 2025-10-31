'use client';

import { RoomTypeSliceParams } from "@/types/room-management/room-management";
import { X, Plus } from "lucide-react";
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTypes: RoomTypeSliceParams[];
  newReservationForm: {
    guestName: string;
    email: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    roomType: string;
    specialRequests: string;
  };
  onFormChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function NewReservationModal({ 
  isOpen, 
  onClose, 
  roomTypes, 
  newReservationForm, 
  onFormChange, 
  onSubmit 
}: NewReservationModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">New Reservation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Guest Name *
              </label>
              <input
                type="text"
                required
                value={newReservationForm.guestName}
                onChange={(e) => onFormChange('guestName', e.target.value)}
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
                onChange={(e) => onFormChange('email', e.target.value)}
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
                onChange={(e) => onFormChange('phone', e.target.value)}
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
                onChange={(e) => onFormChange('roomType', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select room type</option>
                {roomTypes.map(type => (
                  <option key={type._id} value={type._id}>
                    {type.name} - {formatPrice(type.price, selectedHotel?.currency)}
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
                onChange={(e) => onFormChange('checkIn', e.target.value)}
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
                onChange={(e) => onFormChange('checkOut', e.target.value)}
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
                onChange={(e) => onFormChange('adults', parseInt(e.target.value))}
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
                onChange={(e) => onFormChange('children', parseInt(e.target.value))}
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
              onChange={(e) => onFormChange('specialRequests', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any special requests or notes..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
}

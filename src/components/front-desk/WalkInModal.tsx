'use client';

import { RoomTypeSliceParams } from "@/types/room-management/room-management";
import { X } from "lucide-react";
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTypes: RoomTypeSliceParams[];
}

export default function WalkInModal({ isOpen, onClose, roomTypes }: WalkInModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Walk-in Check-in</h3>
          <button
            onClick={onClose}
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
                      {type.name} - {formatPrice(type.price, selectedHotel?.currency)}/night
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
              onClick={onClose}
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
  );
}

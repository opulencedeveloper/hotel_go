'use client';

import { X, Printer } from "lucide-react";
import { StayStatus } from '@/utils/enum';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGuest: any;
  onCompleteCheckOut: (stayId: string) => void;
  onPrintReceipt: (type: 'checkin' | 'checkout', guest: any) => void;
}

export default function CheckOutModal({ 
  isOpen, 
  onClose, 
  selectedGuest, 
  onCompleteCheckOut, 
  onPrintReceipt 
}: CheckOutModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  if (!isOpen || !selectedGuest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Check-out Guest</h3>
          <button
            onClick={onClose}
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
                    <span>{formatPrice(45.00, selectedHotel?.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mini Bar:</span>
                    <span>{formatPrice(23.50, selectedHotel?.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span>{formatPrice(12.75, selectedHotel?.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="text-green-600">{selectedGuest.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-secondary-200 pt-2">
                    <span>Balance Due:</span>
                    <span>{formatPrice(81.25, selectedHotel?.currency)}</span>
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
                onClick={() => onPrintReceipt('checkout', selectedGuest)}
                className="btn-secondary flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Invoice
              </button>
              <button
                onClick={() => onCompleteCheckOut(selectedGuest._id)}
                className="btn-primary flex-1"
              >
                Complete Check-out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








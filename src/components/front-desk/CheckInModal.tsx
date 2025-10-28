'use client';

import { X, Printer } from "lucide-react";
import { StayStatus } from '@/utils/enum';
import { RoomSliceParams, RoomTypeSliceParams } from "@/types/room-management/room-management";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGuest: any;
  availableRooms: RoomSliceParams[];
  roomTypes: RoomTypeSliceParams[];
  onCompleteCheckIn: (stayId: string, roomId: string) => void;
  onPrintReceipt: (type: 'checkin' | 'checkout', guest: any) => void;
}

export default function CheckInModal({ 
  isOpen, 
  onClose, 
  selectedGuest, 
  availableRooms, 
  roomTypes, 
  onCompleteCheckIn, 
  onPrintReceipt 
}: CheckInModalProps) {
  if (!isOpen || !selectedGuest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Check-in Guest</h3>
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
                <p><span className="font-medium">Stay ID:</span> {selectedGuest._id}</p>
                <p><span className="font-medium">Room:</span> {selectedGuest.roomId?.roomNumber || 'TBD'} ({selectedGuest.roomId?.roomTypeId || 'Unknown Type'})</p>
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
                {availableRooms.slice(0, 5).map(room => (
                  <div key={room._id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
                    <div>
                      <p className="font-medium text-secondary-900">Room {room.roomNumber}</p>
                      <p className="text-sm text-secondary-600">
                        {room.roomTypeName || room.roomTypeId?.name || 'Unknown Type'} • Floor {room.floor}
                      </p>
                    </div>
                    <button
                      onClick={() => onCompleteCheckIn(selectedGuest._id, room._id)}
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
                onClick={() => onPrintReceipt('checkin', selectedGuest)}
                className="btn-secondary flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </button>
              <button
                onClick={onClose}
                className="btn-primary flex-1"
              >
                Complete Check-in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

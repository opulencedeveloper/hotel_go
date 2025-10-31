'use client';

import { X, Bed } from "lucide-react";
import { StayStatus } from '@/utils/enum';
import { RoomSliceParams, RoomTypeSliceParams } from "@/types/room-management/room-management";
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface RoomAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGuest: any;
  availableRooms: RoomSliceParams[];
  roomTypes: RoomTypeSliceParams[];
  onCompleteCheckIn: (stayId: string, roomId: string) => void;
}

export default function RoomAssignmentModal({ 
  isOpen, 
  onClose, 
  selectedGuest, 
  availableRooms, 
  roomTypes, 
  onCompleteCheckIn 
}: RoomAssignmentModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  if (!isOpen || !selectedGuest) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Room Assignment</h3>
          <button
            onClick={onClose}
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
              {availableRooms.map(room => {
                const roomType = room.roomTypeId || { name: room.roomTypeName || 'Unknown Type', price: 0 };
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
                          {formatPrice(roomType?.price || 0, selectedHotel?.currency)}/night
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onCompleteCheckIn(selectedGuest._id, room._id);
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
  );
}

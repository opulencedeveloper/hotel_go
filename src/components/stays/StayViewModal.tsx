'use client';

import Modal from "@/components/common/Modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatPrice } from '@/helper';

interface StayViewModalProps {
  viewingStay: any;
  onClose: () => void;
}

export default function StayViewModal({ viewingStay, onClose }: StayViewModalProps) {
  const room = useSelector((state: RootState) => state.room);
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  const { hotelRoomTypes, hotelRooms } = room;

  // Helper function to get room details
  const getRoomDetails = (roomId: string) => {
    const room = hotelRooms.find((r: any) => r._id === roomId);
    return room;
  };

  // Helper function to get room type details
  const getRoomTypeDetails = (roomTypeId: string) => {
    const roomType = hotelRoomTypes.find((rt: any) => rt._id === roomTypeId);
    return roomType;
  };

  if (!viewingStay) return null;

  const roomDetails = getRoomDetails(viewingStay.roomId._id);
  const roomTypeDetails = getRoomTypeDetails(roomDetails?.roomTypeId || viewingStay.roomId.roomTypeId);

  return (
    <Modal
      isOpen={!!viewingStay}
      onClose={onClose}
      title={`Stay Details - ${viewingStay._id.slice(-8)}`}
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Guest Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Guest Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <p className="text-gray-900">{viewingStay.guestName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">{viewingStay.emailAddress || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <p className="text-gray-900">{viewingStay.phoneNumber}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Address:</span>
              <p className="text-gray-900">{viewingStay.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Room Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Room Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Room Number:</span>
              <p className="text-gray-900">{viewingStay.roomId.roomNumber}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Room ID:</span>
              <p className="text-gray-900 text-xs font-mono">{viewingStay.roomId._id}</p>
            </div>
          </div>
        </div>

        {/* Dates & Party */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Dates & Party</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Check-in Date:</span>
              <p className="text-gray-900">{new Date(viewingStay.checkInDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Check-out Date:</span>
              <p className="text-gray-900">{new Date(viewingStay.checkOutDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Adults:</span>
              <p className="text-gray-900">{viewingStay.adults}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Children:</span>
              <p className="text-gray-900">{viewingStay.children}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Guests:</span>
              <p className="text-gray-900">{viewingStay.adults + viewingStay.children}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Payment Method:</span>
              <p className="text-gray-900">{viewingStay.paymentMethod?.replace(/_/g, " ").toUpperCase() || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Payment Status:</span>
              <p className="text-gray-900">{viewingStay.paymentStatus || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Amount:</span>
              <p className="text-gray-900">{viewingStay.totalAmount !== undefined ? formatPrice(viewingStay.totalAmount, selectedHotel?.currency) : "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Paid Amount:</span>
              <p className="text-gray-900">{viewingStay.paidAmount !== undefined ? formatPrice(viewingStay.paidAmount, selectedHotel?.currency) : "N/A"}</p>
            </div>
          </div>
          <div className="mt-4">
            {viewingStay.roomRateAtPayment !== undefined ? (
              <div className="text-blue-600">
                Room Rate at Payment: {formatPrice(viewingStay.roomRateAtPayment, selectedHotel?.currency)}
              </div>
            ) : (
              <div className="text-red-600">
                Room Rate at Payment: <span className="italic">Not yet paid</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Charges */}
        {(viewingStay.discount || viewingStay.serviceCharge || viewingStay.tax) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Additional Charges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {viewingStay.discount && (
                <div>
                  <span className="font-medium text-gray-700">Discount:</span>
                  <p className="text-gray-900">{formatPrice(viewingStay.discount, selectedHotel?.currency)}</p>
                </div>
              )}
              {viewingStay.serviceCharge && (
                <div>
                  <span className="font-medium text-gray-700">Service Charge:</span>
                  <p className="text-gray-900">{formatPrice(viewingStay.serviceCharge, selectedHotel?.currency)}</p>
                </div>
              )}
              {viewingStay.tax && (
                <div>
                  <span className="font-medium text-gray-700">Tax:</span>
                  <p className="text-gray-900">{formatPrice(viewingStay.tax, selectedHotel?.currency)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stay Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Stay Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                viewingStay.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                viewingStay.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                viewingStay.status === 'checked_out' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {viewingStay.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                viewingStay.type === 'reservation' ? 'bg-green-100 text-green-800' :
                viewingStay.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {viewingStay.type.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {viewingStay.specialRequests && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Special Requests</h3>
            <p className="text-sm text-gray-900">{viewingStay.specialRequests}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}









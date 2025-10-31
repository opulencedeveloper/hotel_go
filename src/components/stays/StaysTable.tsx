'use client';

import { 
  Calendar,
  CreditCard,
  User,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Home
} from "lucide-react";
import { StayType, StayStatus, PaymentStatus } from "@/utils/enum";
import { RoomStatus } from "@/types/room-management/enum";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatPrice } from '@/helper';

interface StaysTableProps {
  filteredStays: any[];
  selectedTab: StayType;
  searchTerm: string;
  statusFilter: string;
  paymentStatusFilter: string;
  roomStatusFilter: string;
  onViewStay: (stay: any) => void;
  onEditStay: (stay: any) => void;
  onDeleteStay: (stay: any) => void;
  isDeleting: boolean;
}

export default function StaysTable({
  filteredStays,
  selectedTab,
  searchTerm,
  statusFilter,
  paymentStatusFilter,
  roomStatusFilter,
  onViewStay,
  onEditStay,
  onDeleteStay,
  isDeleting,
}: StaysTableProps) {
  const room = useSelector((state: RootState) => state.room);
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  const { hotelRoomTypes, hotelRooms } = room;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case StayStatus.CONFIRMED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case StayStatus.CHECKED_IN:
        return <User className="w-4 h-4 text-blue-500" />;
      case StayStatus.CHECKED_OUT:
        return <Clock className="w-4 h-4 text-gray-500" />;
      case StayStatus.CANCELLED:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (paymentStatus) {
      case PaymentStatus.PAID:
        return `${baseClasses} bg-green-100 text-green-800`;
      case PaymentStatus.PENDING:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case PaymentStatus.REFUNDED:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case PaymentStatus.CANCELLED:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeIcon = (type: StayType) => {
    switch (type) {
      case StayType.RESERVED:
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case StayType.BOOKED:
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case StayType.WALK_IN:
        return <User className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoomStatusIcon = (status: string) => {
    switch (status) {
      case RoomStatus.Available:
        return "✓";
      case RoomStatus.Occupied:
        return "🏠";
      case RoomStatus.MarkForCleaning:
        return "🧽";
      case RoomStatus.Maintenance:
        return "🔧";
      case RoomStatus.Cleaning:
        return "🧹";
      case RoomStatus.Unavailable:
        return "x";
      default:
        return "❓";
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case RoomStatus.Available:
        return "bg-green-100 text-green-800";
      case RoomStatus.Occupied:
        return "bg-red-100 text-red-800";
      case RoomStatus.MarkForCleaning:
        return "bg-orange-100 text-orange-800";
      case RoomStatus.Maintenance:
        return "bg-yellow-100 text-yellow-800";
      case RoomStatus.Cleaning:
        return "bg-blue-100 text-blue-800";
      case RoomStatus.Unavailable:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stay Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStays.map((stay) => (
              <tr key={stay._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTypeIcon(stay.type as StayType)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {stay._id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stay.type.charAt(0).toUpperCase() +
                          stay.type.slice(1).replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {stay.guestName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {stay.emailAddress}
                    </div>
                    <div className="text-sm text-gray-500">
                      {stay.phoneNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Room {stay.roomId.roomNumber}
                    </div>
                    {/* {(() => {
                      const roomDetails = getRoomDetails(stay.roomId._id);
                      const roomTypeDetails = getRoomTypeDetails(roomDetails?.roomTypeId || stay.roomId.roomTypeId);
                      return (
                        <>
                          <div className="text-sm text-gray-500">
                            {roomTypeDetails?.name || 'N/A'}
                          </div>
                          {roomDetails?.roomStatus && (
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(roomDetails.roomStatus)}`}>
                                {getRoomStatusIcon(roomDetails.roomStatus)} {roomDetails.roomStatus}
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()} */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      Check-in:{" "}
                      {new Date(stay.checkInDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Check-out:{" "}
                      {new Date(stay.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {stay.adults} adults, {stay.children} children
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      {stay.paymentMethod.replace("_", " ").toUpperCase()}
                    </div>
                    <span
                      className={getPaymentStatusBadge(stay.paymentStatus)}
                    >
                      {stay.paymentStatus}
                    </span>
                    {stay.paymentDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Due: {new Date(stay.paymentDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {stay.totalAmount && (
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(stay.totalAmount, selectedHotel?.currency)}
                      </div>
                    )}
                    {stay.paidAmount && (
                      <div className="text-sm text-gray-500">
                        Paid: {formatPrice(stay.paidAmount, selectedHotel?.currency)}
                      </div>
                    )}
                    {stay.totalAmount && stay.paidAmount && (
                      <div className="text-xs text-gray-500">
                        Balance: {formatPrice(stay.totalAmount - (stay.paidAmount || 0), selectedHotel?.currency)}
                      </div>
                    )}
                    {stay.roomRateAtPayment !== undefined ? (
                      <div className="text-xs text-blue-600">
                        Room Rate at Payment: {formatPrice(stay.roomRateAtPayment, selectedHotel?.currency)}
                      </div>
                    ) : (
                      <div className="text-xs text-red-600">
                        Room Rate at Payment: <span className="italic">Not yet paid</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(stay.status)}
                    <span className="ml-2 text-sm text-gray-900">
                      {stay.status.replace("_", " ")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewStay(stay)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditStay(stay)}
                      className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                      title="Edit Stay"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {/* <button
                      onClick={() => onDeleteStay(stay)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Stay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStays.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No guest(s) found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter || paymentStatusFilter
              ? "Try adjusting your filters"
              : `No ${selectedTab.toLowerCase()} found`}
          </p>
        </div>
      )}
    </div>
  );
}







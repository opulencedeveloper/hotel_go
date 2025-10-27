'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Eye, 
  Bed, 
  Edit, 
  Printer, 
  Building, 
  Plane,
  CheckCircle,
  Clock,
  UserCheck,
  X
} from 'lucide-react';
import { StaySliceParams } from '@/store/redux/stay-slice';
import { StayStatus, StayType } from '@/utils/enum';
import { useHttp } from '@/hooks/useHttp';
import { useDispatch } from 'react-redux';
import { stayActions } from '@/store/redux/stay-slice';

interface GuestCardProps {
  booking: StaySliceParams;
  type: 'arrival' | 'departure' | 'inhouse';
  folio?: any;
  onView: (booking: StaySliceParams) => void;
  onEdit: (booking: StaySliceParams) => void;
  onRoomAssignment?: (booking: StaySliceParams) => void;
  onCheckIn?: (booking: StaySliceParams) => void;
  onCheckOut?: (booking: StaySliceParams) => void;
  onCancel?: (booking: StaySliceParams) => void;
  onPrintReceipt?: (type: 'checkin' | 'checkout', guest: any) => void;
}

export default function GuestCard({
  booking,
  type,
  folio,
  onView,
  onEdit,
  onRoomAssignment,
  onCheckIn,
  onCheckOut,
  onCancel,
  onPrintReceipt
}: GuestCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();
  
  // HTTP hook for status updates
  const {
    isLoading: isUpdatingStatus,
    sendHttpRequest: updateStatusRequest,
    error: updateError,
  } = useHttp();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to handle status updates via HTTP
  const handleStatusUpdate = (newStatus: string) => {
    updateStatusRequest({
      successRes: (res: any) => {
        const resData = res?.data.data;
        console.log("Status updated successfully:", res.data);
        
        // Update Redux state with the new status
        const updatedStay = {
          ...booking,
          status: newStatus
        };
        dispatch(stayActions.updateStay(updatedStay));
      },
      requestConfig: {
        url: `/hotel/update-stay-status/?stayId=${booking._id}`,
        method: "PUT",
        body: {
          status: newStatus,
        },
        successMessage: `Stay ${newStatus} successfully!`,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'checked-in': return <UserCheck className="w-4 h-4" />;
      case 'checked-out': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCardColor = () => {
    switch (type) {
      case 'arrival': return 'bg-primary-100';
      case 'departure': return 'bg-blue-100';
      case 'inhouse': return 'bg-green-100';
      default: return 'bg-primary-100';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'arrival': return 'text-primary-600';
      case 'departure': return 'text-blue-600';
      case 'inhouse': return 'text-green-600';
      default: return 'text-primary-600';
    }
  };

  const nights =  Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <>
    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${getCardColor()} rounded-full flex items-center justify-center`}>
          <User className={`w-6 h-6 ${getIconColor()}`} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-secondary-900">
              {booking.guestName || 'Guest'}
            </h4>
            {booking.type === StayType.RESERVED && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <User className="w-3 h-3 mr-1" />
                Reservation
              </span>
            )}
            {booking.type === StayType.BOOKED && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Building className="w-3 h-3 mr-1" />
                Booking
              </span>
            )}
            {booking.type === StayType.WALK_IN && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <UserCheck className="w-3 h-3 mr-1" />
                Walk-in
              </span>
            )}
            {![StayType.RESERVED, StayType.BOOKED, StayType.WALK_IN].includes(booking.type as StayType) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <User className="w-3 h-3 mr-1" />
                {booking.type || 'Unknown'}
              </span>
            )}
            
            {/* Status Badge */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              booking.status === StayStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
              booking.status === StayStatus.CHECKED_IN ? 'bg-green-100 text-green-800' :
              booking.status === StayStatus.CHECKED_OUT ? 'bg-gray-100 text-gray-800' :
              booking.status === StayStatus.CANCELLED ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.status === StayStatus.CONFIRMED && <Clock className="w-3 h-3 mr-1" />}
              {booking.status === StayStatus.CHECKED_IN && <UserCheck className="w-3 h-3 mr-1" />}
              {booking.status === StayStatus.CHECKED_OUT && <X className="w-3 h-3 mr-1" />}
              {booking.status === StayStatus.CANCELLED && <X className="w-3 h-3 mr-1" />}
              {booking.status === StayStatus.CONFIRMED && 'Confirmed'}
              {booking.status === StayStatus.CHECKED_IN && 'Checked In'}
              {booking.status === StayStatus.CHECKED_OUT && 'Checked Out'}
              {booking.status === StayStatus.CANCELLED && 'Cancelled'}
              {![StayStatus.CONFIRMED, StayStatus.CHECKED_IN, StayStatus.CHECKED_OUT, StayStatus.CANCELLED].includes(booking.status as StayStatus) && booking.status}
            </span>
          </div>
          <p className="text-sm text-secondary-600">
            {type === 'arrival' && `Stay ID: ${booking._id} • Party of ${booking.adults + booking.children}`}
            {type === 'departure' && `Room ${booking.roomId?.roomNumber || 'TBD'} • Stay ID: ${booking._id}`}
            {type === 'inhouse' && `Room ${booking.roomId?.roomNumber || 'TBD'} • ${nights} nights`}
          </p>
          <p className="text-sm text-secondary-500">
            {type === 'arrival' && `${booking.emailAddress || 'No email'} • ${booking.phoneNumber || 'No phone'}`}
            {type === 'departure' && `Check-in: ${isClient ? new Date(booking.checkInDate).toLocaleDateString() : '--/--/----'}`}
            {type === 'inhouse' && `Check-in: ${isClient ? new Date(booking.checkInDate).toLocaleDateString() : '--/--/----'}`}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-secondary-900">
            {type === 'arrival' && (isClient ? new Date(booking.checkInDate).toLocaleDateString() : '--/--/----')}
            {type === 'departure' && (isClient ? new Date(booking.checkOutDate).toLocaleDateString() : '--/--/----')}
            {type === 'inhouse' && `Balance: $${folio?.balance || 0}`}
          </p>
          {type === 'arrival' && (
            <p className="text-sm text-secondary-600">${booking.paymentStatus}</p>
          )}
          {type === 'departure' && (
            <p className={`text-sm font-medium ${
              folio && folio.balance > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              Balance: ${folio?.balance || 0}
            </p>
          )}
          {type === 'inhouse' && (
            <p className="text-sm text-secondary-600">
              Check-out: {isClient ? new Date(booking.checkOutDate).toLocaleDateString() : '--/--/----'}
            </p>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            type === 'departure' && folio && folio.balance > 0 ? 'bg-red-100 text-red-800' : 
            type === 'departure' ? 'bg-green-100 text-green-800' :
            type === 'inhouse' ? 'bg-green-100 text-green-800' :
            getStatusColor(booking.status)
          }`}>
            {type === 'inhouse' ? (
              <>
                <UserCheck className="w-3 h-3 mr-1" />
                In-House
              </>
            ) : type === 'departure' ? (
              folio && folio.balance > 0 ? 'Outstanding' : 'Settled'
            ) : (
              <>
                {getStatusIcon(booking.status)}
                <span className="ml-1 capitalize">{booking.status.replace('-', ' ')}</span>
              </>
            )}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDetails(true)}
            className="text-primary-600 hover:text-primary-700 p-2"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {/* Status-based next step buttons - exactly 2 buttons */}
          {/* {booking.status === StayStatus.CONFIRMED && (
            <>
              <button
                onClick={() => handleStatusUpdate(StayStatus.CHECKED_IN)}
                disabled={isUpdatingStatus}
                className="btn-primary text-sm disabled:opacity-50"
                title="Check In"
              >
                {isUpdatingStatus ? 'Processing...' : 'Check In'}
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this stay?')) {
                    handleStatusUpdate(StayStatus.CANCELLED);
                  }
                }}
                disabled={isUpdatingStatus}
                className="btn-secondary text-sm disabled:opacity-50"
                title="Cancel Stay"
              >
                {isUpdatingStatus ? 'Processing...' : 'Cancel'}
              </button>
            </>
          )}
          
          {booking.status === StayStatus.CHECKED_IN && (
            <>
              <button
                onClick={() => handleStatusUpdate(StayStatus.CHECKED_OUT)}
                disabled={isUpdatingStatus}
                className="btn-primary text-sm disabled:opacity-50"
                title="Check Out"
              >
                {isUpdatingStatus ? 'Processing...' : 'Check Out'}
              </button>
            </>
          )}
          
          {booking.status === StayStatus.CHECKED_OUT && (
            <span className="text-gray-500 text-sm px-3 py-1 bg-gray-100 rounded">
              Completed
            </span>
          )}
          
          {booking.status === StayStatus.CANCELLED && (
            <span className="text-red-500 text-sm px-3 py-1 bg-red-100 rounded">
              Cancelled
            </span>
          )} */}
        </div>
      </div>
    </div>

    {/* Detailed View Modal */}
    {showDetails && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Guest Details</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-medium">Name:</span> {booking.guestName || 'Guest'}</p>
                <p><span className="font-medium">Email:</span> {booking.emailAddress || 'No email'}</p>
                <p><span className="font-medium">Phone:</span> {booking.phoneNumber || 'No phone'}</p>
                <p><span className="font-medium">Address:</span> {booking.address || 'No address'}</p>
                <p><span className="font-medium">Stay ID:</span> {booking._id}</p>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-3">Room Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-medium">Room Number:</span> {booking.roomId?.roomNumber || 'TBD'}</p>
                <p><span className="font-medium">Room Type ID:</span> {booking.roomId?.roomTypeId || 'Unknown'}</p>
                <p><span className="font-medium">Room ID:</span> {booking.roomId?._id || 'TBD'}</p>
              </div>
            </div>

            {/* Dates & Duration */}
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-3">Dates & Duration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-medium">Check-in Date:</span> {isClient ? new Date(booking.checkInDate).toLocaleDateString() : '--/--/----'}</p>
                <p><span className="font-medium">Check-out Date:</span> {isClient ? new Date(booking.checkOutDate).toLocaleDateString() : '--/--/----'}</p>
                <p><span className="font-medium">Duration:</span> {nights} nights</p>
                <p><span className="font-medium">Type:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.type === 'reservation' ? 'bg-green-100 text-green-800' :
                  booking.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                  booking.type === 'walk-in' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>{booking.type || 'Unknown'}</span></p>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-3">Guest Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-medium">Adults:</span> {booking.adults}</p>
                <p><span className="font-medium">Children:</span> {booking.children}</p>
                <p><span className="font-medium">Total Guests:</span> {booking.adults + booking.children}</p>
                <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === StayStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                  booking.status === StayStatus.CHECKED_IN ? 'bg-green-100 text-green-800' :
                  booking.status === StayStatus.CHECKED_OUT ? 'bg-gray-100 text-gray-800' :
                  booking.status === StayStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>{booking.status || 'Unknown'}</span></p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-medium">Payment Method:</span> {booking.paymentMethod}</p>
                <p><span className="font-medium">Payment Status:</span> {booking.paymentStatus}</p>
                {booking.paymentDate && <p><span className="font-medium">Payment Date:</span> {isClient && booking.paymentDate ? new Date(booking.paymentDate).toLocaleDateString() : '--/--/----'}</p>}
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-medium text-secondary-900 mb-3">Special Requests</h4>
                <p className="text-sm text-secondary-700">{booking.specialRequests}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200">
              <button
                onClick={() => setShowDetails(false)}
                className="btn-secondary"
              >
                Close
              </button>
              {/* {onEdit && (
                <button
                  onClick={() => {
                    onEdit(booking);
                    setShowDetails(false);
                  }}
                  className="btn-primary"
                >
                  Edit
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}


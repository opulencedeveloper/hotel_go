'use client';

import { X, Calendar, Clock, MapPin, Users, DollarSign, CreditCard, FileText, Tag } from 'lucide-react';
import { ScheduledService } from '@/store/redux/scheduled-services-slice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatPrice } from '@/helper';
import { PaymentMethod, PaymentStatus } from '@/utils/enum';
import { useEffect } from 'react';

interface ScheduledServiceDetailsModalProps {
  scheduledService: ScheduledService | null;
  onClose: () => void;
}

export default function ScheduledServiceDetailsModal({
  scheduledService,
  onClose
}: ScheduledServiceDetailsModalProps) {
  // All hooks must be called before any conditional returns
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  useEffect(() => {
    if (scheduledService) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [scheduledService]);

  if (!scheduledService) return null;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      createdAt: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    };
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CARD_PAYMENT:
        return 'Card Payment';
      case PaymentMethod.CASH:
        return 'Cash';
      case PaymentMethod.BANK_TRANSFER:
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.REFUNDED:
        return 'bg-blue-100 text-blue-800';
      case PaymentStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const { date, time, createdAt } = formatDateTime(scheduledService.scheduledAt);
  const createdDate = scheduledService.createdAt 
    ? new Date(scheduledService.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0 overflow-y-auto" style={{ margin: 0, padding: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            Scheduled Service Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Service Information */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-5 border border-primary-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-lg mr-3">
                <Tag className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {scheduledService.hotelServiceId.name}
                </h3>
                <span className="text-sm text-secondary-500 capitalize">
                  {scheduledService.hotelServiceId.category.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Location</p>
                  <p className="text-sm font-medium text-secondary-900">{scheduledService.hotelServiceId.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Capacity</p>
                  <p className="text-sm font-medium text-secondary-900">
                    {scheduledService.hotelServiceId.capacity} {scheduledService.hotelServiceId.capacity === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <DollarSign className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Service Price</p>
                  <p className="text-sm font-semibold text-primary-600">
                    {scheduledService.hotelServiceId.price === 0 
                      ? 'Free' 
                      : formatPrice(scheduledService.hotelServiceId.price, selectedHotel?.currency)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Tag className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Service Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceStatusColor(scheduledService.hotelServiceId.status)}`}>
                    {scheduledService.hotelServiceId.status.charAt(0).toUpperCase() + scheduledService.hotelServiceId.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {scheduledService.hotelServiceId.description && (
              <div className="mt-4 pt-4 border-t border-primary-200">
                <div className="flex items-start">
                  <FileText className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-secondary-500 mb-1">Description</p>
                    <p className="text-sm text-secondary-700 leading-relaxed">{scheduledService.hotelServiceId.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Information */}
          <div className="bg-white border border-secondary-200 rounded-lg p-5">
            <h4 className="font-medium text-secondary-900 mb-4">Schedule Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Scheduled Date</p>
                  <p className="text-sm font-medium text-secondary-900">{date}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Scheduled Time</p>
                  <p className="text-sm font-medium text-secondary-900">{time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-secondary-200 rounded-lg p-5">
            <h4 className="font-medium text-secondary-900 mb-4">Payment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CreditCard className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Payment Method</p>
                  <p className="text-sm font-medium text-secondary-900">
                    {getPaymentMethodLabel(scheduledService.paymentMethod)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Tag className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Payment Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(scheduledService.paymentStatus)}`}>
                    {scheduledService.paymentStatus.charAt(0).toUpperCase() + scheduledService.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <DollarSign className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500 mb-0.5">Total Amount</p>
                  <p className="text-sm font-semibold text-primary-600">
                    {formatPrice(scheduledService.totalAmount, selectedHotel?.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {scheduledService.note && (
            <div className="bg-white border border-secondary-200 rounded-lg p-5">
              <h4 className="font-medium text-secondary-900 mb-2">Notes</h4>
              <div className="flex items-start">
                <FileText className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-secondary-700 leading-relaxed">{scheduledService.note}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-secondary-500">
              <div>
                <span className="font-medium">Scheduled Service ID:</span> {scheduledService._id}
              </div>
              {createdDate && (
                <div>
                  <span className="font-medium">Created:</span> {createdDate}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-secondary-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


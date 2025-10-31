'use client';

import { PaymentStatus, StayStatus, PaymentMethod } from '@/utils/enum';
import { OrderStatus } from '@/lib/server/order/enum';
import { OrderType } from '@/utils/enum';
import { 
  X,
  Download,
  Mail,
  Plus,
  CheckCircle,
  Utensils,
  Calendar,
  Tag,
  MapPin,
  Users,
  CreditCard,
  Clock,
  Bed
} from 'lucide-react';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface FolioModalsProps {
  selectedFolio: any;
  showPaymentModal: boolean;
  showChargeModal: boolean;
  onCloseFolio: () => void;
  onClosePaymentModal: () => void;
  onCloseChargeModal: () => void;
  currency: string;
}

export default function FolioModals({
  selectedFolio,
  showPaymentModal,
  showChargeModal,
  onCloseFolio,
  onClosePaymentModal,
  onCloseChargeModal,
  currency
}: FolioModalsProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  const displayCurrency = selectedHotel?.currency || currency;

  // Get payment method label
  const getPaymentMethodLabel = (method: PaymentMethod | string) => {
    if (!method) return 'N/A';
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

  // Determine item type
  const itemType = selectedFolio?.type || (selectedFolio?.originalData?.hotelServiceId ? 'service' : selectedFolio?.originalData?.items ? 'order' : 'stay');
  const originalData = selectedFolio?.originalData || selectedFolio;

  return (
    <>
      {/* Item Details Modal (Stay/Order/Service) */}
      {selectedFolio && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900">
                {itemType === 'order' ? 'Order Details' : 
                 itemType === 'service' ? 'Scheduled Service Details' : 
                 `Folio Details - ${selectedFolio.guest || 'N/A'}`}
              </h3>
              <button
                onClick={onCloseFolio}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* STAY/FOLIO DETAILS */}
              {itemType === 'stay' && (
                <>
                  {/* Guest Information */}
                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary-900 mb-3">Guest Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-secondary-600">Name:</span>
                        <p className="font-medium text-secondary-900">{selectedFolio.guest || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-secondary-600">Room:</span>
                        <p className="font-medium text-secondary-900">{selectedFolio.room || 'N/A'}</p>
                      </div>
                      {selectedFolio.email && (
                        <div>
                          <span className="text-secondary-600">Email:</span>
                          <p className="font-medium text-secondary-900">{selectedFolio.email}</p>
                        </div>
                      )}
                      {selectedFolio.phone && (
                        <div>
                          <span className="text-secondary-600">Phone:</span>
                          <p className="font-medium text-secondary-900">{selectedFolio.phone}</p>
                        </div>
                      )}
                      {selectedFolio.adults !== undefined && (
                        <div>
                          <span className="text-secondary-600">Adults:</span>
                          <p className="font-medium text-secondary-900">{selectedFolio.adults}</p>
                        </div>
                      )}
                      {selectedFolio.children !== undefined && (
                        <div>
                          <span className="text-secondary-600">Children:</span>
                          <p className="font-medium text-secondary-900">{selectedFolio.children}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stay Period */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary-900 mb-3">Stay Period</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-secondary-600">Check-in:</span>
                        <p className="font-medium text-secondary-900">
                          {selectedFolio.checkIn ? new Date(selectedFolio.checkIn).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary-600">Check-out:</span>
                        <p className="font-medium text-secondary-900">
                          {selectedFolio.checkOut ? new Date(selectedFolio.checkOut).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary-600">Status:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          originalData.status === StayStatus.CHECKED_IN ? 'bg-green-100 text-green-800' : 
                          originalData.status === StayStatus.CHECKED_OUT ? 'bg-blue-100 text-blue-800' : 
                          originalData.status === StayStatus.CONFIRMED ? 'bg-orange-100 text-orange-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {originalData.status || selectedFolio.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedFolio.specialRequests && (
                    <div className="card">
                      <h4 className="font-medium text-secondary-900 mb-3">Special Requests</h4>
                      <div className="p-3 bg-secondary-50 rounded">
                        <p className="text-sm text-secondary-700">{selectedFolio.specialRequests}</p>
                      </div>
                    </div>
                  )}

                  {/* Address Information */}
                  {selectedFolio.address && (
                    <div className="card">
                      <h4 className="font-medium text-secondary-900 mb-3">Address</h4>
                      <div className="p-3 bg-secondary-50 rounded">
                        <p className="text-sm text-secondary-700">{selectedFolio.address}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ORDER DETAILS */}
              {itemType === 'order' && originalData && (
                <>
                  {/* Order Information */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg mr-3">
                        <Utensils className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900">Order Information</h3>
                        <p className="text-xs text-secondary-500">Order #{originalData._id?.slice(-6) || selectedFolio.id.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                      {originalData.tableNumber && (
                        <div>
                          <span className="text-secondary-600">Table Number:</span>
                          <p className="font-medium text-secondary-900">{originalData.tableNumber}</p>
                        </div>
                      )}
                      {originalData.roomId && (
                        <div>
                          <span className="text-secondary-600">Room:</span>
                          <p className="font-medium text-secondary-900">{originalData.roomId}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-secondary-600">Order Type:</span>
                        <p className="font-medium text-secondary-900">
                          {originalData.orderType === OrderType.HOTEL_GUEST ? 'Room Service' : 
                           originalData.orderType === OrderType.RESTAURANT ? 'Restaurant' : 
                           originalData.orderType || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          originalData.status === OrderStatus.PAID ? 'bg-green-100 text-green-800' :
                          originalData.status === OrderStatus.READY ? 'bg-blue-100 text-blue-800' :
                          originalData.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {originalData.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-secondary-600">Created:</span>
                        <p className="font-medium text-secondary-900">
                          {originalData.createdAt ? new Date(originalData.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      {originalData.paymentMethod && (
                        <div>
                          <span className="text-secondary-600">Payment Method:</span>
                          <p className="font-medium text-secondary-900">{getPaymentMethodLabel(originalData.paymentMethod)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-3">Order Items</h3>
                    {originalData.items && originalData.items.length > 0 ? (
                      <div className="space-y-2">
                        {originalData.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-secondary-900">
                                {item.menuId?.itemName || 'Unknown Item'}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-secondary-600">
                                <span>Qty: {item.quantity}</span>
                                <span>Price: {formatPrice(item.priceWhenOrdered, displayCurrency)}</span>
                              </div>
                            </div>
                            <p className="font-semibold text-secondary-900">
                              {formatPrice(item.priceWhenOrdered * item.quantity, displayCurrency)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-500">No items in this order</p>
                    )}
                  </div>

                  {/* Financial Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-secondary-900 mb-3">Financial Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {(() => {
                        const subtotal = originalData.items?.reduce((sum: number, item: any) => 
                          sum + (item.priceWhenOrdered * item.quantity), 0) || 0;
                        const discount = originalData.discount || 0;
                        const tax = originalData.tax || 0;
                        const total = subtotal - discount + tax;
                        
                        return (
                          <>
                            <div>
                              <span className="text-secondary-600">Subtotal:</span>
                              <p className="font-semibold text-secondary-900">{formatPrice(subtotal, displayCurrency)}</p>
                            </div>
                            {discount > 0 && (
                              <div>
                                <span className="text-secondary-600">Discount:</span>
                                <p className="font-semibold text-red-600">-{formatPrice(discount, displayCurrency)}</p>
                              </div>
                            )}
                            {tax > 0 && (
                              <div>
                                <span className="text-secondary-600">Tax:</span>
                                <p className="font-semibold text-secondary-900">{formatPrice(tax, displayCurrency)}</p>
                              </div>
                            )}
                            <div className="col-span-2 pt-2 border-t border-green-200">
                              <span className="text-secondary-600">Total Amount:</span>
                              <p className="text-lg font-bold text-secondary-900">{formatPrice(total, displayCurrency)}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}

              {/* SCHEDULED SERVICE DETAILS */}
              {itemType === 'service' && originalData && (
                <>
                  {/* Service Information */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <Tag className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900">
                          {originalData.hotelServiceId?.name || 'Scheduled Service'}
                        </h3>
                        <p className="text-xs text-secondary-500 capitalize">
                          {originalData.hotelServiceId?.category?.replace('_', ' ') || 'Service'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                      {originalData.hotelServiceId?.location && (
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <span className="text-secondary-600">Location:</span>
                            <p className="font-medium text-secondary-900">{originalData.hotelServiceId.location}</p>
                          </div>
                        </div>
                      )}
                      {originalData.hotelServiceId?.capacity && (
                        <div className="flex items-start">
                          <Users className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <span className="text-secondary-600">Capacity:</span>
                            <p className="font-medium text-secondary-900">
                              {originalData.hotelServiceId.capacity} {originalData.hotelServiceId.capacity === 1 ? 'person' : 'people'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {originalData.hotelServiceId?.description && (
                      <div className="mt-4 pt-4 border-t border-indigo-200">
                        <p className="text-sm text-secondary-700">{originalData.hotelServiceId.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Schedule Information */}
                  <div className="bg-white border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Calendar className="w-5 h-5 text-secondary-600 mr-2" />
                      <h3 className="font-semibold text-secondary-900">Schedule Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <span className="text-secondary-600">Scheduled Date:</span>
                          <p className="font-medium text-secondary-900">
                            {originalData.scheduledAt ? new Date(originalData.scheduledAt).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <span className="text-secondary-600">Scheduled Time:</span>
                          <p className="font-medium text-secondary-900">
                            {originalData.scheduledAt ? new Date(originalData.scheduledAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {originalData.note && (
                        <div className="col-span-2 pt-2 border-t border-secondary-200">
                          <span className="text-secondary-600">Notes:</span>
                          <p className="font-medium text-secondary-900 mt-1">{originalData.note}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <CreditCard className="w-5 h-5 text-secondary-600 mr-2" />
                      <h3 className="font-semibold text-secondary-900">Payment Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-secondary-600">Payment Method:</span>
                        <p className="font-medium text-secondary-900">
                          {originalData.paymentMethod ? getPaymentMethodLabel(originalData.paymentMethod) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary-600">Payment Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          originalData.paymentStatus === PaymentStatus.PAID ? 'bg-green-100 text-green-800' :
                          originalData.paymentStatus === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                          originalData.paymentStatus === PaymentStatus.REFUNDED ? 'bg-blue-100 text-blue-800' :
                          originalData.paymentStatus === PaymentStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {originalData.paymentStatus || 'pending'}
                        </span>
                      </div>
                      <div>
                        <span className="text-secondary-600">Total Amount:</span>
                        <p className="text-lg font-bold text-secondary-900">
                          {formatPrice(originalData.totalAmount || 0, displayCurrency)}
                        </p>
                      </div>
                      {originalData.createdAt && (
                        <div>
                          <span className="text-secondary-600">Created:</span>
                          <p className="font-medium text-secondary-900">
                            {new Date(originalData.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* FINANCIAL SUMMARY (Common for all types) */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-secondary-900 mb-3">Financial Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-600">Total Charges:</span>
                    <p className="font-semibold text-secondary-900">{formatPrice(selectedFolio.totalCharges || 0, displayCurrency)}</p>
                  </div>
                  <div>
                    <span className="text-secondary-600">Total Payments:</span>
                    <p className="font-semibold text-green-900">{formatPrice(selectedFolio.totalPayments || 0, displayCurrency)}</p>
                  </div>
                  <div>
                    <span className="text-secondary-600">Balance:</span>
                    <p className={`font-semibold ${selectedFolio.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPrice(selectedFolio.balance || 0, displayCurrency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-secondary-600">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      selectedFolio.paymentStatus === PaymentStatus.PAID ? 'text-green-600 bg-green-100' : 
                      selectedFolio.paymentStatus === PaymentStatus.PENDING ? 'text-orange-600 bg-orange-100' : 
                      'text-red-600 bg-red-100'
                    }`}>
                      {selectedFolio.paymentStatus || 'Unknown'}
                    </span>
                  </div>
                  {selectedFolio.paymentMethod && (
                    <div>
                      <span className="text-secondary-600">Payment Method:</span>
                      <p className="font-medium text-secondary-900">
                        {getPaymentMethodLabel(selectedFolio.paymentMethod)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
              <button
                onClick={onCloseFolio}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900">Process Payment</h3>
              <button
                onClick={onClosePaymentModal}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Service Type *
                  </label>
                  <select className="input" required>
                    <option value="">Select service</option>
                    <option value="room">Room & Accommodation</option>
                    <option value="restaurant">Restaurant & F&B</option>
                    <option value="spa">Spa & Wellness</option>
                    <option value="event">Events & Conferences</option>
                    <option value="retail">Retail & Gift Shop</option>
                    <option value="transport">Transportation</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Customer/Guest *
                  </label>
                  <input type="text" className="input" placeholder="Enter customer name" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room/Table/Service ID
                  </label>
                  <input type="text" className="input" placeholder="e.g., Room 205, Table 12" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Amount *
                  </label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method *
                  </label>
                  <select className="input" required>
                    <option value="">Select method</option>
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="check">Check</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_payment">Mobile Payment</option>
                    <option value="cryptocurrency">Cryptocurrency</option>
                    <option value="voucher">Voucher/Coupon</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Currency
                  </label>
                  <select className="input">
                    <option value="USD">🇺🇸 USD</option>
                    <option value="EUR">🇪🇺 EUR</option>
                    <option value="GBP">🇬🇧 GBP</option>
                    <option value="JPY">🇯🇵 JPY</option>
                    <option value="CAD">🇨🇦 CAD</option>
                    <option value="AUD">🇦🇺 AUD</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Service Description
                </label>
                <textarea className="input" rows={3} placeholder="Describe the service or items purchased..."></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Staff Member
                  </label>
                  <input type="text" className="input" placeholder="Staff member processing payment" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Reference/Transaction ID
                  </label>
                  <input type="text" className="input" placeholder="Payment reference or transaction ID" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Additional Notes
                </label>
                <textarea className="input" rows={2} placeholder="Any additional notes or special instructions..."></textarea>
              </div>
              
              {/* Payment Summary */}
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                <h4 className="font-medium text-secondary-900 mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Service Type:</span>
                    <span className="font-medium text-secondary-900">Selected service</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Amount:</span>
                    <span className="font-medium text-secondary-900">{formatPrice(0, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Payment Method:</span>
                    <span className="font-medium text-secondary-900">Selected method</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-secondary-900">Total:</span>
                    <span className="font-bold text-secondary-900">{formatPrice(0, currency)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                <button
                  type="button"
                  onClick={onClosePaymentModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Charge Modal */}
      {showChargeModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Add Charge</h3>
              <button
                onClick={onCloseChargeModal}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Folio ID
                </label>
                <input type="text" className="input" placeholder="Enter folio ID" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <input type="text" className="input" placeholder="Charge description" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Amount
                </label>
                <input type="number" step="0.01" className="input" placeholder="0.00" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Category
                </label>
                <select className="input">
                  <option value="">Select category</option>
                  <option value="room">Room Service</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="spa">Spa</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCloseChargeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

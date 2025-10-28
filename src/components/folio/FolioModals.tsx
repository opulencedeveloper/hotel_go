'use client';

import { PaymentStatus, StayStatus } from '@/utils/enum';
import { 
  X,
  Download,
  Mail,
  Plus,
  CheckCircle
} from 'lucide-react';
import { formatPrice } from '@/helper';

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
  return (
    <>
      {/* Folio Details Modal */}
      {selectedFolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Folio Details - {selectedFolio.id}</h3>
              <button
                onClick={onCloseFolio}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Guest Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="font-medium text-secondary-900 mb-3">Guest Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-secondary-600">Name: {selectedFolio.guest}</p>
                      <p className="text-sm text-secondary-600">Room: {selectedFolio.room}</p>
                      <p className="text-sm text-secondary-600">
                        Stay: {new Date(selectedFolio.checkIn).toLocaleDateString()} - {new Date(selectedFolio.checkOut).toLocaleDateString()}
                      </p>
                      {selectedFolio.email && <p className="text-sm text-secondary-600">Email: {selectedFolio.email}</p>}
                      {selectedFolio.phone && <p className="text-sm text-secondary-600">Phone: {selectedFolio.phone}</p>}
                      {selectedFolio.adults && <p className="text-sm text-secondary-600">Adults: {selectedFolio.adults}</p>}
                      {selectedFolio.children && <p className="text-sm text-secondary-600">Children: {selectedFolio.children}</p>}
                    </div>
                </div>
                
                <div className="card">
                  <h4 className="font-medium text-secondary-900 mb-3">Financial Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-secondary-600">Payment Status:</span>
                      <span className={`text-sm font-medium ${
                        selectedFolio.paymentStatus === PaymentStatus.PAID ? 'text-green-600' : 
                        selectedFolio.paymentStatus === PaymentStatus.PENDING ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {selectedFolio.paymentStatus || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-secondary-600">Payment Method:</span>
                      <span className="text-sm font-medium text-secondary-900">
                        {selectedFolio.paymentMethod || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-secondary-600">Stay Status:</span>
                      <span className={`text-sm font-medium ${
                        selectedFolio.status === StayStatus.CHECKED_IN ? 'text-green-600' : 
                        selectedFolio.status === StayStatus.CHECKED_OUT ? 'text-blue-600' : 
                        selectedFolio.status === StayStatus.CONFIRMED ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {selectedFolio.status}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-secondary-900">Last Updated:</span>
                      <span className="text-sm font-medium text-secondary-900">
                        {selectedFolio.lastActivity}
                      </span>
                    </div>
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

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="btn-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
                <button className="btn-secondary">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Invoice
                </button>
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

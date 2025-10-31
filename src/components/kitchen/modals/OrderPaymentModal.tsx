'use client';

import { PaymentMethod } from '@/utils/enum';
import { X, CreditCard, DollarSign, Smartphone, Building2 } from 'lucide-react';

interface OrderPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
  selectedPaymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  isLoading?: boolean;
}

const paymentMethods = [
  { value: PaymentMethod.CASH, label: 'Cash', icon: <DollarSign className="w-5 h-5" /> },
  { value: PaymentMethod.CARD_PAYMENT, label: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
  { value: PaymentMethod.BANK_TRANSFER,  label: 'Bank Transfer', icon: <Building2 className="w-5 h-5" /> },
];

export default function OrderPaymentModal({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  selectedPaymentMethod,
  onPaymentMethodChange,
  isLoading = false
}: OrderPaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-secondary-900">Payment Method</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-secondary-700 mb-4">
            Select payment method for order <span className="font-mono font-semibold">#{orderId}</span>
          </p>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-secondary-200 hover:bg-secondary-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={selectedPaymentMethod === method.value}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-2 rounded-lg ${
                  selectedPaymentMethod === method.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {method.icon}
                </div>
                <span className={`font-medium ${
                  selectedPaymentMethod === method.value
                    ? 'text-blue-700'
                    : 'text-secondary-700'
                }`}>
                  {method.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !selectedPaymentMethod}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Mark as Paid'}
          </button>
        </div>
      </div>
    </div>
  );
}

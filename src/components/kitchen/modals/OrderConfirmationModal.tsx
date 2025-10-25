'use client';

import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: string;
  orderId: string;
  isLoading?: boolean;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  orderId,
  isLoading = false
}: OrderConfirmationModalProps) {
  if (!isOpen) return null;

  const getActionIcon = () => {
    switch (action) {
      case 'Cancel Order':
        return <X className="w-6 h-6 text-red-600" />;
      case 'Mark Ready':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getActionColor = () => {
    switch (action) {
      case 'Cancel Order':
        return 'text-red-600';
      case 'Mark Ready':
        return 'text-green-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getActionIcon()}
            <h2 className="text-lg font-semibold text-secondary-900">Confirm Action</h2>
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
          <p className="text-secondary-700 mb-2">
            Are you sure you want to <span className={`font-semibold ${getActionColor()}`}>{action.toLowerCase()}</span> for order <span className="font-mono font-semibold">#{orderId}</span>?
          </p>
          {action === 'Cancel Order' && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <strong>Warning:</strong> This action cannot be undone. The order will be permanently cancelled.
            </p>
          )}
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
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
              action === 'Cancel Order' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

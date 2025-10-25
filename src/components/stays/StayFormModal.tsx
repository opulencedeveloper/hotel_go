'use client';

import Modal from "@/components/common/Modal";
import { StayType, StayStatus, PaymentStatus } from "@/utils/enum";

interface StayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStay: any;
  setEditingStay: (stay: any) => void;
  selectedTab: StayType;
  onFormSuccess: () => void;
  isUpdating: boolean;
}

export default function StayFormModal({
  isOpen,
  onClose,
  editingStay,
  setEditingStay,
  selectedTab,
  onFormSuccess,
  isUpdating,
}: StayFormModalProps) {
  const statusOptionsDropDown = [
    { value: StayStatus.CONFIRMED, label: "Confirmed" },
    { value: StayStatus.CHECKED_IN, label: "Checked In" },
    { value: StayStatus.CHECKED_OUT, label: "Checked Out" },
    { value: StayStatus.CANCELLED, label: "Cancelled" },
  ];

  const paymentStatusDropDown = [
    { value: PaymentStatus.PAID, label: "Paid" },
    { value: PaymentStatus.PENDING, label: "Pending" },
    { value: PaymentStatus.REFUNDED, label: "Refunded" },
    { value: PaymentStatus.CANCELLED, label: "Cancelled" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStay ? `Edit ${selectedTab}` : `New ${selectedTab}`}
      size="lg"
    >
      <div className="p-6">
        {editingStay ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Edit Stay Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  value={editingStay.guestName || ""}
                  onChange={(e) =>
                    setEditingStay({
                      ...editingStay,
                      guestName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingStay.emailAddress || ""}
                  onChange={(e) =>
                    setEditingStay({
                      ...editingStay,
                      emailAddress: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editingStay.phoneNumber || ""}
                  onChange={(e) =>
                    setEditingStay({
                      ...editingStay,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingStay.status || ""}
                  onChange={(e) =>
                    setEditingStay({ ...editingStay, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptionsDropDown.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {(editingStay.type === StayType.RESERVED ||
                editingStay.type === StayType.BOOKED) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editingStay.paymentStatus || ""}
                    onChange={(e) =>
                      setEditingStay({
                        ...editingStay,
                        paymentStatus: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {paymentStatusDropDown.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  value={editingStay.specialRequests || ""}
                  onChange={(e) =>
                    setEditingStay({
                      ...editingStay,
                      specialRequests: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">
              Create a new stay - This would integrate with your existing form
              components.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onFormSuccess}
            disabled={isUpdating}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isUpdating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {editingStay ? "Update Stay" : "Create Stay"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

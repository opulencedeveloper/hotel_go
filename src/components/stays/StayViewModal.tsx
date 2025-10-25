'use client';

import Modal from "@/components/common/Modal";

interface StayViewModalProps {
  viewingStay: any;
  onClose: () => void;
}

export default function StayViewModal({ viewingStay, onClose }: StayViewModalProps) {
  return (
    <Modal
      isOpen={!!viewingStay}
      onClose={onClose}
      title={`Stay Details - ${viewingStay?._id}`}
      size="lg"
    >
      {viewingStay && (
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Guest Information</h4>
              <p className="text-sm text-gray-600">
                Name: {viewingStay.guestName}
              </p>
              <p className="text-sm text-gray-600">
                Email: {viewingStay.emailAddress}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {viewingStay.phoneNumber}
              </p>
              <p className="text-sm text-gray-600">
                Address: {viewingStay.address}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Stay Information</h4>
              <p className="text-sm text-gray-600">
                Room: {viewingStay.roomId?.roomNumber}
              </p>
              <p className="text-sm text-gray-600">
                Type: {viewingStay.roomId?.roomTypeId?.name}
              </p>
              <p className="text-sm text-gray-600">
                Check-in:{" "}
                {new Date(viewingStay.checkInDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Check-out:{" "}
                {new Date(viewingStay.checkOutDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Payment Information
              </h4>
              <p className="text-sm text-gray-600">
                Method: {viewingStay.paymentMethod}
              </p>
              <p className="text-sm text-gray-600">
                Status: {viewingStay.paymentStatus}
              </p>
              {viewingStay.paymentDate && (
                <p className="text-sm text-gray-600">
                  Due:{" "}
                  {new Date(viewingStay.paymentDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Special Requests</h4>
              <p className="text-sm text-gray-600">
                {viewingStay.specialRequests || "None"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}





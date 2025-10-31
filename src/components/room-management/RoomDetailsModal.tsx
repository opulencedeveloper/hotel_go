'use client';

import { X, Edit } from "lucide-react";
import { Room } from "@/types";
import { RoomStatus } from "@/types/room-management/enum";

interface RoomDetailsModalProps {
  selectedRoom: Room | null;
  onClose: () => void;
  isClient: boolean;
}

export default function RoomDetailsModal({ 
  selectedRoom, 
  onClose, 
  isClient 
}: RoomDetailsModalProps) {
  if (!selectedRoom || !isClient) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case RoomStatus.MarkForCleaning:
        return "bg-orange-100 text-orange-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "cleaning":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
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

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            Room Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-secondary-900">
                Room Information
              </h4>
              <p className="text-sm text-secondary-600">
                Number: {selectedRoom.room_number}
              </p>
              <p className="text-sm text-secondary-600">
                Type: {selectedRoom.room_type_id}
              </p>
              <p className="text-sm text-secondary-600">
                Floor: {selectedRoom.floor}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900">Status</h4>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  selectedRoom.status
                )}`}
              >
                {getStatusIcon(selectedRoom.status)}
                <span className="ml-1 capitalize">
                  {selectedRoom.status}
                </span>
              </span>
            </div>
          </div>

          {selectedRoom.last_cleaned && (
            <div>
              <h4 className="font-medium text-secondary-900">
                Last Cleaned
              </h4>
              <p className="text-sm text-secondary-600">
                {isClient
                  ? new Date(selectedRoom.last_cleaned).toLocaleDateString()
                  : "--/--/----"}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
          >
            Close
          </button>
          <button className="btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Room
          </button>
        </div>
      </div>
    </div>
  );
}

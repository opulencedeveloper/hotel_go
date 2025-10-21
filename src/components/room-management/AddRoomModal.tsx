import { formatPrice } from "@/helper";
import { useHttp } from "@/hooks/useHttp";
import { roomStatusList } from "@/resources/room-management";
import { RootState } from "@/store";
import { roomActions } from "@/store/redux/room-slice";
import { RoomStatus } from "@/types/room-management/enum";
import {
  AddRoomModalProps,
  AddRoomModalType,
} from "@/types/room-management/room-management";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ValidationErrors {
  roomNumber?: string;
  roomType?: string;
  floor?: string;
  general?: string;
}

export default function AddRoomModal({ onClose, addRoomType }: AddRoomModalProps) {
  const { isLoading, sendHttpRequest: addRoomReq, error } = useHttp();
    const room = useSelector((state: RootState) => state.room);
    const hotel = useSelector((state: RootState) => state.hotel);
    const dispatch = useDispatch();
      const selectedHotelId = hotel.selectedHotelId;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === selectedHotelId);
    const {hotelRoomTypes} = room;

  const [newRoomForm, setNewRoomForm] = useState<AddRoomModalType>({
    roomNumber: "",
    roomStatus: RoomStatus.Available,
    roomTypeId: "",
    floor: 1,
    note: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const addRoomReqSuccessResHandler = (res: any) => {
      const addedRoom = res?.data?.data.addedRoom;
  
      dispatch(roomActions.addRoom(addedRoom));
    setValidationErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Room Number validation
    if (!newRoomForm.roomNumber.trim()) {
      errors.roomNumber = "Room number is required";
    } else if (!/^[A-Za-z0-9\-\s]+$/.test(newRoomForm.roomNumber.trim())) {
      errors.roomNumber =
        "Room number can only contain letters, numbers, hyphens, and spaces";
    } else if (newRoomForm.roomNumber.trim().length < 2) {
      errors.roomNumber = "Room number must be at least 2 characters long";
    } else if (newRoomForm.roomNumber.trim().length > 20) {
      errors.roomNumber = "Room number must be less than 20 characters";
    }

    // Room Type validation
    if (!newRoomForm.roomTypeId) {
      errors.roomType = "Please select a room type";
    } else if (hotelRoomTypes.length === 0) {
      errors.roomType = "No room types available. Please add room types first.";
    }

    // Floor validation
    if (!newRoomForm.floor || newRoomForm.floor < 1) {
      errors.floor = "Floor must be at least 1";
    } else if (newRoomForm.floor > 100) {
      errors.floor = "Floor cannot exceed 100";
    }

    // Notes validation (optional but if provided, should be reasonable length)
    if (newRoomForm.note && newRoomForm.note.length > 500) {
      errors.general = "Notes cannot exceed 500 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateField = (fieldName: keyof ValidationErrors, value: any): string | undefined => {
    switch (fieldName) {
      case 'roomNumber':
        if (!value?.trim()) {
          return "Room number is required";
        } else if (!/^[A-Za-z0-9\-\s]+$/.test(value.trim())) {
          return "Room number can only contain letters, numbers, hyphens, and spaces";
        } else if (value.trim().length < 2) {
          return "Room number must be at least 2 characters long";
        } else if (value.trim().length > 20) {
          return "Room number must be less than 20 characters";
        }
        return undefined;

      case 'roomType':
        if (!value) {
          return "Please select a room type";
        } else if (hotelRoomTypes.length === 0) {
          return "No room types available. Please add room types first.";
        }
        return undefined;

      case 'floor':
        if (!value || value < 1) {
          return "Floor must be at least 1";
        } else if (value > 100) {
          return "Floor cannot exceed 100";
        }
        return undefined;

      case 'general':
        if (value && value.length > 500) {
          return "Notes cannot exceed 500 characters";
        }
        return undefined;

      default:
        return undefined;
    } 
  };

  const handleNewRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});

    // Check if room types are available
    if (hotelRoomTypes.length === 0) {
      setValidationErrors({
        roomType: "No room types available. Please add room types first.",
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    addRoomReq({
      successRes: addRoomReqSuccessResHandler,
      requestConfig: {
        url: "/hotel/add-room",
        method: "POST",
        body: {
          ...newRoomForm,
        },
        successMessage: "Room added successfully!"
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            Add New Room
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleNewRoomSubmit} className="space-y-6">
          {/* HTTP Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Error Display */}
          {validationErrors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {validationErrors.general}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Room Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newRoomForm.roomNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRoomForm({
                    ...newRoomForm,
                    roomNumber: value,
                  });
                  
                  // Real-time validation
                  const error = validateField('roomNumber', value);
                  setValidationErrors({
                    ...validationErrors,
                    roomNumber: error,
                  });
                }}
                onBlur={(e) => {
                  // Validate on blur for better UX
                  const error = validateField('roomNumber', e.target.value);
                  setValidationErrors({
                    ...validationErrors,
                    roomNumber: error,
                  });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  validationErrors.roomNumber
                    ? "border-red-300 bg-red-50"
                    : "border-secondary-300"
                }`}
                placeholder="e.g., 101"
              />
              {validationErrors.roomNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.roomNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Room Type <span className="text-red-500">*</span>
              </label>
              {hotelRoomTypes.length > 0 ? (
                <select
                  value={newRoomForm.roomTypeId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewRoomForm({ ...newRoomForm, roomTypeId: value });
                    
                    // Real-time validation
                    const error = validateField('roomType', value);
                    setValidationErrors({
                      ...validationErrors,
                      roomType: error,
                    });
                  }}
                  onBlur={(e) => {
                    // Validate on blur for better UX
                    const error = validateField('roomType', e.target.value);
                    setValidationErrors({
                      ...validationErrors,
                      roomType: error,
                    });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.roomType
                      ? "border-red-300 bg-red-50"
                      : "border-secondary-300"
                  }`}
                >
                  <option value="">Select a room type</option>
                  {hotelRoomTypes.map((roomType) => (
                    <option key={roomType._id} value={roomType._id}>
                      {roomType.name} - {roomType.capacity} guests - {formatPrice(roomType.price, selectedHotel?.currency)}/night
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                   //onClose();
                    addRoomType();
                    }}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Add room types
                  </button>
                </div>
              )}
              {validationErrors.roomType && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.roomType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={newRoomForm.floor}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewRoomForm({
                    ...newRoomForm,
                    floor: value,
                  });
                  
                  // Real-time validation
                  const error = validateField('floor', value);
                  setValidationErrors({
                    ...validationErrors,
                    floor: error,
                  });
                }}
                onBlur={(e) => {
                  // Validate on blur for better UX
                  const value = parseInt(e.target.value) || 0;
                  const error = validateField('floor', value);
                  setValidationErrors({
                    ...validationErrors,
                    floor: error,
                  });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  validationErrors.floor
                    ? "border-red-300 bg-red-50"
                    : "border-secondary-300"
                }`}
              />
              {validationErrors.floor && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.floor}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Status
              </label>
              <select
                value={newRoomForm.roomStatus}
                onChange={(e) =>
                  setNewRoomForm({
                    ...newRoomForm,
                    roomStatus: e.target.value as RoomStatus,
                  })
                }
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {roomStatusList.map((status, index) => (
                  <option key={index} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes
              </label>
              <textarea
                value={newRoomForm.note}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRoomForm({ ...newRoomForm, note: value });
                  
                  // Real-time validation for notes
                  const error = validateField('general', value);
                  setValidationErrors({
                    ...validationErrors,
                    general: error,
                  });
                }}
                onBlur={(e) => {
                  // Validate on blur for better UX
                  const error = validateField('general', e.target.value);
                  setValidationErrors({
                    ...validationErrors,
                    general: error,
                  });
                }}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  validationErrors.general
                    ? "border-red-300 bg-red-50"
                    : "border-secondary-300"
                }`}
                placeholder="Additional notes about this room..."
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.general && (
                  <p className="text-sm text-red-600">
                    {validationErrors.general}
                  </p>
                )}
                <p className="text-xs text-secondary-500 ml-auto">
                  {(newRoomForm.note || '').length}/500 characters
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || hotelRoomTypes.length === 0 || Object.values(validationErrors).some(error => error !== undefined)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

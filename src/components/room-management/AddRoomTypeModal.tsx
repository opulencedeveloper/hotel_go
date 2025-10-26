import { RootState } from "@/store";
import { AddRoomTypeModalProps } from "@/types/room-management/room-management";
import { Star, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ManageHotelAmenitiesModal from "./ManageHotelAmenitiesModal";
import { useHttp } from "@/hooks/useHttp";
import { roomActions } from "@/store/redux/room-slice";

interface ValidationErrors {
  name?: string;
  capacity?: string;
  price?: string;
  description?: string;
  general?: string;
}

export default function AddRoomTypeModal({ isOpen, onClose }: AddRoomTypeModalProps) {
  if (!isOpen) return null;
  const [showAmenitiesManager, setShowAmenitiesManager] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [newRoomTypeForm, setNewRoomTypeForm] = useState({
    name: "",
    description: "",
    capacity: 2,
    price: 150,
    amenities: [] as string[],
  });
  const { isLoading, sendHttpRequest: createRoomTypeReq, error } = useHttp();

  const hotel = useSelector((state: RootState) => state.hotel);
  const dispatch = useDispatch();

  const selectedHotelId = hotel.selectedHotelId;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === selectedHotelId);
  const amenities = selectedHotel?.amenities;

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!newRoomTypeForm.name.trim()) {
      errors.name = "Room type name is required";
    } else if (!/^[A-Za-z0-9\s\-\&]+$/.test(newRoomTypeForm.name.trim())) {
      errors.name =
        "Room type name can only contain letters, numbers, spaces, hyphens, and ampersands";
    } else if (newRoomTypeForm.name.trim().length < 2) {
      errors.name = "Room type name must be at least 2 characters long";
    } else if (newRoomTypeForm.name.trim().length > 50) {
      errors.name = "Room type name must be less than 50 characters";
    }

    // Capacity validation
    if (!newRoomTypeForm.capacity || newRoomTypeForm.capacity < 1) {
      errors.capacity = "Capacity must be at least 1";
    } else if (newRoomTypeForm.capacity > 20) {
      errors.capacity = "Capacity cannot exceed 20 guests";
    }

    // Base rate validation
    if (!newRoomTypeForm.price || newRoomTypeForm.price <= 0) {
      errors.price = "Base rate must be greater than 0";
    }

    // Description validation (optional but if provided, should be reasonable length)
    if (
      newRoomTypeForm.description &&
      newRoomTypeForm.description.length > 500
    ) {
      errors.description = "Description cannot exceed 500 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createRoomTypeSuccessRes = (res: any) => {
    const addedRoomType = res?.data?.data.addedRoomType;

    // Check if addedRoomType exists
    if (!addedRoomType || !addedRoomType._id) {
      console.error('Invalid room type data received:', addedRoomType);
      setValidationErrors({ general: 'Failed to add room type. Please try again.' });
      return;
    }

    dispatch(roomActions.addRoomType(addedRoomType));
    setValidationErrors({});
    // Reset form
    setNewRoomTypeForm({
      name: "",
      description: "",
      capacity: 2,
      price: 150,
      amenities: [],
    });

    onClose();
  };

  const handleNewRoomTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new room type:", newRoomTypeForm);

    // Clear previous errors
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    createRoomTypeReq({
      successRes: createRoomTypeSuccessRes,
      requestConfig: {
        url: "/hotel/add-room-type",
        method: "POST",
        body: {
          ...newRoomTypeForm,
        },
        successMessage: "Room type created successfully!",
      },
    });
  };

  const handleRemoveAmenity = (amenityToRemove: string) => {
    setNewRoomTypeForm({
      ...newRoomTypeForm,
      amenities: newRoomTypeForm.amenities.filter(
        (amenity) => amenity !== amenityToRemove
      ),
    });
  };

  return (
    <>
      {" "}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
              Add New Room Type
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* HTTP Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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

          <form onSubmit={handleNewRoomTypeSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Room Type Name *
                </label>
                <input
                  type="text"
                  value={newRoomTypeForm.name}
                  onChange={(e) => {
                    setNewRoomTypeForm({
                      ...newRoomTypeForm,
                      name: e.target.value,
                    });
                    // Clear error when user starts typing
                    if (validationErrors.name) {
                      setValidationErrors({
                        ...validationErrors,
                        name: undefined,
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.name
                      ? "border-red-300 bg-red-50"
                      : "border-secondary-300"
                  }`}
                  placeholder="e.g., Deluxe Suite"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={newRoomTypeForm.capacity}
                  onChange={(e) => {
                    setNewRoomTypeForm({
                      ...newRoomTypeForm,
                      capacity: parseInt(e.target.value) || 1,
                    });
                    // Clear error when user starts typing
                    if (validationErrors.capacity) {
                      setValidationErrors({
                        ...validationErrors,
                        capacity: undefined,
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.capacity
                      ? "border-red-300 bg-red-50"
                      : "border-secondary-300"
                  }`}
                />
                {validationErrors.capacity && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.capacity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Base Rate ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newRoomTypeForm.price}
                  onChange={(e) => {
                    setNewRoomTypeForm({
                      ...newRoomTypeForm,
                      price: parseFloat(e.target.value) || 0,
                    });
                    // Clear error when user starts typing
                    if (validationErrors.price) {
                      setValidationErrors({
                        ...validationErrors,
                        price: undefined,
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.price
                      ? "border-red-300 bg-red-50"
                      : "border-secondary-300"
                  }`}
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.price}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newRoomTypeForm.description}
                  onChange={(e) => {
                    setNewRoomTypeForm({
                      ...newRoomTypeForm,
                      description: e.target.value,
                    });
                    // Clear error when user starts typing
                    if (validationErrors.description) {
                      setValidationErrors({
                        ...validationErrors,
                        description: undefined,
                      });
                    }
                  }}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.description
                      ? "border-red-300 bg-red-50"
                      : "border-secondary-300"
                  }`}
                  placeholder="Describe this room type..."
                />
                <div className="flex justify-between items-center mt-1">
                  {validationErrors.description && (
                    <p className="text-sm text-red-600">
                      {validationErrors.description}
                    </p>
                  )}
                  <p className="text-xs text-secondary-500 ml-auto">
                    {newRoomTypeForm.description.length}/500 characters
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Amenities
                </label>

                {/* Selected Amenities Display */}
                {newRoomTypeForm.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-secondary-700 mb-2">
                      Selected Amenities:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {newRoomTypeForm.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(amenity)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Predefined Amenities */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-secondary-700">
                      Common Amenities:
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAmenitiesManager(true)}
                      className="text-xs text-primary-600 hover:text-primary-800 underline"
                    >
                      {amenities?.length === 0
                        ? "Add Amenities"
                        : "Manage Amenities"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities?.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={newRoomTypeForm.amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRoomTypeForm({
                                ...newRoomTypeForm,
                                amenities: [
                                  ...newRoomTypeForm.amenities,
                                  amenity,
                                ],
                              });
                            } else {
                              setNewRoomTypeForm({
                                ...newRoomTypeForm,
                                amenities: newRoomTypeForm.amenities.filter(
                                  (a) => a !== amenity
                                ),
                              });
                            }
                          }}
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-700">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
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
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Create Room Type
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showAmenitiesManager && (
        <ManageHotelAmenitiesModal
          onClose={() => setShowAmenitiesManager(false)}
        />
      )}
    </>
  );
}

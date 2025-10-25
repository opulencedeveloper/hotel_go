import { mockRoomTypes } from "@/data/mockData";
import { formatPrice } from "@/helper";
import { RootState } from "@/store";
import { RoomType } from "@/types";
import {
  Car,
  Coffee,
  Edit,
  Mountain,
  Plus,
  Star,
  Trash2,
  Tv,
  Waves,
  Wifi,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHttp } from "@/hooks/useHttp";
import { useDispatch } from "react-redux";
import { roomActions } from "@/store/redux/room-slice";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

interface ValidationErrors {
  name?: string;
  capacity?: string;
  price?: string;
  description?: string;
  general?: string;
}

export default function RoomTypes() {
  const room = useSelector((state: RootState) => state.room);
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotelId = hotel.selectedHotelId;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === selectedHotelId);
  const dispatch = useDispatch();
  const { isLoading, sendHttpRequest: updateRoomTypeReq, error } = useHttp();
  const {
    isLoading: isCreating,
    sendHttpRequest: createRoomTypeReq,
    error: createError,
  } = useHttp();
  const {
    isLoading: isDeleting,
    sendHttpRequest: deleteRoomTypeReq,
    error: deleteError,
  } = useHttp();
  const hotelRoomTypes = room.hotelRoomTypes;

 // const [roomTypes, setRoomTypes] = useState(room.hotelRoomTypes);
  const [editingRoomType, setEditingRoomType] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roomTypeToDelete, setRoomTypeToDelete] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [addValidationErrors, setAddValidationErrors] =
    useState<ValidationErrors>({});
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    capacity: 2,
    price: 150,
    amenities: [] as string[],
  });
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    capacity: 2,
    price: 150,
    amenities: [] as string[],
  });

  const getAmenityIcon = (amenity: string) => {
    const normalizedAmenity = amenity.toLowerCase().trim();

    // WiFi/Internet related
    if (
      normalizedAmenity.includes("wifi") ||
      normalizedAmenity.includes("internet") ||
      normalizedAmenity.includes("wireless") ||
      normalizedAmenity.includes("wi-fi")
    ) {
      return <Wifi className="w-3 h-3" />;
    }

    // TV/Entertainment related
    if (
      normalizedAmenity.includes("tv") ||
      normalizedAmenity.includes("television") ||
      normalizedAmenity.includes("smart tv") ||
      normalizedAmenity.includes("cable") ||
      normalizedAmenity.includes("streaming") ||
      normalizedAmenity.includes("netflix")
    ) {
      return <Tv className="w-3 h-3" />;
    }

    // Parking/Transportation related
    if (
      normalizedAmenity.includes("parking") ||
      normalizedAmenity.includes("car") ||
      normalizedAmenity.includes("garage") ||
      normalizedAmenity.includes("valet") ||
      normalizedAmenity.includes("vehicle")
    ) {
      return <Car className="w-3 h-3" />;
    }

    // Coffee/Food related
    if (
      normalizedAmenity.includes("coffee") ||
      normalizedAmenity.includes("tea") ||
      normalizedAmenity.includes("kitchen") ||
      normalizedAmenity.includes("microwave") ||
      normalizedAmenity.includes("refrigerator") ||
      normalizedAmenity.includes("mini bar") ||
      normalizedAmenity.includes("bar") ||
      normalizedAmenity.includes("dining")
    ) {
      return <Coffee className="w-3 h-3" />;
    }

    // Pool/Water related
    if (
      normalizedAmenity.includes("pool") ||
      normalizedAmenity.includes("swimming") ||
      normalizedAmenity.includes("hot tub") ||
      normalizedAmenity.includes("jacuzzi") ||
      normalizedAmenity.includes("spa") ||
      normalizedAmenity.includes("water")
    ) {
      return <Waves className="w-3 h-3" />;
    }

    // Mountain/Nature related
    if (
      normalizedAmenity.includes("mountain") ||
      normalizedAmenity.includes("view") ||
      normalizedAmenity.includes("ocean") ||
      normalizedAmenity.includes("sea") ||
      normalizedAmenity.includes("garden") ||
      normalizedAmenity.includes("nature") ||
      normalizedAmenity.includes("scenic") ||
      normalizedAmenity.includes("balcony") ||
      normalizedAmenity.includes("terrace")
    ) {
      return <Mountain className="w-3 h-3" />;
    }

    // Default fallback
    return <Star className="w-3 h-3" />;
  };

  const handleEditClick = (roomType: any) => {
    setEditingRoomType(roomType);
    setEditForm({
      name: roomType.name,
      description: roomType.description || "",
      capacity: roomType.capacity,
      price: roomType.base_rate || roomType.price,
      amenities: roomType.amenities || [],
    });
    setValidationErrors({});
  };

  const handleEditClose = () => {
    setEditingRoomType(null);
    setEditForm({
      name: "",
      description: "",
      capacity: 2,
      price: 150,
      amenities: [],
    });
    setValidationErrors({});
  };

  const validateEditForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!editForm.name.trim()) {
      errors.name = "Room type name is required";
    } else if (!/^[A-Za-z0-9\s\-\&]+$/.test(editForm.name.trim())) {
      errors.name =
        "Room type name can only contain letters, numbers, spaces, hyphens, and ampersands";
    } else if (editForm.name.trim().length < 2) {
      errors.name = "Room type name must be at least 2 characters long";
    } else if (editForm.name.trim().length > 50) {
      errors.name = "Room type name must be less than 50 characters";
    }

    if (!editForm.capacity || editForm.capacity < 1) {
      errors.capacity = "Capacity must be at least 1";
    } else if (editForm.capacity > 20) {
      errors.capacity = "Capacity cannot exceed 20 guests";
    }

    if (!editForm.price || editForm.price <= 0) {
      errors.price = "Base rate must be greater than 0";
    }

    if (editForm.description && editForm.description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!addForm.name.trim()) {
      errors.name = "Room type name is required";
    } else if (!/^[A-Za-z0-9\s\-\&]+$/.test(addForm.name.trim())) {
      errors.name =
        "Room type name can only contain letters, numbers, spaces, hyphens, and ampersands";
    } else if (addForm.name.trim().length < 2) {
      errors.name = "Room type name must be at least 2 characters long";
    } else if (addForm.name.trim().length > 50) {
      errors.name = "Room type name must be less than 50 characters";
    }

    if (!addForm.capacity || addForm.capacity < 1) {
      errors.capacity = "Capacity must be at least 1";
    } else if (addForm.capacity > 20) {
      errors.capacity = "Capacity cannot exceed 20 guests";
    }

    if (!addForm.price || addForm.price <= 0) {
      errors.price = "Base rate must be greater than 0";
    }

    if (addForm.description && addForm.description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
    }

    setAddValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateRoomTypeSuccessRes = (res: any) => {
    const updatedRoomType = res?.data?.data.updatedRoomType;
    
    // Check if updatedRoomType exists
    if (!updatedRoomType || !updatedRoomType._id) {
      console.error('Invalid room type data received:', updatedRoomType);
      return;
    }
   
    // Update Redux app-wide state
    dispatch(roomActions.updateRoomType(updatedRoomType));
    setValidationErrors({});
    handleEditClose();
  };

  const createRoomTypeSuccessRes = (res: any) => {
    const newRoomType = res?.data?.data.addedRoomType;
    
    // Check if newRoomType exists
    if (!newRoomType || !newRoomType._id) {
      console.error('Invalid room type data received:', newRoomType);
      setAddValidationErrors({ general: 'Failed to add room type. Please try again.' });
      return;
    }
    
    // Add the new room type to local state
    setAddValidationErrors({});
    setAddForm({
      name: "",
      description: "",
      capacity: 2,
      price: 150,
      amenities: [],
    });
    setShowAddModal(false);
  };

  const deleteRoomTypeSuccessRes = (res: any) => {
    const deletedRoomTypeId = res?.data?.data.deletedRoomType?._id;
    
    // Check if deletedRoomTypeId exists
    if (!deletedRoomTypeId) {
      console.error('Invalid room type data received:', res?.data?.data);
      return;
    }
    
    // Remove the room type from local state
    // Update Redux app-wide state
    dispatch(roomActions.deleteRoomType(deletedRoomTypeId));
    // Close the dialog
    setShowDeleteDialog(false);
    setRoomTypeToDelete(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors({});

    if (!validateEditForm()) {
      return;
    }

    updateRoomTypeReq({
      successRes: updateRoomTypeSuccessRes,
      requestConfig: {
        url: `/hotel/update-room-type?roomTypeId=${editingRoomType?._id}`,
        method: "PUT",
        body: {
          ...editForm,
        },
        successMessage: "Room type updated successfully!",
      },
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setAddValidationErrors({});

    if (!validateAddForm()) {
      return;
    }

    createRoomTypeReq({
      successRes: createRoomTypeSuccessRes,
      requestConfig: {
        url: "/hotel/add-room-type",
        method: "POST",
        body: {
          ...addForm,
        },
        successMessage: "Room type created successfully!",
      },
    });
  };

  const handleRemoveAmenity = (amenityToRemove: string) => {
    setEditForm({
      ...editForm,
      amenities: editForm.amenities.filter(
        (amenity) => amenity !== amenityToRemove
      ),
    });
  };

  const handleAddRemoveAmenity = (amenityToRemove: string) => {
    setAddForm({
      ...addForm,
      amenities: addForm.amenities.filter(
        (amenity) => amenity !== amenityToRemove
      ),
    });
  };

  const handleAddClose = () => {
    setShowAddModal(false);
    setAddForm({
      name: "",
      description: "",
      capacity: 2,
      price: 150,
      amenities: [],
    });
    setAddValidationErrors({});
  };

  const handleDeleteClick = (roomType: any) => {
    setRoomTypeToDelete(roomType);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (roomTypeToDelete) {
      deleteRoomTypeReq({
        successRes: deleteRoomTypeSuccessRes,
        requestConfig: {
          url: `/hotel/delete-room-type?roomTypeId=${roomTypeToDelete._id}`,
          method: "DELETE",
          successMessage: "Room type deleted successfully!",
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setRoomTypeToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-secondary-900">Room Types</h3>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Room Type
        </button>
      </div>

      {/* Delete Error Display */}
      {deleteError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{deleteError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelRoomTypes.map((type) => (
          <div key={type._id} className="card min-h-[280px] flex flex-col">
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-lg font-semibold text-secondary-900 truncate flex-1 min-w-0" title={type.name}>
                  {type.name}
                </h4>
                <span className="text-sm font-medium text-primary-600 whitespace-nowrap flex-shrink-0">
                  {formatPrice(type.price, selectedHotel?.currency)}/night
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Capacity</span>
                <span className="text-sm font-medium text-secondary-900">
                  {type.capacity} guests
                </span>
              </div>

              <div>
                <span className="text-sm text-secondary-600">
                  Amenities{type?.amenities?.length === 0 && "(None)"}
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {type?.amenities?.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded max-w-full"
                      title={amenity}
                    >
                      {getAmenityIcon(amenity)}
                      <span className="ml-1 truncate max-w-[120px]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p 
                className="text-sm text-secondary-600 overflow-hidden" 
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
                title={type.description}
              >
                {type.description}
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-auto pt-4 border-t border-secondary-200">
              <button
                onClick={() => handleEditClick(type)}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                <Edit className="w-3 h-3 inline mr-1" />
                Edit
              </button>
              {/* <button 
                onClick={() => handleDeleteClick(type)}
                disabled={isDeleting}
                className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isDeleting && roomTypeToDelete._id === type._id) ? (
                  <>
                    <div className="w-3 h-3 inline mr-1 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 inline mr-1" />
                    Delete
                  </>
                )}
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Room Type Modal */}
      {editingRoomType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Edit Room Type
              </h2>
              <button
                onClick={handleEditClose}
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

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Type Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => {
                      setEditForm({ ...editForm, name: e.target.value });
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
                    value={editForm.capacity}
                    onChange={(e) => {
                      setEditForm({
                        ...editForm,
                        capacity: parseInt(e.target.value) || 1,
                      });
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
                    value={editForm.price}
                    onChange={(e) => {
                      setEditForm({
                        ...editForm,
                        price: parseFloat(e.target.value) || 0,
                      });
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
                    value={editForm.description}
                    onChange={(e) => {
                      setEditForm({ ...editForm, description: e.target.value });
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
                      {editForm.description.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Amenities
                  </label>

                  {/* Selected Amenities Display */}
                  {editForm.amenities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-secondary-700 mb-2">
                        Selected Amenities:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {editForm.amenities.map((amenity) => (
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

                  {/* Available Amenities */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-secondary-700 mb-2">
                      Available Amenities:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedHotel?.amenities?.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={editForm.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditForm({
                                  ...editForm,
                                  amenities: [...editForm.amenities, amenity],
                                });
                              } else {
                                setEditForm({
                                  ...editForm,
                                  amenities: editForm.amenities.filter(
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
                  onClick={handleEditClose}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Room Type
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Add New Room Type
              </h2>
              <button
                onClick={handleAddClose}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HTTP Error Display */}
            {createError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{createError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Error Display */}
            {addValidationErrors.general && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">
                      {addValidationErrors.general}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Type Name *
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => {
                      setAddForm({ ...addForm, name: e.target.value });
                      if (addValidationErrors.name) {
                        setAddValidationErrors({
                          ...addValidationErrors,
                          name: undefined,
                        });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      addValidationErrors.name
                        ? "border-red-300 bg-red-50"
                        : "border-secondary-300"
                    }`}
                    placeholder="e.g., Deluxe Suite"
                  />
                  {addValidationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {addValidationErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={addForm.capacity}
                    onChange={(e) => {
                      setAddForm({
                        ...addForm,
                        capacity: parseInt(e.target.value) || 1,
                      });
                      if (addValidationErrors.capacity) {
                        setAddValidationErrors({
                          ...addValidationErrors,
                          capacity: undefined,
                        });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      addValidationErrors.capacity
                        ? "border-red-300 bg-red-50"
                        : "border-secondary-300"
                    }`}
                  />
                  {addValidationErrors.capacity && (
                    <p className="mt-1 text-sm text-red-600">
                      {addValidationErrors.capacity}
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
                    value={addForm.price}
                    onChange={(e) => {
                      setAddForm({
                        ...addForm,
                        price: parseFloat(e.target.value) || 0,
                      });
                      if (addValidationErrors.price) {
                        setAddValidationErrors({
                          ...addValidationErrors,
                          price: undefined,
                        });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      addValidationErrors.price
                        ? "border-red-300 bg-red-50"
                        : "border-secondary-300"
                    }`}
                  />
                  {addValidationErrors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {addValidationErrors.price}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={addForm.description}
                    onChange={(e) => {
                      setAddForm({ ...addForm, description: e.target.value });
                      if (addValidationErrors.description) {
                        setAddValidationErrors({
                          ...addValidationErrors,
                          description: undefined,
                        });
                      }
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      addValidationErrors.description
                        ? "border-red-300 bg-red-50"
                        : "border-secondary-300"
                    }`}
                    placeholder="Describe this room type..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {addValidationErrors.description && (
                      <p className="text-sm text-red-600">
                        {addValidationErrors.description}
                      </p>
                    )}
                    <p className="text-xs text-secondary-500 ml-auto">
                      {addForm.description.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Amenities
                  </label>

                  {/* Selected Amenities Display */}
                  {addForm.amenities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-secondary-700 mb-2">
                        Selected Amenities:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {addForm.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                          >
                            {amenity}
                            <button
                              type="button"
                              onClick={() => handleAddRemoveAmenity(amenity)}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Amenities */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-secondary-700 mb-2">
                      Available Amenities:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedHotel?.amenities?.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={addForm.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAddForm({
                                  ...addForm,
                                  amenities: [...addForm.amenities, amenity],
                                });
                              } else {
                                setAddForm({
                                  ...addForm,
                                  amenities: addForm.amenities.filter(
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
                  onClick={handleAddClose}
                  disabled={isCreating}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Room Type
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Room Type"
        message={`Are you sure you want to delete "${roomTypeToDelete?.name}"? This action cannot be undone and will permanently remove this room type from your system.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

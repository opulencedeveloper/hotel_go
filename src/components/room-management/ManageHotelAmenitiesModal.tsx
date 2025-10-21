import { RootState } from "@/store";
import { ManageHotelAmenitiesModalProps } from "@/types/room-management/room-management";
import { Plus, X, Save } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/useHttp";
import { hotelActions } from "@/store/redux/hotel-slice";

export default function ManageHotelAmenitiesModal({
  onClose,
}: ManageHotelAmenitiesModalProps) {
  const [newAmenityName, setNewAmenityName] = useState("");
  const [editingAmenity, setEditingAmenity] = useState<string | null>(null);
  const { isLoading, sendHttpRequest: updateAmenitiesReq, error } = useHttp();

   const dispatch = useDispatch();
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotelId = hotel.selectedHotelId;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === selectedHotelId);
  const hotelAmenities = selectedHotel?.amenities;

  const [amenities, setAmenities] = useState<string[]>([...hotelAmenities!]);

  const handleAddAmenity = () => {
    if (newAmenityName.trim() && !amenities?.includes(newAmenityName.trim())) {
      setAmenities([...amenities, newAmenityName.trim()]);
      setNewAmenityName("");
    }
  };


  const handleEditAmenity = (oldAmenity: string, newAmenity: string) => {
    if (newAmenity.trim() && newAmenity.trim() !== oldAmenity) {
      setAmenities(amenities.map(amenity => 
        amenity === oldAmenity ? newAmenity.trim() : amenity
      ));
      setEditingAmenity(null);
    }
  };

  const handleDeleteAmenity = (amenityToDelete: string) => {
    setAmenities(amenities.filter(amenity => amenity !== amenityToDelete));
  };

  const handleSaveAmenities = () => {
    updateAmenitiesReq({
      successRes: (res: any) => { 
        console.log("Amenities updated successfully:", res);

        const amenities = res.data.data.amenities;

         dispatch(hotelActions.updateAmenities(amenities));
        onClose();
      },
      requestConfig: {
        url: "/hotel/add-amenities",
        method: "PATCH",
        body: {
          amenities: amenities
        },
        successMessage: "Amenities updated successfully!"
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            Manage Amenities
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

        {/* Add New Amenity */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">
            Add New Amenity
          </h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddAmenity();
                }
              }}
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter amenity name (e.g., Jacuzzi, Fireplace)"
            />
            <button
              onClick={handleAddAmenity}
              disabled={
                !newAmenityName.trim() ||
                selectedHotel?.amenities.includes(newAmenityName.trim())
              }
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        {newAmenityName.trim() &&
  amenities?.some(
    (a) => a.toLowerCase() === newAmenityName.trim().toLowerCase()
  ) && (
    <p className="mt-2 text-sm text-red-600">
      This amenity already exists
    </p>
  )}

        </div>

        {/* Amenities List */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 mb-4">
            Current Amenities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenities?.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg"
              >
                {editingAmenity === amenity ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      defaultValue={amenity}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleEditAmenity(amenity, e.currentTarget.value);
                        }
                      }}
                      onBlur={(e) => {
                        if (
                          e.target.value.trim() &&
                          e.target.value.trim() !== amenity
                        ) {
                          handleEditAmenity(amenity, e.target.value);
                        } else {
                          setEditingAmenity(null);
                        }
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-secondary-300 rounded focus:ring-1 focus:ring-primary-500"
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-secondary-900">
                      {amenity}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditingAmenity(amenity)}
                        className="p-1 text-secondary-500 hover:text-primary-600"
                        title="Edit amenity"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteAmenity(amenity)}
                        className="p-1 text-secondary-500 hover:text-red-600"
                        title="Delete amenity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {amenities.length === 0 && (
            <div className="text-center py-8 text-secondary-500">
              <p>No amenities added yet. Add your first amenity above.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAmenities}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

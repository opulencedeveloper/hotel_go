import { mockRooms, mockRoomTypes } from "@/data/mockData";
import { RootState } from "@/store";
import { Room, RoomType } from "@/types";
import { RoomStatus } from "@/types/room-management/enum";
import { Bed, Edit, Eye, Search, X } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHttp } from "@/hooks/useHttp";
import { roomActions } from "@/store/redux/room-slice";
import { roomStatusList } from "@/resources/room-management";

export default function Rooms() {
  // const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const room = useSelector((state: RootState) => state.room);
  const { hotelRoomTypes, hotelRooms } = room;
  const dispatch = useDispatch();
  const { isLoading, sendHttpRequest: updateRoomStatusReq, error } = useHttp();
  const { 
    isLoading: isEditing, 
    sendHttpRequest: updateRoomReq, 
    error: editError 
  } = useHttp();

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    roomNumber: "",
    roomTypeId: "",
    floor: 1,
    roomStatus: RoomStatus.Available,
    note: "",
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case RoomStatus.Available:
        return "bg-green-100 text-green-800";
      case RoomStatus.Occupied:
        return "bg-red-100 text-red-800";
      case RoomStatus.MarkForCleaning:
        return "bg-orange-100 text-orange-800";
      case RoomStatus.Maintenance:
        return "bg-yellow-100 text-yellow-800";
      case RoomStatus.Cleaning:
        return "bg-blue-100 text-blue-800";
      case RoomStatus.Unavailable:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateRoomStatusSuccessRes = (res: any) => {
    const updatedRoom = res?.data?.data.updatedRoom;
    
    // Check if updatedRoom exists
    if (!updatedRoom || !updatedRoom._id) {
      console.error('Invalid room data received:', updatedRoom);
      return;
    }
    
    // Update Redux state
    dispatch(roomActions.updateRoom(updatedRoom));
  };

  const handleStatusChange = (roomId: string, newStatus: Room["status"]) => {
    updateRoomStatusReq({
      successRes: updateRoomStatusSuccessRes,
      requestConfig: {
        url: `/hotel/update-room-status?roomId=${roomId}`,
        method: "PUT",
        body: {
          status: newStatus,
        },
        successMessage: "Room status updated successfully!",
      },
    });
  };

  const handleViewRoom = (room: any) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setSelectedRoom(null);
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    
    // Extract roomTypeId - it might be a string ID or an object
    let roomTypeId = "";
    if (typeof room.roomTypeId === 'string') {
      roomTypeId = room.roomTypeId;
    } else if (room.roomTypeId?._id) {
      roomTypeId = room.roomTypeId._id;
    } else if (room.room_type_id) {
      roomTypeId = room.room_type_id;
    } else if (room.roomTypeId && typeof room.roomTypeId === 'object') {
      // If roomTypeId is an object, find matching room type by name
      const matchingRoomType = hotelRoomTypes.find(
        rt => rt.name === room.roomTypeId.name || rt.name === room.roomTypeName
      );
      roomTypeId = matchingRoomType?._id || "";
    }
    
    setEditForm({
      roomNumber: room.roomNumber || room.room_number || "",
      roomTypeId: roomTypeId,
      floor: room.floor || 1,
      roomStatus: room.roomStatus || room.status || RoomStatus.Available,
      note: room.note || room.notes || "",
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingRoom(null);
    setEditForm({
      roomNumber: "",
      roomTypeId: "",
      floor: 1,
      roomStatus: RoomStatus.Available,
      note: "",
    });
  };

  const updateRoomSuccessRes = (res: any) => {
    const updatedRoom = res?.data?.data.updatedRoom;
    
    // Check if updatedRoom exists
    if (!updatedRoom || !updatedRoom._id) {
      console.error('Invalid room data received:', updatedRoom);
      return;
    }
    
    // Update Redux state
    dispatch(roomActions.updateRoom(updatedRoom));
    // Close modal
    handleCloseEditModal();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateRoomReq({
      successRes: updateRoomSuccessRes,
      requestConfig: {
        url: `/hotel/update-room?roomId=${editingRoom._id}`,
        method: "PUT",
        body: {
          ...editForm,
        },
        successMessage: "Room updated successfully!",
      },
    });
  };

  const filteredRooms = hotelRooms.filter((room) => {
    const matchesSearch =
      room?.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.roomTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || room.roomStatus === statusFilter;
    const matchesType =
      typeFilter === "all" || room.roomTypeName === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 text-red-400">⚠️</div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-40 min-w-0"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-48 min-w-0"
          >
            <option value="all">All Types</option>
            {hotelRoomTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-lg border border-secondary-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <Bed className="w-5 h-5 text-primary-600 mr-3" />
              <span className="text-lg font-semibold text-secondary-900">
                Room {room.roomNumber}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm text-secondary-600 flex-shrink-0">Type</span>
                <span 
                  className="text-sm font-medium text-secondary-900 capitalize truncate min-w-0 flex-1 text-right" 
                  title={room.roomTypeName}
                >
                  {room.roomTypeName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 flex-shrink-0">Floor</span>
                <span className="text-sm font-medium text-secondary-900">
                  {room.floor}
                </span>
              </div>

              {room.lastCleaned ? (
                <div className="text-xs text-secondary-500 truncate" title={`Last cleaned: ${new Date(room.lastCleaned).toLocaleDateString()}`}>
                  Last cleaned:{" "}
                  {new Date(room.lastCleaned).toLocaleDateString()}
                </div>
              ) : (
                <p className="text-xs text-secondary-500">Last cleaned: Not cleaned since creation</p>
              )}
            </div>

            {/* Status Change Section */}
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-secondary-700">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.roomStatus)}`}>
                  {getStatusIcon(room.roomStatus)}
                  <span className="ml-1 capitalize">{room.roomStatus}</span>
                </span>
              </div>
         
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleViewRoom(room)}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Eye className="w-3 h-3 inline mr-1" />
                View
              </button>
              <button 
                onClick={() => handleEditRoom(room)}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-3 h-3 inline mr-1" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mr-4">
                    <Bed className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900">
                      Room {selectedRoom.roomNumber || selectedRoom.room_number} Details
                    </h2>
                    <p className="text-sm text-secondary-600">
                      Complete room information and specifications
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseRoomModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">

            <div className="space-y-8">
              {/* Room Overview Card */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-4">
                    <Bed className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      Room {selectedRoom.roomNumber || selectedRoom.room_number}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {selectedRoom.roomTypeName || selectedRoom.room_type_name} • Floor {selectedRoom.floor}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedRoom.roomStatus || selectedRoom.status)}`}>
                      {getStatusIcon(selectedRoom.roomStatus || selectedRoom.status)}
                      <span className="ml-2 capitalize">{selectedRoom.roomStatus || selectedRoom.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm font-semibold">#</span>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 uppercase tracking-wide">Room Number</p>
                        <p className="text-sm font-semibold text-secondary-900">
                          {selectedRoom.roomNumber || selectedRoom.room_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-green-600 text-sm font-semibold">🏢</span>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 uppercase tracking-wide">Floor</p>
                        <p className="text-sm font-semibold text-secondary-900">
                          {selectedRoom.floor}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-purple-600 text-sm font-semibold">🧹</span>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500 uppercase tracking-wide">Last Cleaned</p>
                        <p className="text-sm font-semibold text-secondary-900">
                          {selectedRoom.lastCleaned || selectedRoom.last_cleaned
                            ? new Date(selectedRoom.lastCleaned || selectedRoom.last_cleaned).toLocaleDateString()
                            : "Never"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {(selectedRoom.note || selectedRoom.notes) && (
                  <div className="mt-6 bg-white rounded-lg p-4 border border-gray-100">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-yellow-600 text-sm font-semibold">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-secondary-500 uppercase tracking-wide mb-2">Notes</p>
                        <p className="text-sm text-secondary-900 leading-relaxed">
                          {selectedRoom.note || selectedRoom.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Room Type Details */}
              {(() => {
                const roomType = hotelRoomTypes.find(rt => rt._id === selectedRoom.roomTypeId || rt._id === selectedRoom.room_type_id);
                return roomType ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white text-lg">🏨</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900">Room Type Details</h3>
                        <p className="text-sm text-secondary-600">{roomType.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-blue-600 text-sm font-semibold">👥</span>
                              </div>
                              <span className="text-sm font-medium text-secondary-700">Capacity</span>
                            </div>
                            <span className="text-lg font-bold text-secondary-900">
                              {roomType.capacity} guests
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-green-600 text-sm font-semibold">💰</span>
                              </div>
                              <span className="text-sm font-medium text-secondary-700">Price per Night</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">
                              ${roomType.price}/night
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-purple-600 text-sm font-semibold">📝</span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-secondary-700 block mb-2">Description</span>
                            <p className="text-sm text-secondary-900 leading-relaxed">
                              {roomType.description || "No description available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {roomType.amenities && roomType.amenities.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-orange-600 text-sm font-semibold">✨</span>
                          </div>
                          <span className="text-sm font-medium text-secondary-700">Amenities</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {roomType.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-primary-100 to-blue-100 text-primary-800 border border-primary-200 hover:from-primary-200 hover:to-blue-200 transition-colors"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseRoomModal}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && editingRoom && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mr-4">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900">
                      Edit Room {editingRoom.roomNumber || editingRoom.room_number}
                    </h2>
                    <p className="text-sm text-secondary-600">
                      Update room information and settings
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Error Display */}
                {editError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{editError}</p>
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
                      value={editForm.roomNumber}
                      onChange={(e) => setEditForm({ ...editForm, roomNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., 101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editForm.roomTypeId}
                      onChange={(e) => setEditForm({ ...editForm, roomTypeId: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a room type</option>
                      {hotelRoomTypes.map((roomType) => (
                        <option key={roomType._id} value={roomType._id}>
                          {roomType.name} - {roomType.capacity} guests - ${roomType.price}/night
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Floor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editForm.floor}
                      onChange={(e) => setEditForm({ ...editForm, floor: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editForm.roomStatus}
                      onChange={(e) => setEditForm({ ...editForm, roomStatus: e.target.value as RoomStatus })}
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
                      value={editForm.note}
                      onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes about this room..."
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      {editForm.note.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={isEditing}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditing}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isEditing ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2 inline" />
                        Update Room
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

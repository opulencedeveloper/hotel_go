"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Search, User, Home } from "lucide-react";
import { RootState } from "@/store/redux";
import { UserRole } from "@/utils/enum";
import { RoomStatus } from "@/types/room-management/enum";
import { useHttp } from "@/hooks/useHttp";
import { staffActions } from "@/store/redux/staff-slice";
import { roomActions } from "@/store/redux/room-slice";
import { houseKeepingActions } from "@/store/redux/house-keeping-slice";

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  userRole: UserRole;
  email: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  roomTypeName: string;
  floor: number;
  roomStatus: string;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember[];
}

export default function NewTaskModal({
  isOpen,
  onClose,
  staff,
}: NewTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedStaffs, setSelectedStaffs] = useState<StaffMember[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  // HTTP hook for fetching staff
  const {
    isLoading: isLoadingStaff,
    sendHttpRequest: fetchStaffRequest,
    error: fetchStaffError,
  } = useHttp();

  // HTTP hook for fetching rooms
  const {
    isLoading: isLoadingRooms,
    sendHttpRequest: fetchRoomsRequest,
    error: fetchRoomsError,
  } = useHttp();

  // HTTP hook for creating housekeeping tasks
  const {
    isLoading: isCreatingTask,
    sendHttpRequest: createTaskRequest,
    error: createTaskError,
  } = useHttp();

  // Get rooms from Redux state
  const roomState = useSelector((state: RootState) => state.room);
  const { hotelRooms, fetchedRooms: roomsFetchedData } = roomState;

  // Filter rooms to only show marked for cleaning status
  const markedForCleaningRooms =
    hotelRooms?.filter(
      (room: any) => room.roomStatus === RoomStatus.MarkForCleaning
    ) || [];

  // Get staff from Redux
  const staffState = useSelector((state: RootState) => state.staff);
  const { staffs: allStaff, fetchedData: staffFetchedData } = staffState || {
    staffs: [],
    fetchedData: false,
  };

  // Filter for active staff with housekeeping role
  const housekeepingStaff =
    allStaff?.filter(
      (member: any) =>
        (member.status === "active" || member.isActive === true) &&
        member.userRole === UserRole.HouseKeeping
    ) || [];

  // Fetch rooms function
  const handleFetchRooms = () => {
    const successHandler = (res: any) => {
      const resData = res?.data?.data;

      const fetchedRoomTypes = resData?.hotelRoomTypes;
      const fetchedRooms = resData?.hotelRooms;

      dispatch(roomActions.setRoomTypes(fetchedRoomTypes));
      dispatch(roomActions.setRooms(fetchedRooms));
    };

    fetchRoomsRequest({
      successRes: successHandler,
      requestConfig: {
        url: "/hotel/room-info",
        method: "GET",
        successMessage: "Rooms loaded successfully",
      },
    });
  };

  // Fetch staff function
  const handleFetchStaff = () => {
    const successHandler = (res: any) => {
      const resData = res?.data?.data;
      const staffs = resData?.staffs;

      console.log("staffs", staffs);

      dispatch(staffActions.setStaffs(staffs));
    };

    const errorHandler = (error: any) => {
      console.error("Failed to fetch staff:", error);
    };

    fetchStaffRequest({
      successRes: successHandler,
      requestConfig: {
        url: "/hotel/get-staffs",
        method: "GET",
        successMessage: "Staff loaded successfully",
      },
    });
  };

  // Get status icon for room display
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStaffs.length === 0 || selectedRooms.length === 0) {
      return;
    }

    const payload = {
      staffIds: selectedStaffs.map((staff) => staff._id),
      roomIds: selectedRooms.map((room) => room._id),
      title: taskTitle,
      description: description || undefined,
    };

    createTaskRequest({
      successRes: (res: any) => {
        console.log("Task created successfully:", res.data);

        const resData = res?.data?.data;

        const houseKeeping = resData?.houseKeeping;

        dispatch(houseKeepingActions.addHouseKeeping(houseKeeping));

        // Reset form
        setTaskTitle("");
        setSelectedStaffs([]);
        setSelectedRooms([]);
        setDescription("");
        onClose();
      },
      requestConfig: {
        url: "/hotel/create-house-keeping",
        method: "POST",
        body: payload,
        successMessage: "Housekeeping task created successfully!",
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">
            Create New Task
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            {/* Assigned To - Housekeeping Staff Only */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Assigned To * (Select multiple staff)
              </label>
              {staffFetchedData && housekeepingStaff.length > 0 ? (
                <div className="space-y-2">
                  <div className="relative">
                    <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-white min-h-[120px] max-h-[200px] overflow-y-auto">
                      {housekeepingStaff.map((member: any) => {
                        const isSelected = selectedStaffs.some(
                          (s) => s._id === member._id
                        );
                        return (
                          <div
                            key={member._id}
                            onClick={() => {
                              if (isSelected) {
                                // Deselect staff
                                setSelectedStaffs((prev) =>
                                  prev.filter((s) => s._id !== member._id)
                                );
                              } else {
                                // Select staff
                                const newStaff = {
                                  _id: member._id,
                                  firstName: member.firstName,
                                  lastName: member.lastName,
                                  userRole:
                                    member.userRole as unknown as UserRole,
                                  email: member.email,
                                };
                                setSelectedStaffs((prev) => [
                                  ...prev,
                                  newStaff,
                                ]);
                              }
                            }}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-primary-100 border border-primary-300 text-primary-900"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {member.firstName} {member.lastName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {member.userRole} • {member.email}
                                </p>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-secondary-500">
                    Click to select/deselect staff members
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleFetchStaff}
                    disabled={isLoadingStaff}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {staffFetchedData && housekeepingStaff.length === 0 ? (
                      <>No Housekeeping Staff Available</>
                    ) : isLoadingStaff ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                        Loading staff...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Load Housekeeping Staff
                      </>
                    )}
                  </button>
                  {fetchStaffError && (
                    <p className="mt-1 text-sm text-red-600">
                      Failed to load staff. Please try again.
                    </p>
                  )}
                </div>
              )}
              {selectedStaffs.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium text-secondary-700">
                    Selected Staff ({selectedStaffs.length}):
                  </p>
                  {selectedStaffs.map((staff) => (
                    <div
                      key={staff._id}
                      className="p-3 bg-primary-50 border border-primary-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-primary-900">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <p className="text-sm text-primary-700">
                            {staff.userRole}
                          </p>
                          <p className="text-xs text-primary-600">
                            {staff.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Room Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Rooms * (Select multiple rooms)
              </label>
              {roomsFetchedData && markedForCleaningRooms.length > 0 ? (
                <div className="space-y-2">
                  <div className="relative">
                    <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-white min-h-[120px] max-h-[200px] overflow-y-auto">
                      {markedForCleaningRooms.map((room: any) => {
                        const isSelected = selectedRooms.some(
                          (r) => r._id === room._id
                        );
                        return (
                          <div
                            key={room._id}
                            onClick={() => {
                              if (isSelected) {
                                // Deselect room
                                setSelectedRooms((prev) =>
                                  prev.filter((r) => r._id !== room._id)
                                );
                              } else {
                                // Select room
                                const newRoom = {
                                  _id: room._id,
                                  roomNumber: room.roomNumber,
                                  roomTypeName: room.roomTypeName,
                                  floor: room.floor,
                                  roomStatus: room.roomStatus,
                                };
                                setSelectedRooms((prev) => [...prev, newRoom]);
                              }
                            }}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-primary-100 border border-primary-300 text-primary-900"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  Room {room.roomNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {room.roomTypeName} • Floor {room.floor}
                                </p>
                                <div className="mt-1">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      room.roomStatus
                                    )}`}
                                  >
                                    {getStatusIcon(room.roomStatus)}{" "}
                                    {room.roomStatus}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-secondary-500">
                    Click to select/deselect rooms
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleFetchRooms}
                    disabled={isLoadingRooms}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {roomsFetchedData && markedForCleaningRooms.length === 0 ? (
                      <>No Rooms Marked for Cleaning</>
                    ) : isLoadingRooms ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                        Loading rooms...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Load Rooms Marked for Cleaning
                      </>
                    )}
                  </button>
                  {fetchRoomsError && (
                    <p className="mt-1 text-sm text-red-600">
                      Failed to load rooms. Please try again.
                    </p>
                  )}
                </div>
              )}
              {selectedRooms.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium text-secondary-700">
                    Selected Rooms ({selectedRooms.length}):
                  </p>
                  {selectedRooms.map((room) => (
                    <div
                      key={room._id}
                      className="p-3 bg-primary-50 border border-primary-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Home className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-primary-900">
                            Room {room.roomNumber}
                          </p>
                          <p className="text-sm text-primary-700">
                            {room.roomTypeName}
                          </p>
                          <p className="text-xs text-primary-600">
                            Floor {room.floor}
                          </p>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                room.roomStatus
                              )}`}
                            >
                              {getStatusIcon(room.roomStatus)} {room.roomStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Description
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="Enter task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {createTaskError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                Failed to create task. Please try again.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isCreatingTask ||
                selectedStaffs.length === 0 ||
                selectedRooms.length === 0
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCreatingTask ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Task...
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

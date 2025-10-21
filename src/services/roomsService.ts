import { useHttp } from "@/hooks/useHttp";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { 
  setRooms, 
  addRoom, 
  updateRoom, 
  deleteRoom,
  setCurrentRoom,
  setLoading,
  setError,
  updateRoomStatus,
  markRoomCleaned,
  markRoomForMaintenance,
  assignRoomToGuest,
  checkoutRoom
} from "@/store/slices/roomsSlice";
import { Room } from "@/store/slices/roomsSlice";

export const useRoomsService = () => {
  const { sendHttpRequest, isLoading, error } = useHttp();
  const dispatch = useDispatch();

  const fetchRooms = useCallback(async (filters?: {
    status?: string;
    floor?: number;
    roomType?: string;
    propertyId?: string;
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.floor) params.append('floor', filters.floor.toString());
    if (filters?.roomType) params.append('roomType', filters.roomType);
    if (filters?.propertyId) params.append('propertyId', filters.propertyId);

    const queryString = params.toString();
    const url = queryString ? `/rooms?${queryString}` : '/rooms';

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setRooms(response.data.data));
        dispatch(setLoading(false));
      }
    });
  }, [dispatch, sendHttpRequest]);

  const fetchRoomById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${id}`,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setCurrentRoom(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const createRoom = async (roomData: Partial<Room>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: '/rooms',
        method: 'POST',
        body: roomData,
        successMessage: 'Room created successfully'
      },
      successRes: (response) => {
        dispatch(addRoom(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const updateRoomById = async (id: string, updates: Partial<Room>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${id}`,
        method: 'PUT',
        body: updates,
        successMessage: 'Room updated successfully'
      },
      successRes: (response) => {
        dispatch(updateRoom({ id, updates: response.data.data }));
        dispatch(setLoading(false));
      }
    });
  };

  const deleteRoomById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${id}`,
        method: 'DELETE',
        successMessage: 'Room deleted successfully'
      },
      successRes: () => {
        dispatch(deleteRoom(id));
        dispatch(setLoading(false));
      }
    });
  };

  const updateRoomStatusById = async (id: string, status: Room['status']) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${id}/status`,
        method: 'PUT',
        body: { status },
        successMessage: 'Room status updated successfully'
      },
      successRes: () => {
        dispatch(updateRoomStatus({ id, status }));
        dispatch(setLoading(false));
      }
    });
  };

  const markRoomAsCleaned = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${id}/clean`,
        method: 'PUT',
        successMessage: 'Room marked as cleaned'
      },
      successRes: () => {
        dispatch(markRoomCleaned(id));
        dispatch(setLoading(false));
      }
    });
  };

  const markRoomForMaintenanceById = async (id: string, reason?: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${id}/maintenance`,
        method: 'PUT',
        body: { reason },
        successMessage: 'Room marked for maintenance'
      },
      successRes: () => {
        dispatch(markRoomForMaintenance({ id, reason }));
        dispatch(setLoading(false));
      }
    });
  };

  const assignRoomToGuestById = async (roomId: string, guest: Room['current_guest']) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${roomId}/assign`,
        method: 'PUT',
        body: { guest },
        successMessage: 'Room assigned to guest'
      },
      successRes: () => {
        dispatch(assignRoomToGuest({ roomId, guest }));
        dispatch(setLoading(false));
      }
    });
  };

  const checkoutRoomById = async (roomId: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/rooms/${roomId}/checkout`,
        method: 'PUT',
        successMessage: 'Room checked out'
      },
      successRes: () => {
        dispatch(checkoutRoom(roomId));
        dispatch(setLoading(false));
      }
    });
  };

  const getAvailableRooms = async (filters?: {
    checkIn?: string;
    checkOut?: string;
    roomType?: string;
    floor?: number;
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (filters?.checkIn) params.append('checkIn', filters.checkIn);
    if (filters?.checkOut) params.append('checkOut', filters.checkOut);
    if (filters?.roomType) params.append('roomType', filters.roomType);
    if (filters?.floor) params.append('floor', filters.floor.toString());

    const queryString = params.toString();
    const url = `/rooms/available${queryString ? `?${queryString}` : ''}`;

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setRooms(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const getRoomOccupancy = async (dateRange?: { start: string; end: string }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (dateRange?.start) params.append('start', dateRange.start);
    if (dateRange?.end) params.append('end', dateRange.end);

    const queryString = params.toString();
    const url = `/rooms/occupancy${queryString ? `?${queryString}` : ''}`;

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setLoading(false));
        return response.data.data;
      }
    });
  };

  return {
    fetchRooms,
    fetchRoomById,
    createRoom,
    updateRoomById,
    deleteRoomById,
    updateRoomStatusById,
    markRoomAsCleaned,
    markRoomForMaintenanceById,
    assignRoomToGuestById,
    checkoutRoomById,
    getAvailableRooms,
    getRoomOccupancy,
    isLoading,
    error
  };
};

import { useHttp } from "@/hooks/useHttp";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { 
  setReservations, 
  addReservation, 
  updateReservation, 
  deleteReservation,
  setCurrentReservation,
  setLoading,
  setError,
  checkInReservation,
  checkOutReservation
} from "@/store/slices/reservationsSlice";
import { Reservation } from "@/store/slices/reservationsSlice";

export const useReservationsService = () => {
  const { sendHttpRequest, isLoading, error } = useHttp();
  const dispatch = useDispatch();

  const fetchReservations = useCallback(async (filters?: {
    status?: string;
    guestId?: string;
    roomId?: string;
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.guestId) params.append('guestId', filters.guestId);
    if (filters?.roomId) params.append('roomId', filters.roomId);

    const queryString = params.toString();
    const url = queryString ? `/reservations?${queryString}` : '/reservations';

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setReservations(response.data.data));
        dispatch(setLoading(false));
      }
    });
  }, [dispatch, sendHttpRequest]);

  const fetchReservationById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/reservations/${id}`,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setCurrentReservation(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const createReservation = async (reservationData: Partial<Reservation>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: '/reservations',
        method: 'POST',
        body: reservationData,
        successMessage: 'Reservation created successfully'
      },
      successRes: (response) => {
        dispatch(addReservation(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const updateReservationById = async (id: string, updates: Partial<Reservation>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/reservations/${id}`,
        method: 'PUT',
        body: updates,
        successMessage: 'Reservation updated successfully'
      },
      successRes: (response) => {
        dispatch(updateReservation({ id, updates: response.data.data }));
        dispatch(setLoading(false));
      }
    });
  };

  const deleteReservationById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/reservations/${id}`,
        method: 'DELETE',
        successMessage: 'Reservation deleted successfully'
      },
      successRes: () => {
        dispatch(deleteReservation(id));
        dispatch(setLoading(false));
      }
    });
  };

  const checkInGuest = async (reservationId: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/reservations/${reservationId}/checkin`,
        method: 'PUT',
        successMessage: 'Guest checked in successfully'
      },
      successRes: () => {
        dispatch(checkInReservation(reservationId));
        dispatch(setLoading(false));
      }
    });
  };

  const checkOutGuest = async (reservationId: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/reservations/${reservationId}/checkout`,
        method: 'PUT',
        successMessage: 'Guest checked out successfully'
      },
      successRes: () => {
        dispatch(checkOutReservation(reservationId));
        dispatch(setLoading(false));
      }
    });
  };

  const cancelReservation = async (reservationId: string, reason?: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/reservations/${reservationId}/cancel`,
        method: 'PUT',
        body: { reason },
        successMessage: 'Reservation cancelled successfully'
      },
      successRes: () => {
        dispatch(updateReservation({ 
          id: reservationId, 
          updates: { status: 'cancelled' } 
        }));
        dispatch(setLoading(false));
      }
    });
  };

  return {
    fetchReservations,
    fetchReservationById,
    createReservation,
    updateReservationById,
    deleteReservationById,
    checkInGuest,
    checkOutGuest,
    cancelReservation,
    isLoading,
    error
  };
};

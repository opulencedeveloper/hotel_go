import { useHttp } from "@/hooks/useHttp";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { 
  setGuests, 
  addGuest, 
  updateGuest, 
  deleteGuest,
  setCurrentGuest,
  setLoading,
  setError,
  updateLoyaltyPoints,
  updatePreferences
} from "@/store/slices/guestsSlice";
import { Guest } from "@/store/slices/guestsSlice";

export const useGuestsService = () => {
  const { sendHttpRequest, isLoading, error } = useHttp();
  const dispatch = useDispatch();

  const fetchGuests = useCallback(async (filters?: {
    search?: string;
    nationality?: string;
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.nationality) params.append('nationality', filters.nationality);

    const queryString = params.toString();
    const url = queryString ? `/guests?${queryString}` : '/guests';

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setGuests(response.data.data));
        dispatch(setLoading(false));
      }
    });
  }, [dispatch, sendHttpRequest]);

  const fetchGuestById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/guests/${id}`,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setCurrentGuest(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const createGuest = async (guestData: Partial<Guest>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: '/guests',
        method: 'POST',
        body: guestData,
        successMessage: 'Guest created successfully'
      },
      successRes: (response) => {
        dispatch(addGuest(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const updateGuestById = async (id: string, updates: Partial<Guest>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/guests/${id}`,
        method: 'PUT',
        body: updates,
        successMessage: 'Guest updated successfully'
      },
      successRes: (response) => {
        dispatch(updateGuest({ id, updates: response.data.data }));
        dispatch(setLoading(false));
      }
    });
  };

  const deleteGuestById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/guests/${id}`,
        method: 'DELETE',
        successMessage: 'Guest deleted successfully'
      },
      successRes: () => {
        dispatch(deleteGuest(id));
        dispatch(setLoading(false));
      }
    });
  };

  const updateGuestLoyaltyPoints = async (id: string, points: number, operation: 'add' | 'subtract' | 'set') => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/guests/${id}/loyalty-points`,
        method: 'PUT',
        body: { points, operation },
        successMessage: 'Loyalty points updated successfully'
      },
      successRes: () => {
        dispatch(updateLoyaltyPoints({ id, points, operation }));
        dispatch(setLoading(false));
      }
    });
  };

  const updateGuestPreferences = async (id: string, preferences: string[]) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/guests/${id}/preferences`,
        method: 'PUT',
        body: { preferences },
        successMessage: 'Guest preferences updated successfully'
      },
      successRes: () => {
        dispatch(updatePreferences({ id, preferences }));
        dispatch(setLoading(false));
      }
    });
  };

  const searchGuests = async (query: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/guests/search?q=${encodeURIComponent(query)}`,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setGuests(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const getGuestHistory = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/guests/${id}/history`,
        method: 'GET',
      },
      successRes: (response) => {
        // Handle guest history data
        dispatch(setLoading(false));
        return response.data.data;
      }
    });
  };

  return {
    fetchGuests,
    fetchGuestById,
    createGuest,
    updateGuestById,
    deleteGuestById,
    updateGuestLoyaltyPoints,
    updateGuestPreferences,
    searchGuests,
    getGuestHistory,
    isLoading,
    error
  };
};

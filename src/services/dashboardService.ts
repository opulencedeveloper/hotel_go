import { useHttp } from "@/hooks/useHttp";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { 
  setStats,
  updateStats,
  setLoading,
  setError,
  updateArrivalsToday,
  updateDeparturesToday,
  updateOccupancy,
  updateRevenue,
  updateTasks,
  updateAlerts,
  updateSystemStatus,
  enableRealTimeUpdates,
  disableRealTimeUpdates
} from "@/store/slices/dashboardSlice";

export const useDashboardService = () => {
  const { sendHttpRequest, isLoading, error } = useHttp();
  const dispatch = useDispatch();

  const fetchDashboardStats = useCallback(async (propertyId?: string, dateRange?: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (propertyId) params.append('propertyId', propertyId);
    if (dateRange) params.append('dateRange', dateRange);

    const queryString = params.toString();
    const url = `/dashboard/stats${queryString ? `?${queryString}` : ''}`;

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setStats(response.data.data));
        dispatch(setLoading(false));
      }
    });
  }, [dispatch, sendHttpRequest]);

  const updateDashboardStats = useCallback(async (updates: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: '/dashboard/stats',
        method: 'PUT',
        body: updates,
        successMessage: 'Dashboard stats updated successfully'
      },
      successRes: (response) => {
        dispatch(updateStats(response.data.data));
        dispatch(setLoading(false));
      }
    });
  }, [dispatch, sendHttpRequest]);

  const getOccupancyData = async (dateRange?: { start: string; end: string }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (dateRange?.start) params.append('start', dateRange.start);
    if (dateRange?.end) params.append('end', dateRange.end);

    const queryString = params.toString();
    const url = `/dashboard/occupancy${queryString ? `?${queryString}` : ''}`;

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

  const getRevenueData = async (dateRange?: { start: string; end: string }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (dateRange?.start) params.append('start', dateRange.start);
    if (dateRange?.end) params.append('end', dateRange.end);

    const queryString = params.toString();
    const url = `/dashboard/revenue${queryString ? `?${queryString}` : ''}`;

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

  const getArrivalsDepartures = async (date?: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (date) params.append('date', date);

    const queryString = params.toString();
    const url = `/dashboard/arrivals-departures${queryString ? `?${queryString}` : ''}`;

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

  const getActiveTasks = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: '/dashboard/tasks',
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setLoading(false));
        return response.data.data;
      }
    });
  };

  const getSystemAlerts = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: '/dashboard/alerts',
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setLoading(false));
        return response.data.data;
      }
    });
  };

  const getKPIs = async (period?: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (period) params.append('period', period);

    const queryString = params.toString();
    const url = `/dashboard/kpis${queryString ? `?${queryString}` : ''}`;

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

  const getForecastData = async (type: 'occupancy' | 'revenue', days: number = 30) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    params.append('type', type);
    params.append('days', days.toString());

    const queryString = params.toString();
    const url = `/dashboard/forecast?${queryString}`;

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

  const startRealTimeUpdates = useCallback(() => {
    dispatch(enableRealTimeUpdates());
    // In a real app, you would set up WebSocket connection here
    // For now, we'll simulate with periodic updates
    const interval = setInterval(() => {
      // Simulate real-time updates
      dispatch(updateArrivalsToday(Math.floor(Math.random() * 10)));
      dispatch(updateDeparturesToday(Math.floor(Math.random() * 8)));
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
      dispatch(disableRealTimeUpdates());
    };
  }, [dispatch]);

  const stopRealTimeUpdates = useCallback(() => {
    dispatch(disableRealTimeUpdates());
  }, [dispatch]);

  return {
    fetchDashboardStats,
    updateDashboardStats,
    getOccupancyData,
    getRevenueData,
    getArrivalsDepartures,
    getActiveTasks,
    getSystemAlerts,
    getKPIs,
    getForecastData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    isLoading,
    error
  };
};

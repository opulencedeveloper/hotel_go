"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/useHttp";
import { roomActions } from "@/store/redux/room-slice";
import { staffActions } from "@/store/redux/staff-slice";
import { stayActions } from "@/store/redux/stay-slice";
import { houseKeepingActions } from "@/store/redux/house-keeping-slice";
import { DashboardOverview } from "./DashboardOverview";
import RoleBasedDashboard from "./RoleBasedDashboard";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { Calendar, Filter, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardFilters {
  period: 'day' | 'week' | 'month' | 'year' | 'all';
  startDate?: string;
  endDate?: string;
  roomStatus?: string[];
  staffStatus?: string[];
  stayStatus?: string[];
  housekeepingStatus?: string[];
}

interface DashboardStats {
  rooms: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    cleaning: number;
    outOfOrder: number;
    occupancyRate: number;
  };
  staff: {
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
  };
  stays: {
    total: number;
    confirmed: number;
    checkedIn: number;
    checkedOut: number;
    cancelled: number;
    arrivals: number;
    departures: number;
  };
  housekeeping: {
    total: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  metadata: {
    period: string;
    startDate?: string;
    endDate?: string;
    generatedAt: string;
    hotelId: string;
  };
}

export default function OptimizedDashboard() {
  const user = useSelector((state: RootState) => state.user);
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    period: 'day'
  });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchDashboardStats,
  } = useHttp();

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.period && filters.period !== 'all') {
        queryParams.append('period', filters.period);
      }
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }

      const url = `/dashboard/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      fetchDashboardStats({
        successRes: (res: any) => {
          const data = res?.data?.data;
          setStats(data);
          setLastUpdated(new Date());
          
          // Update Redux store with the fetched data
          if (data) {
            // Note: The new API returns aggregated stats, not full documents
            // We'll need to adapt the Redux store or create new actions for stats
            console.log('Dashboard stats loaded:', data);
          }
        },
        requestConfig: {
          url,
          method: "GET",
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handlePeriodChange = (period: DashboardFilters['period']) => {
    setFilters(prev => ({ ...prev, period }));
  };

  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    setFilters(prev => ({ 
      ...prev, 
      startDate, 
      endDate,
      period: 'all' // Custom date range
    }));
  };

  const handleRefresh = () => {
    fetchStats();
  };

  if (isLoading || !mounted) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorDisplay
            error={error}
            title="Failed to load dashboard"
            description="We couldn't load your dashboard information. This might be due to a network issue or server problem."
            onRetry={handleRefresh}
            showRetry={true}
            size="large"
            variant="error"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              {stats?.metadata.period === 'all' 
                ? 'All time statistics' 
                : `${stats?.metadata.period} statistics`
              }
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Period Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filters.period}
                onChange={(e) => handlePeriodChange(e.target.value as DashboardFilters['period'])}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Custom Date Range */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleDateRangeChange(e.target.value, filters.endDate)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleDateRangeChange(filters.startDate, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Rooms Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rooms.total}</p>
                <p className="text-sm text-gray-500">
                  {stats.rooms.occupied} occupied ({stats.rooms.occupancyRate}%)
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Staff Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">{stats.staff.active}</p>
                <p className="text-sm text-gray-500">
                  {stats.staff.total} total staff
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Stays Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Stays</p>
                <p className="text-2xl font-bold text-gray-900">{stats.stays.checkedIn}</p>
                <p className="text-sm text-gray-500">
                  {stats.stays.arrivals} arrivals, {stats.stays.departures} departures
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Housekeeping Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.housekeeping.inProgress}</p>
                <p className="text-sm text-gray-500">
                  {stats.housekeeping.completed} completed today
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role-Based Dashboard Content */}
      {user && <RoleBasedDashboard userRole={user.userRole!} />}

      {/* Main Dashboard Overview */}
      <DashboardOverview />
    </div>
  );
}

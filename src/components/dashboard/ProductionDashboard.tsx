"use client";

import { useState, useEffect } from "react";
import { useHttp } from "@/hooks/useHttp";
// Removed DashboardOverview and RoleBasedDashboard - using only API data for production
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { 
  Filter,
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Users,
  Bed
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { dashboardSummaryActions } from "@/store/redux/dashboard-summary-slice";
import { formatPrice } from '@/helper';


export default function ProductionDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [isLoadingDetailed, setIsLoadingDetailed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const dashSummary = useSelector((state: RootState) => state.dashboardSummary);
  const hotel = useSelector((state: RootState) => state.hotel);
  const { fetchedDashboardSummary, fetchedQuickSummary, dashboardSummary, quickSummary } = dashSummary;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchData,
  } = useHttp();

  useEffect(() => {
    setMounted(true);
    // Load efficient summary data immediately on mount
    if(!fetchedQuickSummary) {
    fetchQuickSummary();
    }
     if(!fetchedDashboardSummary) {
    fetchDashboardSummary();
     }
    // Fetch initial detailed stats for the default period
    if(!fetchedQuickSummary && !fetchedDashboardSummary) {
    fetchDetailedStats(selectedPeriod);
    }
  }, []);

  // Fetch quick summary (optimized for speed)
  const fetchQuickSummary = async () => {
    try {
      fetchData({
        successRes: (res: any) => {
          const data = res?.data;
          console.log('Quick Summary Response:', data); // Debug log

          dispatch(dashboardSummaryActions.setQuickSummary(data.data))
          setLastUpdated(new Date());
        },
        requestConfig: {
          url: "/dashboard/quick",
          method: "GET",
        },
      });
    } catch (error) {
      console.error('Error fetching quick summary:', error);
    }
  };

  // Fetch comprehensive dashboard summary
  const fetchDashboardSummary = async () => {
    try {
      fetchData({
        successRes: (res: any) => {
          const data = res?.data;
          console.log('Dashboard Summary Response:', data); // Debug log
           dispatch(dashboardSummaryActions.setDashboardSummary(data.data))
          setLastUpdated(new Date());
        },
        requestConfig: {
          url: "/dashboard/summary",
          method: "GET",
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    }
  };

  // Fetch detailed stats for specific period
  const fetchDetailedStats = async (period: string) => {
   
    setIsLoadingDetailed(true);
    try {
      fetchData({
        successRes: (res: any) => {
          const data = res?.data;
          console.log(`Detailed Stats for ${period}:`, data); // Debug log
          setDetailedStats(data);
          setLastUpdated(new Date());
        },
        requestConfig: {
          url: `/dashboard/stats/${period}`,
          method: "GET",
        },
      });
    } catch (error) {
      console.error(`Error fetching detailed stats for ${period}:`, error);
    } finally {
      setIsLoadingDetailed(false);
    }
  };

  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
    // Fetch detailed stats for the selected period
    fetchDetailedStats(period);
  };

  const handleRefresh = () => {
    fetchQuickSummary();
    fetchDashboardSummary();
    if (selectedPeriod) {
      fetchDetailedStats(selectedPeriod);
    }
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
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hotel Dashboard</h1>
            <p className="text-gray-600">
              {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Viewing: {selectedPeriod === 'day' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Year'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value as 'day' | 'week' | 'month' | 'year')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
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

      {/* Quick Stats - Always Visible (Lightweight) */}
      {quickSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Occupancy Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{quickSummary.occupancyRate}%</p>
                <p className="text-sm text-gray-500">
                  Room occupancy rate
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Bed className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${quickSummary.todayRevenue}</p>
                <p className="text-sm text-gray-500">
                  Total revenue today
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Today's Arrivals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Arrivals</p>
                <p className="text-2xl font-bold text-gray-900">{quickSummary.todayArrivals}</p>
                <p className="text-sm text-gray-500">
                  Expected check-ins
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Today's Departures */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Departures</p>
                <p className="text-2xl font-bold text-gray-900">{quickSummary.todayDepartures}</p>
                <p className="text-sm text-gray-500">
                  Expected check-outs
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Quick Stats Row */}
      {quickSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Guests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Guests</p>
                <p className="text-2xl font-bold text-gray-900">{quickSummary.currentGuests}</p>
                <p className="text-sm text-gray-500">
                  In-house guests
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Active Staff */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">{quickSummary.activeStaff}</p>
                <p className="text-sm text-gray-500">
                  Currently working
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{quickSummary.pendingOrders}</p>
                <p className="text-sm text-gray-500">
                  Awaiting processing
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{quickSummary.lowStockItems}</p>
                <p className="text-sm text-gray-500">
                  Need restocking
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Stats - Using Redux State */}
      {dashboardSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Room Counts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Rooms</span>
                <span className="font-medium text-gray-900">{dashboardSummary.rooms?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available</span>
                <span className="font-medium text-green-600">{dashboardSummary.rooms?.available || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Occupied</span>
                <span className="font-medium text-blue-600">{dashboardSummary.rooms?.occupied || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maintenance</span>
                <span className="font-medium text-red-600">{dashboardSummary.rooms?.maintenance || 0}</span>
              </div>
            </div>
          </div>

          {/* Staff Counts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Staff</span>
                <span className="font-medium text-gray-900">{dashboardSummary.staff?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-medium text-green-600">{dashboardSummary.staff?.active || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inactive</span>
                <span className="font-medium text-gray-600">{dashboardSummary.staff?.inactive || 0}</span>
              </div>
            </div>
          </div>

          {/* Stay Counts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Stays</span>
                <span className="font-medium text-gray-900">{dashboardSummary.stays?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-medium text-blue-600">{dashboardSummary.stays?.confirmed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Checked In</span>
                <span className="font-medium text-green-600">{dashboardSummary.stays?.checkedIn || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Checked Out</span>
                <span className="font-medium text-gray-600">{dashboardSummary.stays?.checkedOut || 0}</span>
              </div>
            </div>
          </div>

          {/* Housekeeping Counts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Housekeeping Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="font-medium text-gray-900">{dashboardSummary.housekeeping?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-medium text-blue-600">{dashboardSummary.housekeeping?.inProgress || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{dashboardSummary.housekeeping?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-medium text-red-600">{dashboardSummary.housekeeping?.cancelled || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue and Orders Section */}
      {dashboardSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Revenue</span>
                <span className="font-medium text-green-600">{formatPrice(dashboardSummary.revenue?.today || 0, selectedHotel?.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-medium text-blue-600">{formatPrice(dashboardSummary.revenue?.thisWeek || 0, selectedHotel?.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-medium text-purple-600">{formatPrice(dashboardSummary.revenue?.thisMonth || 0, selectedHotel?.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Year</span>
                <span className="font-medium text-gray-900">{formatPrice(dashboardSummary.revenue?.thisYear || 0, selectedHotel?.currency)}</span>
              </div>
            </div>
          </div>

          {/* Orders Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="font-medium text-gray-900">{dashboardSummary.orders?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">{dashboardSummary.orders?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-medium text-blue-600">{dashboardSummary.orders?.confirmed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Delivered</span>
                <span className="font-medium text-green-600">{dashboardSummary.orders?.delivered || 0}</span>
              </div>
            </div>
          </div>

          {/* Inventory Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Items</span>
                <span className="font-medium text-gray-900">{dashboardSummary.inventory?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Stock</span>
                <span className="font-medium text-yellow-600">{dashboardSummary.inventory?.lowStock || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="font-medium text-red-600">{dashboardSummary.inventory?.outOfStock || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expiring Soon</span>
                <span className="font-medium text-orange-600">{dashboardSummary.inventory?.expiringSoon || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Stats - Period Specific */}
      {detailedStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Room Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available</span>
                <span className="font-medium text-green-600">{detailedStats.rooms?.available || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Occupied</span>
                <span className="font-medium text-blue-600">{detailedStats.rooms?.occupied || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maintenance</span>
                <span className="font-medium text-red-600">{detailedStats.rooms?.maintenance || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cleaning</span>
                <span className="font-medium text-yellow-600">{detailedStats.rooms?.cleaning || 0}</span>
              </div>
            </div>
          </div>

          {/* Staff Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-medium text-green-600">{detailedStats.staff?.active || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inactive</span>
                <span className="font-medium text-gray-600">{detailedStats.staff?.inactive || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On Leave</span>
                <span className="font-medium text-yellow-600">{detailedStats.staff?.onLeave || 0}</span>
              </div>
            </div>
          </div>

          {/* Stay Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-medium text-blue-600">{detailedStats.stays?.confirmed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Checked In</span>
                <span className="font-medium text-green-600">{detailedStats.stays?.checkedIn || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Checked Out</span>
                <span className="font-medium text-gray-600">{detailedStats.stays?.checkedOut || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-medium text-red-600">{detailedStats.stays?.cancelled || 0}</span>
              </div>
            </div>
          </div>

          {/* Housekeeping Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Housekeeping</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-medium text-blue-600">{detailedStats.housekeeping?.inProgress || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{detailedStats.housekeeping?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">{detailedStats.housekeeping?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-medium text-red-600">{detailedStats.housekeeping?.cancelled || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State for Detailed Stats */}
      {isLoadingDetailed && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading detailed statistics for {selectedPeriod}...</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}







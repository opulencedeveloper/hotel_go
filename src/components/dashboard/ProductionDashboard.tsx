"use client";

import { useState, useEffect } from "react";
import { useHttp } from "@/hooks/useHttp";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { 
  Filter,
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Users,
  Bed,
  DollarSign,
  Calendar,
  Clock,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Target,
  Award,
  Building2,
  MapPin,
  Phone,
  Mail,
  Settings,
  Bell,
  Search,
  Download,
  Share2
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

  // Calculate occupancy rate properly using available data
  const calculateOccupancyRate = () => {
    // Try multiple data sources for occupancy calculation
    const totalRooms = dashboardSummary?.rooms?.total || 0;
    const occupiedRooms = dashboardSummary?.rooms?.occupied || 0;
    const checkedInGuests = dashboardSummary?.stays?.checkedIn || 0;
    
    // Use occupied rooms if available, otherwise use checked-in guests as proxy
    const actualOccupied = occupiedRooms > 0 ? occupiedRooms : checkedInGuests;
    
    if (totalRooms === 0) return 0;
    return Math.round((actualOccupied / totalRooms) * 100);
  };

  // Calculate trend indicators based on actual data
  const calculateTrends = () => {
    const occupancyRate = calculateOccupancyRate();
    const totalRooms = dashboardSummary?.rooms?.total || 0;
    const occupiedRooms = dashboardSummary?.rooms?.occupied || 0;
    const checkedInGuests = dashboardSummary?.stays?.checkedIn || 0;
    const availableRooms = dashboardSummary?.rooms?.available || 0;
    
    // Use the same logic as occupancy calculation
    const actualOccupied = occupiedRooms > 0 ? occupiedRooms : checkedInGuests;
    
    // Calculate occupancy trend (simplified - in real app, compare with previous period)
    const occupancyTrend = occupancyRate > 0 ? '+' : '';
    const occupancyTrendValue = occupancyRate > 0 ? `${occupancyTrend}${Math.round(occupancyRate * 0.1)}%` : '0%';
    
    return {
      occupancyRate,
      occupancyTrend: occupancyTrendValue,
      totalRooms,
      occupiedRooms: actualOccupied,
      availableRooms
    };
  };

  const trends = calculateTrends();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchData,
  } = useHttp();

  useEffect(() => {
    setMounted(true);
    if(!fetchedQuickSummary) {
      fetchQuickSummary();
    }
    if(!fetchedDashboardSummary) {
      fetchDashboardSummary();
    }
    if(!fetchedQuickSummary && !fetchedDashboardSummary) {
      fetchDetailedStats(selectedPeriod);
    }
  }, []);

  const fetchQuickSummary = async () => {
    try {
      fetchData({
        successRes: (res: any) => {
          const data = res?.data;
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

  const fetchDashboardSummary = async () => {
    try {
      fetchData({
        successRes: (res: any) => {
          const data = res?.data;
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

  const fetchDetailedStats = async (period: string) => {
    setIsLoadingDetailed(true);
    try {
      fetchData({
        successRes: (res: any) => {
          const data = res?.data;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{selectedHotel?.hotelName || 'Hotel Dashboard'}</h1>
                  <p className="text-blue-100 text-lg">Comprehensive Management Overview</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedHotel?.address || 'Hotel Location'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{lastUpdated && `Updated ${lastUpdated.toLocaleTimeString()}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedPeriod === 'day' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Year'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Period Selector */}
              <div className="flex items-center gap-3 bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                <Filter className="w-4 h-4" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value as 'day' | 'week' | 'month' | 'year')}
                  className="bg-transparent text-white border-none outline-none text-sm font-medium"
                >
                  <option value="day" className="text-gray-900">Today</option>
                  <option value="week" className="text-gray-900">This Week</option>
                  <option value="month" className="text-gray-900">This Month</option>
                  <option value="year" className="text-gray-900">This Year</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-200 text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                {/* <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-200 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-200 text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  Share
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      {quickSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Occupancy Rate */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Bed className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 ${trends.occupancyRate > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {trends.occupancyRate > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{trends.occupancyTrend}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{trends.occupancyRate}%</p>
                <p className="text-xs text-gray-500">
                  {trends.occupiedRooms > 0 ? `${trends.occupiedRooms} of ${trends.totalRooms} rooms occupied` : 
                   (dashboardSummary?.stays?.checkedIn || 0) > 0 ? `${dashboardSummary?.stays?.checkedIn || 0} guests checked in` : 
                   'No occupancy data'}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </div>

          {/* Today's Revenue */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatPrice(dashboardSummary?.revenue?.today || 0, selectedHotel?.currency)}</p>
                <p className="text-xs text-gray-500">Total revenue today</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          </div>

          {/* Today's Arrivals */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Arrivals</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{quickSummary?.todayArrivals || 0}</p>
                <p className="text-xs text-gray-500">Expected check-ins</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          </div>

          {/* Today's Departures */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Departures</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{quickSummary?.todayDepartures || 0}</p>
                <p className="text-xs text-gray-500">Expected check-outs</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          </div>
        </div>
      )}

      {/* Secondary Metrics */}
      {quickSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Guests */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quickSummary?.currentGuests || 0}</p>
                <p className="text-sm text-gray-600">In-house guests</p>
              </div>
            </div>
          </div>

          {/* Active Staff */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quickSummary?.activeStaff || 0}</p>
                <p className="text-sm text-gray-600">Currently working</p>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quickSummary?.pendingOrders || 0}</p>
                <p className="text-sm text-gray-600">Awaiting processing</p>
              </div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quickSummary?.lowStockItems || 0}</p>
                <p className="text-sm text-gray-600">Need restocking</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analytics Grid */}
      {dashboardSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Room Status Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Room Status</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Available</span>
                </div>
                <span className="text-xl font-bold text-green-600">{dashboardSummary.rooms?.available || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Occupied</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{dashboardSummary.rooms?.occupied || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-gray-900">Maintenance</span>
                </div>
                <span className="text-xl font-bold text-red-600">{dashboardSummary.rooms?.maintenance || 0}</span>
              </div>
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Today</span>
                </div>
                <span className="text-xl font-bold text-green-600">{formatPrice(dashboardSummary.revenue?.today || 0, selectedHotel?.currency)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">This Week</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{formatPrice(dashboardSummary.revenue?.thisWeek || 0, selectedHotel?.currency)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">This Month</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{formatPrice(dashboardSummary.revenue?.thisMonth || 0, selectedHotel?.currency)}</span>
              </div>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Staff Performance</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Active</span>
                </div>
                <span className="text-xl font-bold text-green-600">{dashboardSummary.staff?.active || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Total</span>
                </div>
                <span className="text-xl font-bold text-gray-600">{dashboardSummary.staff?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">On Leave</span>
                </div>
                <span className="text-xl font-bold text-yellow-600">{dashboardSummary.staff?.inactive || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="flex flex-col items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 group">
            <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Check-in</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 group">
            <div className="p-3 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Check-out</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 group">
            <div className="p-3 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
              <Bed className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Room Service</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-200 group">
            <div className="p-3 bg-orange-100 group-hover:bg-orange-200 rounded-lg transition-colors">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Housekeeping</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 group">
            <div className="p-3 bg-red-100 group-hover:bg-red-200 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Alerts</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
            <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-colors">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Settings</span>
          </button>
        </div>
      </div> */}

      {/* Loading State for Detailed Stats */}
      {isLoadingDetailed && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              {/* Hotel-themed loading animation */}
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                
                {/* Floating mini icons */}
                <div className="absolute -top-1 -right-1 animate-bounce delay-100">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Bed className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -left-1 animate-bounce delay-200">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-gray-600 font-medium ml-3">Loading detailed statistics for {selectedPeriod}...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







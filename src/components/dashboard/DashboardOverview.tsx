'use client';

import { RootState } from "@/store";
import { useSelector } from "react-redux";


export const DashboardOverview = () => {
    const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotelId = hotel.selectedHotelId;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === selectedHotelId);
  // Hardcoded dashboard data
  const stats = {
    occupancy: {
      rate: 78,
      change_percent: 5.2
    },
    revenue_by_outlet: {
      rooms: 125000,
      f_and_b: 45000,
      other: 15000
    },
    arrivals_today: 12,
    departures_today: 8,
    housekeeping_tasks: 15,
    maintenance_tasks: 3,
    guest_requests: 7,
    overbook_risk: 2,
    online_status: true,
    last_sync: '2 minutes ago',
    pending_sync_items: 0
  };

  const occupancyRate = stats.occupancy.rate;
  const totalRevenue = stats.revenue_by_outlet.rooms + stats.revenue_by_outlet.f_and_b + stats.revenue_by_outlet.other;
  const activeAlerts = 3;
  const systemHealth = 'healthy';
  const roomStatusCounts = {
    available: 45,
    occupied: 78,
    maintenance: 7
  };
  const realTimeEnabled = true;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Hotel management overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${realTimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {realTimeEnabled ? 'Live' : 'Offline'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* System Status Alert */}
      {systemHealth !== 'healthy' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                System Status: {systemHealth}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                {systemHealth === 'offline' && 'System is currently offline. Some features may be unavailable.'}
                {systemHealth === 'warning' && 'System is experiencing issues. Please check alerts.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Occupancy Rate */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Occupancy Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {occupancyRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                +{stats.occupancy.change_percent}%
              </span>
              <span className="text-gray-500"> from last month</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                +{((stats.revenue_by_outlet.rooms + stats.revenue_by_outlet.f_and_b + stats.revenue_by_outlet.other) / 1000).toFixed(1)}k
              </span>
              <span className="text-gray-500"> today</span>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Alerts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeAlerts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-red-600 font-medium">
                {stats.overbook_risk} overbook risk
              </span>
            </div>
          </div>
        </div>

        {/* Room Status */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Rooms
                  </dt> 
                  <dd className="text-lg font-medium text-gray-900">
                    {selectedHotel?.totalRooms! - selectedHotel?.totalRoomsOccupied!}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-600">
                {selectedHotel?.totalRoomsOccupied!} occupied, {selectedHotel?.totalRoomsInMaintenance!} maintenance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arrivals & Departures */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Operations</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Arrivals</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {stats.arrivals_today}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Departures</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {stats.departures_today}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">In House</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {roomStatusCounts.occupied}
              </span>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Tasks</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Housekeeping</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {stats.housekeeping_tasks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Maintenance</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {stats.maintenance_tasks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Guest Requests</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {stats.guest_requests}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(stats.revenue_by_outlet.rooms)}
            </div>
            <div className="text-sm text-gray-500">Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.revenue_by_outlet.f_and_b)}
            </div>
            <div className="text-sm text-gray-500">Food & Beverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(stats.revenue_by_outlet.other)}
            </div>
            <div className="text-sm text-gray-500">Other Services</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Online Status</span>
            <span className={`text-sm font-medium ${getHealthColor(systemHealth)}`}>
              {stats.online_status ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Last Sync</span>
            <span className="text-sm text-gray-500">
              {stats.last_sync}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Pending Sync</span>
            <span className="text-sm text-gray-500">
              {stats.pending_sync_items} items
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};



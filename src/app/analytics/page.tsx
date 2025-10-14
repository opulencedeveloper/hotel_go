'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { BarChart3, TrendingUp, PieChart, Activity, Target, AlertTriangle, CheckCircle, Database, DollarSign, Users, Bed, Calendar, Download, Filter, Eye, RefreshCw, X } from 'lucide-react';
import { mockDashboardStats, mockBookings, mockRooms, mockGuestProfiles } from '@/data/mockData';

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Form states
  const [exportForm, setExportForm] = useState({
    reportType: 'comprehensive',
    format: 'pdf',
    dateRange: '30d',
    includeCharts: true,
    includeDetails: true
  });

  const [refreshForm, setRefreshForm] = useState({
    dataSource: 'all',
    refreshType: 'full',
    includeRealTime: true
  });

  const [filtersForm, setFiltersForm] = useState({
    dateRange: '30d',
    roomTypes: [] as string[],
    revenueRange: { min: 0, max: 1000000 },
    occupancyRange: { min: 0, max: 100 },
    guestSegments: [] as string[],
    channels: [] as string[]
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate analytics data
  const stats = mockDashboardStats;
  const totalBookings = mockBookings.length;
  const totalRevenue = mockBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
  const averageStay = mockBookings.reduce((sum, booking) => {
    const checkIn = new Date(booking.arrival_date);
    const checkOut = new Date(booking.departure_date);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return sum + nights;
  }, 0) / totalBookings;
  
  const occupancyRate = (stats.occupancy.today + stats.occupancy.mtd + stats.occupancy.ytd) / 3;
  const availableRooms = mockRooms.filter(room => room.status === 'available').length;
  const totalRooms = mockRooms.length;
  
  // Revenue by month (mock data)
  const monthlyRevenue = [
    { month: 'Jan', revenue: 125000, bookings: 45 },
    { month: 'Feb', revenue: 142000, bookings: 52 },
    { month: 'Mar', revenue: 138000, bookings: 48 },
    { month: 'Apr', revenue: 156000, bookings: 58 },
    { month: 'May', revenue: 168000, bookings: 62 },
    { month: 'Jun', revenue: 175000, bookings: 68 },
    { month: 'Jul', revenue: 189000, bookings: 72 },
    { month: 'Aug', revenue: 182000, bookings: 69 },
    { month: 'Sep', revenue: 165000, bookings: 61 },
    { month: 'Oct', revenue: 158000, bookings: 59 },
    { month: 'Nov', revenue: 145000, bookings: 54 },
    { month: 'Dec', revenue: 172000, bookings: 66 }
  ];

  // Guest demographics
  const guestDemographics = {
    domestic: 65,
    international: 35,
    business: 40,
    leisure: 60,
    repeat: 45,
    new: 55
  };

  // Top performing metrics
  const topMetrics = [
    { name: 'ADR (Average Daily Rate)', value: '$245', change: '+12%', trend: 'up' },
    { name: 'RevPAR (Revenue per Available Room)', value: '$198', change: '+8%', trend: 'up' },
    { name: 'Occupancy Rate', value: `${occupancyRate.toFixed(1)}%`, change: '+5%', trend: 'up' },
    { name: 'Guest Satisfaction', value: '4.7/5', change: '+0.2', trend: 'up' }
  ];

  // Form handlers
  const handleExportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Exporting report:', exportForm);
    setShowExportModal(false);
    // Reset form
    setExportForm({
      reportType: 'comprehensive',
      format: 'pdf',
      dateRange: '30d',
      includeCharts: true,
      includeDetails: true
    });
  };

  const handleRefreshSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Refreshing data:', refreshForm);
    setShowRefreshModal(false);
    // Reset form
    setRefreshForm({
      dataSource: 'all',
      refreshType: 'full',
      includeRealTime: true
    });
  };

  const handleFiltersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Applying filters:', filtersForm);
    setShowFiltersModal(false);
    // Reset form
    setFiltersForm({
      dateRange: '30d',
      roomTypes: [] as string[],
      revenueRange: { min: 0, max: 1000000 },
      occupancyRange: { min: 0, max: 100 },
      guestSegments: [] as string[],
      channels: [] as string[]
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Business Analytics</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Data Insights & Reports</span>
                </div>
              </div>
              
              <p className="text-blue-100 text-lg mb-6">
                Comprehensive analytics and insights to drive data-driven decisions for your hotel operations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Database className="w-4 h-4" />
                  <span className="text-blue-100">Analytics Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Data Points:</span>
                  <span className="font-medium">2.4M</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Last Update:</span>
                  <span className="font-medium">5 min ago</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                <button 
                  onClick={() => setShowRefreshModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Data</span>
                </button>
                <button 
                  onClick={() => setShowFiltersModal(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Filter className="w-4 h-4" />
                  <span>Custom Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+15.2% vs last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Bookings</p>
                <p className="text-2xl font-bold text-secondary-900">{totalBookings}</p>
                <p className="text-sm text-blue-600">+8.5% vs last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average Stay</p>
                <p className="text-2xl font-bold text-secondary-900">{averageStay.toFixed(1)} nights</p>
                <p className="text-sm text-purple-600">+2.1% vs last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Bed className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-secondary-900">{occupancyRate.toFixed(1)}%</p>
                <p className="text-sm text-orange-600">+3.2% vs last month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary-900">Monthly Revenue</h2>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {monthlyRevenue.slice(-6).map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-secondary-900">{month.month}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-secondary-900">${month.revenue.toLocaleString()}</p>
                      <p className="text-xs text-secondary-600">{month.bookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guest Demographics */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Guest Demographics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary-600">Domestic vs International</span>
                    <span className="font-medium">{guestDemographics.domestic}% / {guestDemographics.international}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${guestDemographics.domestic}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary-600">Business vs Leisure</span>
                    <span className="font-medium">{guestDemographics.business}% / {guestDemographics.leisure}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${guestDemographics.business}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary-600">Repeat vs New Guests</span>
                    <span className="font-medium">{guestDemographics.repeat}% / {guestDemographics.new}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${guestDemographics.repeat}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-xl font-semibold text-secondary-900">Key Performance Metrics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900">{metric.value}</h3>
                    <p className="text-sm text-secondary-600 mb-1">{metric.name}</p>
                    <p className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Room Status Distribution</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-secondary-900">Available</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900">{availableRooms}</p>
                    <p className="text-xs text-secondary-600">{((availableRooms / totalRooms) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-secondary-900">Occupied</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900">{totalRooms - availableRooms}</p>
                    <p className="text-xs text-secondary-600">{(((totalRooms - availableRooms) / totalRooms) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-secondary-900">Maintenance</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900">3</p>
                    <p className="text-xs text-secondary-600">2.1%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockBookings.slice(0, 5).map((booking) => (
                  <div key={booking.booking_id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          {booking.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest'}
                        </p>
                        <p className="text-xs text-secondary-600">
                          {isClient ? new Date(booking.arrival_date).toLocaleDateString() : '--/--/----'} - 
                          {isClient ? new Date(booking.departure_date).toLocaleDateString() : '--/--/----'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-secondary-900">${booking.total_amount}</p>
                      <p className="text-xs text-secondary-600 capitalize">{booking.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Export Report Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Export Analytics Report</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleExportSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Report Type *
                    </label>
                    <select
                      required
                      value={exportForm.reportType}
                      onChange={(e) => setExportForm({...exportForm, reportType: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="comprehensive">Comprehensive Report</option>
                      <option value="revenue">Revenue Analysis</option>
                      <option value="occupancy">Occupancy Report</option>
                      <option value="guest">Guest Analytics</option>
                      <option value="performance">Performance Metrics</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Export Format *
                    </label>
                    <select
                      required
                      value={exportForm.format}
                      onChange={(e) => setExportForm({...exportForm, format: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel Spreadsheet</option>
                      <option value="csv">CSV Data</option>
                      <option value="json">JSON Data</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date Range *
                    </label>
                    <select
                      required
                      value={exportForm.dateRange}
                      onChange={(e) => setExportForm({...exportForm, dateRange: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">Last Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportForm.includeCharts}
                          onChange={(e) => setExportForm({...exportForm, includeCharts: e.target.checked})}
                          className="mr-3 rounded border-secondary-300"
                        />
                        <span className="text-sm text-secondary-700">Include Charts and Graphs</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportForm.includeDetails}
                          onChange={(e) => setExportForm({...exportForm, includeDetails: e.target.checked})}
                          className="mr-3 rounded border-secondary-300"
                        />
                        <span className="text-sm text-secondary-700">Include Detailed Breakdowns</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Refresh Data Modal */}
        {showRefreshModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Refresh Analytics Data</h2>
                <button
                  onClick={() => setShowRefreshModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleRefreshSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Data Source *
                    </label>
                    <select
                      required
                      value={refreshForm.dataSource}
                      onChange={(e) => setRefreshForm({...refreshForm, dataSource: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Data Sources</option>
                      <option value="bookings">Bookings & Reservations</option>
                      <option value="revenue">Revenue Data</option>
                      <option value="occupancy">Occupancy Data</option>
                      <option value="guests">Guest Data</option>
                      <option value="rooms">Room Data</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Refresh Type *
                    </label>
                    <select
                      required
                      value={refreshForm.refreshType}
                      onChange={(e) => setRefreshForm({...refreshForm, refreshType: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="full">Full Refresh</option>
                      <option value="incremental">Incremental Update</option>
                      <option value="realtime">Real-time Sync</option>
                      <option value="scheduled">Scheduled Refresh</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={refreshForm.includeRealTime}
                        onChange={(e) => setRefreshForm({...refreshForm, includeRealTime: e.target.checked})}
                        className="mr-3 rounded border-secondary-300"
                      />
                      <span className="text-sm text-secondary-700">Enable Real-time Data Updates</span>
                    </label>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Refresh Information</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Last refresh: {isClient ? new Date().toLocaleString() : '--:-- --'}</p>
                    <p>• Data points: {totalBookings} bookings, {totalRooms} rooms</p>
                    <p>• Estimated time: 2-5 minutes</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowRefreshModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Filters Modal */}
        {showFiltersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Custom Analytics Filters</h2>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleFiltersSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date Range *
                    </label>
                    <select
                      required
                      value={filtersForm.dateRange}
                      onChange={(e) => setFiltersForm({...filtersForm, dateRange: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">Last Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Revenue Range ($)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={filtersForm.revenueRange.min}
                        onChange={(e) => setFiltersForm({
                          ...filtersForm, 
                          revenueRange: {...filtersForm.revenueRange, min: parseInt(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filtersForm.revenueRange.max}
                        onChange={(e) => setFiltersForm({
                          ...filtersForm, 
                          revenueRange: {...filtersForm.revenueRange, max: parseInt(e.target.value) || 1000000}
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Occupancy Range (%)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={filtersForm.occupancyRange.min}
                        onChange={(e) => setFiltersForm({
                          ...filtersForm, 
                          occupancyRange: {...filtersForm.occupancyRange, min: parseInt(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Min %"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={filtersForm.occupancyRange.max}
                        onChange={(e) => setFiltersForm({
                          ...filtersForm, 
                          occupancyRange: {...filtersForm.occupancyRange, max: parseInt(e.target.value) || 100}
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Max %"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room Types
                    </label>
                    <select
                      multiple
                      value={filtersForm.roomTypes}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setFiltersForm({...filtersForm, roomTypes: values});
                      }}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suite</option>
                      <option value="presidential">Presidential</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Guest Segments
                    </label>
                    <select
                      multiple
                      value={filtersForm.guestSegments}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setFiltersForm({...filtersForm, guestSegments: values});
                      }}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="business">Business</option>
                      <option value="leisure">Leisure</option>
                      <option value="repeat">Repeat Guests</option>
                      <option value="new">New Guests</option>
                      <option value="group">Group Bookings</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Booking Channels
                    </label>
                    <select
                      multiple
                      value={filtersForm.channels}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setFiltersForm({...filtersForm, channels: values});
                      }}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="direct">Direct</option>
                      <option value="ota">Online Travel Agency</option>
                      <option value="phone">Phone</option>
                      <option value="walk-in">Walk-in</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-3">Filter Preview</h4>
                  <div className="text-sm text-secondary-700 space-y-1">
                    <p>• Date Range: {filtersForm.dateRange}</p>
                    <p>• Revenue: ${filtersForm.revenueRange.min.toLocaleString()} - ${filtersForm.revenueRange.max.toLocaleString()}</p>
                    <p>• Occupancy: {filtersForm.occupancyRange.min}% - {filtersForm.occupancyRange.max}%</p>
                    <p>• Room Types: {filtersForm.roomTypes.length > 0 ? filtersForm.roomTypes.join(', ') : 'All'}</p>
                    <p>• Guest Segments: {filtersForm.guestSegments.length > 0 ? filtersForm.guestSegments.join(', ') : 'All'}</p>
                    <p>• Channels: {filtersForm.channels.length > 0 ? filtersForm.channels.join(', ') : 'All'}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowFiltersModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

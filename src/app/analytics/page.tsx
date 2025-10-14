'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { BarChart3, TrendingUp, PieChart, Activity, Target, AlertTriangle, CheckCircle, Database, DollarSign, Users, Bed, Calendar, Download, Filter, Eye, RefreshCw } from 'lucide-react';
import { mockDashboardStats, mockBookings, mockRooms, mockGuestProfiles } from '@/data/mockData';

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

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
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Data</span>
                </button>
                <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
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
      </div>
    </Layout>
  );
}

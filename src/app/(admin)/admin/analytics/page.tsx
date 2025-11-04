'use client';

import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Activity,
  PieChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const revenueData = [
    { month: 'Jan', revenue: 2500000, hotels: 1200 },
    { month: 'Feb', revenue: 2800000, hotels: 1220 },
    { month: 'Mar', revenue: 3200000, hotels: 1240 },
    { month: 'Apr', revenue: 3500000, hotels: 1250 },
    { month: 'May', revenue: 3800000, hotels: 1260 },
    { month: 'Jun', revenue: 4200000, hotels: 1280 }
  ];

  const regionData = [
    { region: 'North America', revenue: 2500000, hotels: 450, growth: 15.2 },
    { region: 'Europe', revenue: 1800000, hotels: 320, growth: 12.8 },
    { region: 'Asia Pacific', revenue: 2200000, hotels: 380, growth: 22.1 },
    { region: 'Middle East & Africa', revenue: 950000, hotels: 180, growth: 8.5 },
    { region: 'Latin America', revenue: 750000, hotels: 140, growth: 6.3 }
  ];

  const topPerformingHotels = [
    { name: 'Grand Plaza Hotel', revenue: 125000, occupancy: 80, rooms: 150, growth: 12.5 },
    { name: 'Ocean View Resort', revenue: 200000, occupancy: 90, rooms: 200, growth: 18.2 },
    { name: 'Mountain Lodge', revenue: 85000, occupancy: 75, rooms: 80, growth: 8.7 },
    { name: 'City Center Hotel', revenue: 95000, occupancy: 78, rooms: 120, growth: 10.3 },
    { name: 'Beach Resort', revenue: 180000, occupancy: 85, rooms: 180, growth: 15.8 }
  ];

  const systemMetrics = {
    totalHotels: 1280,
    activeHotels: 1200,
    totalRooms: 45000,
    totalRevenue: 12500000,
    monthlyGrowth: 12.5,
    averageOccupancy: 78.5,
    averageRevPAR: 125.50,
    totalUsers: 15000
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h1>
            <p className="text-secondary-600">Comprehensive insights across all hotels</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">${(systemMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{systemMetrics.monthlyGrowth}% this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Hotels</p>
                <p className="text-2xl font-bold text-secondary-900">{systemMetrics.totalHotels.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.2% this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average Occupancy</p>
                <p className="text-2xl font-bold text-secondary-900">{systemMetrics.averageOccupancy}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3.1% this month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average RevPAR</p>
                <p className="text-2xl font-bold text-secondary-900">${systemMetrics.averageRevPAR}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% this month
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Revenue Trend</h3>
            <div className="flex space-x-2">
              <button className="text-sm text-primary-600 hover:text-primary-700">Monthly</button>
              <button className="text-sm text-secondary-600 hover:text-secondary-700">Weekly</button>
              <button className="text-sm text-secondary-600 hover:text-secondary-700">Daily</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div 
                  className="bg-primary-500 rounded-t w-8"
                  style={{ height: `${(data.revenue / 4500000) * 200}px` }}
                ></div>
                <div className="text-xs text-secondary-600">{data.month}</div>
                <div className="text-xs font-medium text-secondary-900">${(data.revenue / 1000000).toFixed(1)}M</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Region */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue by Region</h3>
            <div className="space-y-4">
              {regionData.map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    <span className="text-sm font-medium text-secondary-900">{region.region}</span>
                    <span className="text-xs text-secondary-600">{region.hotels} hotels</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-secondary-900">
                      ${(region.revenue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{region.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Hotels */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Performing Hotels</h3>
            <div className="space-y-4">
              {topPerformingHotels.map((hotel, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full">
                      <span className="text-xs font-bold text-primary-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{hotel.name}</p>
                      <p className="text-xs text-secondary-600">{hotel.rooms} rooms • {hotel.occupancy}% occupancy</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">${hotel.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{hotel.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium text-secondary-900">System Uptime</h4>
              <p className="text-2xl font-bold text-green-600">99.9%</p>
              <p className="text-sm text-secondary-600">Last 30 days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-medium text-secondary-900">Active Users</h4>
              <p className="text-2xl font-bold text-blue-600">{systemMetrics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-secondary-600">Across all hotels</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-medium text-secondary-900">Data Processed</h4>
              <p className="text-2xl font-bold text-purple-600">2.5M</p>
              <p className="text-sm text-secondary-600">Records this month</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-secondary-900">{systemMetrics.totalRooms.toLocaleString()}</div>
            <div className="text-sm text-secondary-600">Total Rooms</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{systemMetrics.activeHotels}</div>
            <div className="text-sm text-secondary-600">Active Hotels</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">78.5%</div>
            <div className="text-sm text-secondary-600">Avg Occupancy</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">$125.50</div>
            <div className="text-sm text-secondary-600">Avg RevPAR</div>
          </div>
        </div>
      </div>
    
  );
}

'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Bed,
  Clock,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { mockDashboardStats } from '@/data/mockData';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = mockDashboardStats;

  const revenueData = [
    { month: 'Jan', revenue: 120000, occupancy: 75 },
    { month: 'Feb', revenue: 135000, occupancy: 80 },
    { month: 'Mar', revenue: 125000, occupancy: 78 },
    { month: 'Apr', revenue: 140000, occupancy: 82 },
    { month: 'May', revenue: 155000, occupancy: 85 },
    { month: 'Jun', revenue: 150000, occupancy: 83 }
  ];

  const roomTypeData = [
    { type: 'Single', count: 45, revenue: 54000, occupancy: 80 },
    { type: 'Double', count: 60, revenue: 108000, occupancy: 85 },
    { type: 'Suite', count: 20, revenue: 70000, occupancy: 75 },
    { type: 'Deluxe', count: 25, revenue: 62500, occupancy: 78 }
  ];

  const guestDemographics = [
    { segment: 'Business', percentage: 45, revenue: 67500 },
    { segment: 'Leisure', percentage: 35, revenue: 52500 },
    { segment: 'Group', percentage: 15, revenue: 22500 },
    { segment: 'Other', percentage: 5, revenue: 7500 }
  ];

  const topPerformingRooms = [
    { room: '201', type: 'Suite', revenue: 3500, occupancy: 90 },
    { room: '102', type: 'Double', revenue: 3200, occupancy: 88 },
    { room: '305', type: 'Deluxe', revenue: 3000, occupancy: 85 },
    { room: '108', type: 'Single', revenue: 2800, occupancy: 82 },
    { room: '412', type: 'Suite', revenue: 2700, occupancy: 80 }
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would trigger a download
      alert('Report generated successfully!');
    }, 2000);
  };

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'revenue', name: 'Revenue Analysis', icon: DollarSign },
    { id: 'occupancy', name: 'Occupancy Report', icon: Bed },
    { id: 'guests', name: 'Guest Analytics', icon: Users },
    { id: 'rooms', name: 'Room Performance', icon: Bed },
    { id: 'staff', name: 'Staff Productivity', icon: Users }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Reports & Analytics</h1>
            <p className="text-secondary-600">Comprehensive insights into your hotel's performance</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
            <button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="btn-primary disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Export Report'}
            </button>
          </div>
        </div>

        {/* Report Controls */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Report Type
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="input"
              >
                {reportTypes.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-primary">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% from last month
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
                <p className="text-sm font-medium text-secondary-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.occupancyRate}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.2% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Bed className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average Daily Rate</p>
                <p className="text-2xl font-bold text-secondary-900">$156</p>
                <p className="text-sm text-red-600 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -2.1% from last month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">RevPAR</p>
                <p className="text-2xl font-bold text-secondary-900">$125</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% from last month
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
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
                    style={{ height: `${(data.revenue / 160000) * 200}px` }}
                  ></div>
                  <div className="text-xs text-secondary-600">{data.month}</div>
                  <div className="text-xs font-medium text-secondary-900">${(data.revenue / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Type Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Room Type Performance</h3>
            <div className="space-y-4">
              {roomTypeData.map((room, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    <span className="text-sm font-medium text-secondary-900">{room.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-secondary-900">${room.revenue.toLocaleString()}</div>
                    <div className="text-xs text-secondary-600">{room.occupancy}% occupancy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guest Demographics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Guest Demographics</h3>
            <div className="space-y-3">
              {guestDemographics.map((segment, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-secondary-900">{segment.segment}</span>
                    <span className="text-sm text-secondary-600">{segment.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-secondary-600 mt-1">
                    Revenue: ${segment.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Rooms */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Performing Rooms</h3>
            <div className="space-y-3">
              {topPerformingRooms.map((room, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Room {room.room}</p>
                    <p className="text-xs text-secondary-600">{room.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">${room.revenue}</p>
                    <p className="text-xs text-secondary-600">{room.occupancy}% occupancy</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-sm text-secondary-600">Total Guests</span>
                </div>
                <span className="text-sm font-medium text-secondary-900">{stats.totalGuests}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-sm text-secondary-600">Available Rooms</span>
                </div>
                <span className="text-sm font-medium text-secondary-900">{stats.availableRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-sm text-secondary-600">Check-ins Today</span>
                </div>
                <span className="text-sm font-medium text-secondary-900">{stats.todayCheckIns}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-sm text-secondary-600">Check-outs Today</span>
                </div>
                <span className="text-sm font-medium text-secondary-900">{stats.todayCheckOuts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Report Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <div key={report.id} className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <report.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900">{report.name}</h4>
                    <p className="text-xs text-secondary-600">Generate detailed report</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    <FileText className="w-4 h-4 mr-1 inline" />
                    Generate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

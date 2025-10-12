'use client';

import Layout from '@/components/Layout';
import { 
  DollarSign, 
  Users, 
  Bed, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockDashboardStats } from '@/data/mockData';

export default function DashboardPage() {
  const stats = mockDashboardStats;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Guests',
      value: stats.totalGuests.toString(),
      change: '+8.1%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Available Rooms',
      value: stats.availableRooms.toString(),
      change: '-2.3%',
      changeType: 'negative' as const,
      icon: Bed,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Guest checked in', guest: 'John Doe', room: '101', time: '2 minutes ago', type: 'checkin' },
    { id: 2, action: 'New reservation', guest: 'Jane Smith', room: '205', time: '15 minutes ago', type: 'reservation' },
    { id: 3, action: 'Room cleaned', guest: 'Room 102', room: '102', time: '1 hour ago', type: 'housekeeping' },
    { id: 4, action: 'Payment received', guest: 'Mike Johnson', room: '301', time: '2 hours ago', type: 'payment' },
    { id: 5, action: 'Guest checked out', guest: 'Sarah Wilson', room: '150', time: '3 hours ago', type: 'checkout' }
  ];

  const upcomingCheckIns = [
    { guest: 'Alice Brown', room: '201', time: '2:00 PM', status: 'confirmed' },
    { guest: 'Bob Davis', room: '305', time: '3:30 PM', status: 'confirmed' },
    { guest: 'Carol White', room: '108', time: '4:15 PM', status: 'pending' },
    { guest: 'David Lee', room: '412', time: '5:00 PM', status: 'confirmed' }
  ];

  const upcomingCheckOuts = [
    { guest: 'Emma Taylor', room: '203', time: '11:00 AM', status: 'ready' },
    { guest: 'Frank Miller', room: '307', time: '12:00 PM', status: 'ready' },
    { guest: 'Grace Wilson', room: '109', time: '1:00 PM', status: 'pending' },
    { guest: 'Henry Brown', room: '415', time: '2:00 PM', status: 'ready' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's what's happening at your hotel today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'checkin' ? 'bg-green-100' :
                    activity.type === 'checkout' ? 'bg-blue-100' :
                    activity.type === 'reservation' ? 'bg-purple-100' :
                    activity.type === 'housekeeping' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'checkin' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.type === 'checkout' && <Clock className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'reservation' && <Calendar className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'housekeeping' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                    {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{activity.action}</p>
                    <p className="text-sm text-secondary-600">{activity.guest} - Room {activity.room}</p>
                  </div>
                  <div className="text-sm text-secondary-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Today's Check-ins */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Check-ins</h3>
              <div className="space-y-3">
                {upcomingCheckIns.map((checkin, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{checkin.guest}</p>
                      <p className="text-xs text-secondary-600">Room {checkin.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary-900">{checkin.time}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        checkin.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {checkin.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Check-outs */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Check-outs</h3>
              <div className="space-y-3">
                {upcomingCheckOuts.map((checkout, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{checkout.guest}</p>
                      <p className="text-xs text-secondary-600">Room {checkout.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary-900">{checkout.time}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        checkout.status === 'ready' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {checkout.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
              <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-700">New Reservation</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">Check In Guest</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">Check Out Guest</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">Add Staff</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

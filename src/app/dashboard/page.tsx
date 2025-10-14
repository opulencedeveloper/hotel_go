'use client';

import Layout from '@/components/Layout';
import KPICard from '@/components/dashboard/KPICard';
import ArrivalsDepartures from '@/components/dashboard/ArrivalsDepartures';
import ActiveTasks from '@/components/dashboard/ActiveTasks';
import RevenueSnapshot from '@/components/dashboard/RevenueSnapshot';
import SystemAlerts from '@/components/dashboard/SystemAlerts';
import LiveFeed from '@/components/dashboard/LiveFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import { 
  DollarSign, 
  Bed, 
  TrendingUp, 
  BarChart3,
  Calendar
} from 'lucide-react';
import { 
  mockDashboardStats, 
  mockBookings, 
  mockHousekeepingTasks, 
  mockSyncEvents
} from '@/data/mockData';

export default function DashboardPage() {
  const stats = mockDashboardStats;

  const kpiCards = [
    {
      title: 'Occupancy',
      value: `${stats.occupancy.today}%`,
      period: 'Today',
      mtd: `${stats.occupancy.mtd}%`,
      ytd: `${stats.occupancy.ytd}%`,
      change: `${stats.occupancy.change_percent > 0 ? '+' : ''}${stats.occupancy.change_percent}%`,
      changeType: stats.occupancy.change_percent > 0 ? 'positive' as const : 'negative' as const,
      icon: Bed,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'ADR',
      value: `$${stats.adr.today}`,
      period: 'Average Daily Rate',
      mtd: `$${stats.adr.mtd}`,
      ytd: `$${stats.adr.ytd}`,
      change: `${stats.adr.change_percent > 0 ? '+' : ''}${stats.adr.change_percent}%`,
      changeType: stats.adr.change_percent > 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'RevPAR',
      value: `$${stats.revpar.today}`,
      period: 'Revenue per Available Room',
      mtd: `$${stats.revpar.mtd}`,
      ytd: `$${stats.revpar.ytd}`,
      change: `${stats.revpar.change_percent > 0 ? '+' : ''}${stats.revpar.change_percent}%`,
      changeType: stats.revpar.change_percent > 0 ? 'positive' as const : 'negative' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'ARR',
      value: `$${stats.arr.today.toLocaleString()}`,
      period: 'Average Room Revenue',
      mtd: `$${stats.arr.mtd.toLocaleString()}`,
      ytd: `$${stats.arr.ytd.toLocaleString()}`,
      change: `${stats.arr.change_percent > 0 ? '+' : ''}${stats.arr.change_percent}%`,
      changeType: stats.arr.change_percent > 0 ? 'positive' as const : 'negative' as const,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Generate arrivals and departures from mock data
  const upcomingCheckIns = mockBookings
    .filter(booking => booking.status === 'confirmed')
    .slice(0, 6)
    .map(booking => ({
      guest: booking.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest',
      room: 'TBD', // Room assignment happens at check-in
      time: '3:00 PM', // Default check-in time
      status: 'confirmed' as const,
      date: booking.arrival_date === new Date().toISOString().split('T')[0] ? 'Today' : 'Tomorrow'
    }));

  const upcomingCheckOuts = mockBookings
    .filter(booking => booking.status === 'checked-in')
    .slice(0, 6)
    .map(booking => ({
      guest: booking.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest',
      room: '201', // Assigned room
      time: '11:00 AM', // Default check-out time
      status: 'ready' as const,
      date: booking.departure_date === new Date().toISOString().split('T')[0] ? 'Today' : 'Tomorrow'
    }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              <p className="text-primary-100 text-lg mb-6">
                Welcome back! Here's what's happening at your hotel today.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-primary-100">System Online</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-primary-200">Last Sync:</span>
                  <span className="font-medium">{stats.last_sync}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-primary-200">Current Time:</span>
                  <span className="font-medium">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Calendar className="w-4 h-4" />
                  <span>Today's Schedule</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <BarChart3 className="w-4 h-4" />
                  <span>View Reports</span>
                </button>
                <button className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <TrendingUp className="w-4 h-4" />
                  <span>Quick Actions</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              period={kpi.period}
              mtd={kpi.mtd}
              ytd={kpi.ytd}
              change={kpi.change}
              changeType={kpi.changeType}
              icon={kpi.icon}
              color={kpi.color}
              bgColor={kpi.bgColor}
            />
          ))}
        </div>

        {/* Arrivals & Departures Timeline */}
        <ArrivalsDepartures 
          arrivals={upcomingCheckIns}
          departures={upcomingCheckOuts}
        />

        {/* Active Tasks & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActiveTasks tasks={mockHousekeepingTasks} />
          <RevenueSnapshot revenueByOutlet={stats.revenue_by_outlet} />
          <SystemAlerts 
            overbookRisk={stats.overbook_risk}
            lowInventoryAlerts={stats.low_inventory_alerts}
            syncErrors={stats.sync_errors}
            pendingPayments={stats.pending_payments}
          />
        </div>

        {/* Live Feed (Audit Stream) */}
        <LiveFeed events={mockSyncEvents} />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </Layout>
  );
}
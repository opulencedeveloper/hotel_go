'use client';

import { RootState } from "@/store";
import { useSelector } from "react-redux";

// Import individual dashboard components
import DashboardHeader from './DashboardHeader';
import SystemAlert from './SystemAlert';
import KPICards from './KPICards';
import TodaysOperations from './TodaysOperations';
import ActiveTasks from './ActiveTasks';
import RevenueBreakdown from './RevenueBreakdown';
import SystemStatus from './SystemStatus';


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

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader realTimeEnabled={realTimeEnabled} />

      {/* System Status Alert */}
      <SystemAlert systemHealth={systemHealth} />

      {/* KPI Cards */}
      <KPICards 
        occupancyRate={occupancyRate}
        totalRevenue={totalRevenue}
        activeAlerts={activeAlerts}
        selectedHotel={selectedHotel}
        stats={stats}
      />

      {/* Today's Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysOperations stats={stats} roomStatusCounts={roomStatusCounts} />
        <ActiveTasks stats={stats} />
      </div>

      {/* Revenue Breakdown */}
      <RevenueBreakdown stats={stats} />

      {/* System Status */}
      <SystemStatus stats={stats} systemHealth={systemHealth} />
    </div>
  );
};



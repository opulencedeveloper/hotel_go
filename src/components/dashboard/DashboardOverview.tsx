'use client';

import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { HouseKeepingStatus } from "@/utils/enum";

// Import individual dashboard components
import DashboardHeader from './DashboardHeader';
import SystemAlert from './SystemAlert';
import KPICards from './KPICards';
import TodaysOperations from './TodaysOperations';
import ActiveTasks from './ActiveTasks';
import RevenueBreakdown from './RevenueBreakdown';
import SystemStatus from './SystemStatus';


export const DashboardOverview = () => {
  // Redux state selectors
  const hotel = useSelector((state: RootState) => state.hotel);
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const stay = useSelector((state: RootState) => state.stay);
  const room = useSelector((state: RootState) => state.room);
  const staff = useSelector((state: RootState) => state.staff);
  
  const selectedHotelId = hotel.selectedHotelId;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === selectedHotelId);
  
  // Calculate real-time data from Redux state
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate arrivals and departures for today
  const todaysArrivals = stay.stays.filter(stay => 
    stay.checkInDate === today && stay.status === 'confirmed'
  ).length;
  
  const todaysDepartures = stay.stays.filter(stay => 
    stay.checkOutDate === today && stay.status === 'checked-in'
  ).length;
  
  // Calculate housekeeping tasks
  const activeHousekeepingTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.IN_PROGRESS
  ).length;
  
  const completedHousekeepingTasks = houseKeeping.houseKeepings.filter(task => 
    task.status === HouseKeepingStatus.COMPLETED
  ).length;
  
  // Calculate room status from room state
  const availableRooms = room.hotelRooms.filter(room => room.roomStatus === 'available').length;
  const occupiedRooms = room.hotelRooms.filter(room => room.roomStatus === 'occupied').length;
  const maintenanceRooms = room.hotelRooms.filter(room => room.roomStatus === 'maintenance').length;
  
  // Calculate occupancy rate
  const totalRooms = room.hotelRooms.length;
  const calculatedOccupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  // Calculate revenue (mock calculation)
  const baseRevenuePerRoom = 150; // Base revenue per occupied room
  const calculatedTotalRevenue = occupiedRooms * baseRevenuePerRoom;
  
  // Calculate active alerts
  const activeAlerts = Math.max(0, maintenanceRooms + (activeHousekeepingTasks > 10 ? 1 : 0));
  
  // Dynamic stats based on Redux state
  const stats = {
    occupancy: {
      rate: calculatedOccupancyRate,
      change_percent: 5.2 // This could be calculated from historical data
    },
    revenue_by_outlet: {
      rooms: Math.round(calculatedTotalRevenue * 0.7),
      f_and_b: Math.round(calculatedTotalRevenue * 0.2),
      other: Math.round(calculatedTotalRevenue * 0.1)
    },
    arrivals_today: todaysArrivals,
    departures_today: todaysDepartures,
    housekeeping_tasks: activeHousekeepingTasks,
    maintenance_tasks: maintenanceRooms,
    guest_requests: Math.floor(Math.random() * 10) + 1, // Mock guest requests
    overbook_risk: Math.max(0, todaysArrivals - availableRooms),
    online_status: true,
    last_sync: '2 minutes ago',
    pending_sync_items: 0
  };

  const occupancyRate = stats.occupancy.rate;
  const totalRevenue = stats.revenue_by_outlet.rooms + stats.revenue_by_outlet.f_and_b + stats.revenue_by_outlet.other;
  const systemHealth = 'healthy';
  const roomStatusCounts = {
    available: availableRooms,
    occupied: occupiedRooms,
    maintenance: maintenanceRooms
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



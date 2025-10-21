import { connectDB } from "../utils/db";
import { RoomService } from "./roomService";
import { GuestService } from "./guestService";
import { ReservationService } from "./reservationService";
import { StaffService } from "./staffService";

export class DashboardService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(hotelId: string): Promise<{
    overview: {
      totalRooms: number;
      occupiedRooms: number;
      availableRooms: number;
      totalGuests: number;
      vipGuests: number;
      totalStaff: number;
      activeStaff: number;
      totalReservations: number;
      todayArrivals: number;
      todayDepartures: number;
    };
    revenue: {
      todayRevenue: number;
      monthlyRevenue: number;
      yearlyRevenue: number;
      averageRoomRate: number;
    };
    occupancy: {
      currentOccupancyRate: number;
      monthlyOccupancyRate: number;
      yearlyOccupancyRate: number;
    };
    alerts: Array<{
      type: 'warning' | 'info' | 'success' | 'error';
      message: string;
      timestamp: Date;
    }>;
  }> {
    await connectDB();
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Get room statistics
    const roomStats = await RoomService.getRoomStatistics(hotelId);
    
    // Get guest statistics
    const guestStats = await GuestService.getGuestStatistics(hotelId);
    
    // Get staff statistics
    const staffStats = await StaffService.getStaffStatistics(hotelId);
    
    // Get reservation statistics
    const [todayReservations, monthlyReservations, yearlyReservations] = await Promise.all([
      ReservationService.getReservationStatistics(hotelId, {
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }),
      ReservationService.getReservationStatistics(hotelId, {
        startDate: startOfMonth,
        endDate: today
      }),
      ReservationService.getReservationStatistics(hotelId, {
        startDate: startOfYear,
        endDate: today
      })
    ]);
    
    // Get today's arrivals and departures
    const [todaysArrivals, todaysDepartures] = await Promise.all([
      ReservationService.getTodaysArrivals(hotelId),
      ReservationService.getTodaysDepartures(hotelId)
    ]);
    
    // Calculate occupancy rates
    const currentOccupancyRate = roomStats.total > 0 
      ? Math.round((roomStats.occupied / roomStats.total) * 100) 
      : 0;
    
    // Calculate average room rate
    const averageRoomRate = todayReservations.total > 0 
      ? Math.round(todayReservations.totalRevenue / todayReservations.total)
      : 0;
    
    // Generate alerts
    const alerts = this.generateAlerts(roomStats, guestStats, staffStats, todaysArrivals, todaysDepartures);
    
    return {
      overview: {
        totalRooms: roomStats.total,
        occupiedRooms: roomStats.occupied,
        availableRooms: roomStats.available,
        totalGuests: guestStats.total,
        vipGuests: guestStats.vip,
        totalStaff: staffStats.total,
        activeStaff: staffStats.active,
        totalReservations: todayReservations.total,
        todayArrivals: todaysArrivals.length,
        todayDepartures: todaysDepartures.length,
      },
      revenue: {
        todayRevenue: todayReservations.totalRevenue,
        monthlyRevenue: monthlyReservations.totalRevenue,
        yearlyRevenue: yearlyReservations.totalRevenue,
        averageRoomRate: averageRoomRate,
      },
      occupancy: {
        currentOccupancyRate: currentOccupancyRate,
        monthlyOccupancyRate: 0, // This would need more complex calculation
        yearlyOccupancyRate: 0, // This would need more complex calculation
      },
      alerts: alerts
    };
  }

  // Generate system alerts
  private static generateAlerts(
    roomStats: any,
    guestStats: any,
    staffStats: any,
    todaysArrivals: any[],
    todaysDepartures: any[]
  ): Array<{
    type: 'warning' | 'info' | 'success' | 'error';
    message: string;
    timestamp: Date;
  }> {
    const alerts = [];
    
    // Room alerts
    if (roomStats.maintenance > 0) {
      alerts.push({
        type: 'warning' as const,
        message: `${roomStats.maintenance} room(s) under maintenance`,
        timestamp: new Date()
      });
    }
    
    if (roomStats.outOfOrder > 0) {
      alerts.push({
        type: 'error' as const,
        message: `${roomStats.outOfOrder} room(s) out of order`,
        timestamp: new Date()
      });
    }
    
    if (roomStats.cleaning > 0) {
      alerts.push({
        type: 'info' as const,
        message: `${roomStats.cleaning} room(s) being cleaned`,
        timestamp: new Date()
      });
    }
    
    // Staff alerts
    if (staffStats.onLeave > 0) {
      alerts.push({
        type: 'warning' as const,
        message: `${staffStats.onLeave} staff member(s) on leave`,
        timestamp: new Date()
      });
    }
    
    // Arrival/Departure alerts
    if (todaysArrivals.length > 0) {
      alerts.push({
        type: 'info' as const,
        message: `${todaysArrivals.length} guest(s) arriving today`,
        timestamp: new Date()
      });
    }
    
    if (todaysDepartures.length > 0) {
      alerts.push({
        type: 'info' as const,
        message: `${todaysDepartures.length} guest(s) departing today`,
        timestamp: new Date()
      });
    }
    
    // VIP guest alert
    if (guestStats.vip > 0) {
      alerts.push({
        type: 'success' as const,
        message: `${guestStats.vip} VIP guest(s) in house`,
        timestamp: new Date()
      });
    }
    
    return alerts;
  }

  // Get revenue analytics
  static async getRevenueAnalytics(hotelId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{
    labels: string[];
    data: number[];
    total: number;
    growth: number;
  }> {
    await connectDB();
    
    const now = new Date();
    let startDate: Date;
    let labels: string[] = [];
    let data: number[] = [];
    
    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          labels.push(date.toLocaleDateString());
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
          
          const dayStats = await ReservationService.getReservationStatistics(hotelId, {
            startDate: dayStart,
            endDate: dayEnd
          });
          data.push(dayStats.totalRevenue);
        }
        break;
        
      case 'weekly':
        startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000); // Last 12 weeks
        for (let i = 11; i >= 0; i--) {
          const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          labels.push(`Week ${12 - i}`);
          
          const weekStats = await ReservationService.getReservationStatistics(hotelId, {
            startDate: weekStart,
            endDate: weekEnd
          });
          data.push(weekStats.totalRevenue);
        }
        break;
        
      case 'monthly':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1); // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
          labels.push(month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
          
          const monthStats = await ReservationService.getReservationStatistics(hotelId, {
            startDate: month,
            endDate: nextMonth
          });
          data.push(monthStats.totalRevenue);
        }
        break;
        
      case 'yearly':
        startDate = new Date(now.getFullYear() - 5, 0, 1); // Last 5 years
        for (let i = 4; i >= 0; i--) {
          const year = new Date(now.getFullYear() - i, 0, 1);
          const nextYear = new Date(year.getFullYear() + 1, 0, 1);
          labels.push(year.getFullYear().toString());
          
          const yearStats = await ReservationService.getReservationStatistics(hotelId, {
            startDate: year,
            endDate: nextYear
          });
          data.push(yearStats.totalRevenue);
        }
        break;
    }
    
    const total = data.reduce((sum, value) => sum + value, 0);
    const previousTotal = data.length > 1 ? data.slice(0, -1).reduce((sum, value) => sum + value, 0) : 0;
    const growth = previousTotal > 0 ? Math.round(((total - previousTotal) / previousTotal) * 100) : 0;
    
    return {
      labels,
      data,
      total,
      growth
    };
  }

  // Get occupancy analytics
  static async getOccupancyAnalytics(hotelId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<{
    labels: string[];
    data: number[];
    average: number;
  }> {
    await connectDB();
    
    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];
    
    // This is a simplified version - in a real implementation, you'd need to track
    // historical occupancy data or calculate it from reservation data
    
    switch (period) {
      case 'daily':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          labels.push(date.toLocaleDateString());
          // Simplified occupancy calculation
          const roomStats = await RoomService.getRoomStatistics(hotelId);
          const occupancyRate = roomStats.total > 0 ? Math.round((roomStats.occupied / roomStats.total) * 100) : 0;
          data.push(occupancyRate);
        }
        break;
        
      case 'weekly':
        for (let i = 11; i >= 0; i--) {
          labels.push(`Week ${12 - i}`);
          const roomStats = await RoomService.getRoomStatistics(hotelId);
          const occupancyRate = roomStats.total > 0 ? Math.round((roomStats.occupied / roomStats.total) * 100) : 0;
          data.push(occupancyRate);
        }
        break;
        
      case 'monthly':
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
          const roomStats = await RoomService.getRoomStatistics(hotelId);
          const occupancyRate = roomStats.total > 0 ? Math.round((roomStats.occupied / roomStats.total) * 100) : 0;
          data.push(occupancyRate);
        }
        break;
    }
    
    const average = data.length > 0 ? Math.round(data.reduce((sum, value) => sum + value, 0) / data.length) : 0;
    
    return {
      labels,
      data,
      average
    };
  }
}






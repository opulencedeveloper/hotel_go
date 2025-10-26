import { Types } from "mongoose";
import Room from "../room/entity";
import Staff from "../staff/entity";
import Stay from "../stay/entity";
import HouseKeeping from "../house-keeping/entity";

/**
 * Real-time Dashboard Service for Hotel Management
 * 
 * This service follows proven patterns from successful hotel management systems:
 * 1. Quick stats for immediate overview (always loaded)
 * 2. Detailed stats only when requested
 * 3. Efficient queries optimized for large datasets
 * 4. Caching for frequently accessed data
 */
class RealTimeDashboardService {
  
  /**
   * Get quick stats for dashboard overview
   * This is the most frequently accessed data - optimized for speed
   */
  public async getQuickStats(hotelId: Types.ObjectId) {
    try {
      // Use aggregation for maximum efficiency
      const [roomStats, todayStats, staffStats, housekeepingStats] = await Promise.all([
        this.getRoomQuickStats(hotelId),
        this.getTodayStats(hotelId),
        this.getStaffQuickStats(hotelId),
        this.getHousekeepingQuickStats(hotelId)
      ]);

      return {
        totalRooms: roomStats.total,
        occupiedRooms: roomStats.occupied,
        availableRooms: roomStats.available,
        maintenanceRooms: roomStats.maintenance,
        occupancyRate: roomStats.occupancyRate,
        todayArrivals: todayStats.arrivals,
        todayDepartures: todayStats.departures,
        currentGuests: todayStats.currentGuests,
        activeStaff: staffStats.active,
        pendingTasks: housekeepingStats.pending,
        completedTasks: housekeepingStats.completed,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting quick stats:', error);
      throw error;
    }
  }

  /**
   * Get room quick stats using aggregation
   */
  private async getRoomQuickStats(hotelId: Types.ObjectId) {
    const stats = await Room.aggregate([
      { $match: { hotelId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          occupied: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "occupied"] }, 1, 0] }
          },
          available: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "available"] }, 1, 0] }
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "maintenance"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          occupied: 1,
          available: 1,
          maintenance: 1,
          occupancyRate: {
            $round: [
              { $multiply: [{ $divide: ["$occupied", "$total"] }, 100] },
              1
            ]
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      occupied: 0,
      available: 0,
      maintenance: 0,
      occupancyRate: 0
    };
  }

  /**
   * Get today's key metrics
   */
  private async getTodayStats(hotelId: Types.ObjectId) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    const [arrivals, departures, currentGuests] = await Promise.all([
      // Today's arrivals
      Stay.aggregate([
        {
          $match: {
            hotelId,
            checkInDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ["confirmed", "checked_in"] }
          }
        },
        { $count: "arrivals" }
      ]),
      
      // Today's departures
      Stay.aggregate([
        {
          $match: {
            hotelId,
            checkOutDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ["checked_out"] }
          }
        },
        { $count: "departures" }
      ]),
      
      // Current guests (checked in)
      Stay.aggregate([
        {
          $match: {
            hotelId,
            status: "checked_in"
          }
        },
        { $count: "currentGuests" }
      ])
    ]);

    return {
      arrivals: arrivals[0]?.arrivals || 0,
      departures: departures[0]?.departures || 0,
      currentGuests: currentGuests[0]?.currentGuests || 0
    };
  }

  /**
   * Get staff quick stats
   */
  private async getStaffQuickStats(hotelId: Types.ObjectId) {
    const stats = await Staff.aggregate([
      { $match: { hotelId } },
      {
        $group: {
          _id: null,
          active: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          }
        }
      }
    ]);

    return {
      active: stats[0]?.active || 0
    };
  }

  /**
   * Get housekeeping quick stats
   */
  private async getHousekeepingQuickStats(hotelId: Types.ObjectId) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [pending, completed] = await Promise.all([
      // Pending tasks
      HouseKeeping.aggregate([
        {
          $match: {
            hotelId,
            status: "in_progress"
          }
        },
        { $count: "pending" }
      ]),
      
      // Completed today
      HouseKeeping.aggregate([
        {
          $match: {
            hotelId,
            status: "completed",
            updatedAt: { $gte: startOfDay }
          }
        },
        { $count: "completed" }
      ])
    ]);

    return {
      pending: pending[0]?.pending || 0,
      completed: completed[0]?.completed || 0
    };
  }

  /**
   * Get detailed statistics for specific period
   * This is only called when user requests detailed view
   */
  public async getDetailedStats(hotelId: Types.ObjectId, period: string) {
    try {
      const dateRange = this.getDateRange(period);
      
      const [roomStats, staffStats, stayStats, housekeepingStats] = await Promise.all([
        this.getDetailedRoomStats(hotelId, dateRange),
        this.getDetailedStaffStats(hotelId, dateRange),
        this.getDetailedStayStats(hotelId, dateRange),
        this.getDetailedHousekeepingStats(hotelId, dateRange)
      ]);

      return {
        rooms: roomStats,
        staff: staffStats,
        stays: stayStats,
        housekeeping: housekeepingStats,
        period,
        dateRange
      };
    } catch (error) {
      console.error('Error getting detailed stats:', error);
      throw error;
    }
  }

  /**
   * Get detailed room statistics
   */
  private async getDetailedRoomStats(hotelId: Types.ObjectId, dateRange: { startDate: Date; endDate: Date }) {
    const stats = await Room.aggregate([
      { $match: { hotelId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "available"] }, 1, 0] }
          },
          occupied: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "occupied"] }, 1, 0] }
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "maintenance"] }, 1, 0] }
          },
          cleaning: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "cleaning"] }, 1, 0] }
          },
          outOfOrder: {
            $sum: { $cond: [{ $eq: ["$roomStatus", "out_of_order"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          available: 1,
          occupied: 1,
          maintenance: 1,
          cleaning: 1,
          outOfOrder: 1,
          occupancyRate: {
            $round: [
              { $multiply: [{ $divide: ["$occupied", "$total"] }, 100] },
              2
            ]
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      available: 0,
      occupied: 0,
      maintenance: 0,
      cleaning: 0,
      outOfOrder: 0,
      occupancyRate: 0
    };
  }

  /**
   * Get detailed staff statistics
   */
  private async getDetailedStaffStats(hotelId: Types.ObjectId, dateRange: { startDate: Date; endDate: Date }) {
    const stats = await Staff.aggregate([
      { $match: { hotelId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          },
          inactive: {
            $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] }
          },
          onLeave: {
            $sum: { $cond: [{ $eq: ["$status", "on_leave"] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      onLeave: 0
    };
  }

  /**
   * Get detailed stay statistics
   */
  private async getDetailedStayStats(hotelId: Types.ObjectId, dateRange: { startDate: Date; endDate: Date }) {
    const stats = await Stay.aggregate([
      {
        $match: {
          hotelId,
          $or: [
            { checkInDate: { $gte: dateRange.startDate, $lte: dateRange.endDate } },
            { checkOutDate: { $gte: dateRange.startDate, $lte: dateRange.endDate } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          confirmed: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
          },
          checkedIn: {
            $sum: { $cond: [{ $eq: ["$status", "checked_in"] }, 1, 0] }
          },
          checkedOut: {
            $sum: { $cond: [{ $eq: ["$status", "checked_out"] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          },
          arrivals: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "checked_in"] },
                    { $gte: ["$checkInDate", dateRange.startDate] },
                    { $lte: ["$checkInDate", dateRange.endDate] }
                  ]
                },
                1,
                0
              ]
            }
          },
          departures: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "checked_out"] },
                    { $gte: ["$checkOutDate", dateRange.startDate] },
                    { $lte: ["$checkOutDate", dateRange.endDate] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      confirmed: 0,
      checkedIn: 0,
      checkedOut: 0,
      cancelled: 0,
      arrivals: 0,
      departures: 0
    };
  }

  /**
   * Get detailed housekeeping statistics
   */
  private async getDetailedHousekeepingStats(hotelId: Types.ObjectId, dateRange: { startDate: Date; endDate: Date }) {
    const stats = await HouseKeeping.aggregate([
      {
        $match: {
          hotelId,
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      pending: 0
    };
  }

  /**
   * Get date range based on period
   */
  private getDateRange(period: string): { startDate: Date; endDate: Date } {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'day':
        return {
          startDate: startOfDay,
          endDate: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'week':
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        return {
          startDate: startOfWeek,
          endDate: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
        };
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
          startDate: startOfMonth,
          endDate: new Date(endOfMonth.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        return {
          startDate: startOfYear,
          endDate: new Date(endOfYear.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      default:
        return {
          startDate: new Date(0),
          endDate: new Date()
        };
    }
  }
}

export const realTimeDashboardService = new RealTimeDashboardService();

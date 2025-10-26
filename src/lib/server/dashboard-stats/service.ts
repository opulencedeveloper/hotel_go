import { Types } from "mongoose";
import { IDashboardStatsParams, IDashboardStatsResponse } from "./interface";
import Room from "../room/entity";
import Staff from "../staff/entity";
import Stay from "../stay/entity";
import HouseKeeping from "../house-keeping/entity";

class DashboardStatsService {
  
  /**
   * Get optimized dashboard statistics with date filtering
   * Uses aggregation pipelines for efficient queries on large collections
   */
  public async getDashboardStats(params: IDashboardStatsParams): Promise<IDashboardStatsResponse> {
    const { hotelId, startDate, endDate, period = 'all' } = params;

    try {
      // Execute all aggregation queries in parallel
      const [roomStats, staffStats, stayStats, housekeepingStats] = await Promise.all([
        this.getRoomStatistics(hotelId, startDate, endDate, period),
        this.getStaffStatistics(hotelId, startDate, endDate, period),
        this.getStayStatistics(hotelId, startDate, endDate, period),
        this.getHousekeepingStatistics(hotelId, startDate, endDate, period)
      ]);

      return {
        rooms: roomStats,
        staff: staffStats,
        stays: stayStats,
        housekeeping: housekeepingStats,
        metadata: {
          period,
          startDate,
          endDate,
          generatedAt: new Date(),
          hotelId: hotelId.toString()
        }
      };
    } catch (error) {
      console.error('Error getting dashboard statistics:', error);
      throw error;
    }
  }

  /**
   * Get room statistics using aggregation pipeline
   */
  private async getRoomStatistics(
    hotelId: Types.ObjectId,
    startDate?: Date,
    endDate?: Date,
    period: string = 'all'
  ) {
    try {
      const matchQuery: any = { hotelId };
      
      // Add date filtering if provided
      if (startDate || endDate) {
        matchQuery.updatedAt = {};
        if (startDate) matchQuery.updatedAt.$gte = startDate;
        if (endDate) matchQuery.updatedAt.$lte = endDate;
      }

      const stats = await Room.aggregate([
        { $match: matchQuery },
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
    } catch (error) {
      console.error('Error getting room statistics:', error);
      throw error;
    }
  }

  /**
   * Get staff statistics using aggregation pipeline
   */
  private async getStaffStatistics(
    hotelId: Types.ObjectId,
    startDate?: Date,
    endDate?: Date,
    period: string = 'all'
  ) {
    try {
      const matchQuery: any = { hotelId };
      
      if (startDate || endDate) {
        matchQuery.updatedAt = {};
        if (startDate) matchQuery.updatedAt.$gte = startDate;
        if (endDate) matchQuery.updatedAt.$lte = endDate;
      }

      const stats = await Staff.aggregate([
        { $match: matchQuery },
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
        },
        {
          $project: {
            _id: 0,
            total: 1,
            active: 1,
            inactive: 1,
            onLeave: 1
          }
        }
      ]);

      return stats[0] || {
        total: 0,
        active: 0,
        inactive: 0,
        onLeave: 0
      };
    } catch (error) {
      console.error('Error getting staff statistics:', error);
      throw error;
    }
  }

  /**
   * Get stay statistics using aggregation pipeline
   */
  private async getStayStatistics(
    hotelId: Types.ObjectId,
    startDate?: Date,
    endDate?: Date,
    period: string = 'all'
  ) {
    try {
      const matchQuery: any = { hotelId };
      
      if (startDate || endDate) {
        matchQuery.$or = [
          { checkInDate: { $gte: startDate, $lte: endDate } },
          { checkOutDate: { $gte: startDate, $lte: endDate } }
        ];
      }

      const stats = await Stay.aggregate([
        { $match: matchQuery },
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
                      { $gte: ["$checkInDate", startDate || new Date(0)] },
                      { $lte: ["$checkInDate", endDate || new Date()] }
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
                      { $gte: ["$checkOutDate", startDate || new Date(0)] },
                      { $lte: ["$checkOutDate", endDate || new Date()] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            total: 1,
            confirmed: 1,
            checkedIn: 1,
            checkedOut: 1,
            cancelled: 1,
            arrivals: 1,
            departures: 1
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
    } catch (error) {
      console.error('Error getting stay statistics:', error);
      throw error;
    }
  }

  /**
   * Get housekeeping statistics using aggregation pipeline
   */
  private async getHousekeepingStatistics(
    hotelId: Types.ObjectId,
    startDate?: Date,
    endDate?: Date,
    period: string = 'all'
  ) {
    try {
      const matchQuery: any = { hotelId };
      
      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = startDate;
        if (endDate) matchQuery.createdAt.$lte = endDate;
      }

      const stats = await HouseKeeping.aggregate([
        { $match: matchQuery },
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
        },
        {
          $project: {
            _id: 0,
            total: 1,
            inProgress: 1,
            completed: 1,
            cancelled: 1,
            pending: 1
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
    } catch (error) {
      console.error('Error getting housekeeping statistics:', error);
      throw error;
    }
  }

  /**
   * Get date range based on period
   */
  public getDateRange(period: string): { startDate: Date; endDate: Date } {
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

export const dashboardStatsService = new DashboardStatsService();

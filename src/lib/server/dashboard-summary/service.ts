import { Types } from "mongoose";
import { IDashboardSummaryParams, IDashboardSummaryResponse, IQuickSummaryResponse } from "./interface";
import Room from "../room/entity";
import Staff from "../staff/entity";
import Stay from "../stay/entity";
import HouseKeeping from "../house-keeping/entity";
import { Order } from "../order/entity";
import Inventory from "../inventory/enitity";

/**
 * Dashboard Summary Service
 * 
 * This service provides optimized summary data for the dashboard
 * using MongoDB aggregation pipelines for efficient queries on large datasets
 */
class DashboardSummaryService {
  
  /**
   * Get comprehensive dashboard summary
   * Uses parallel aggregation queries for maximum efficiency
   */
  public async getDashboardSummary(params: IDashboardSummaryParams): Promise<IDashboardSummaryResponse> {
    const { hotelId, startDate, endDate, period = 'all' } = params;

    console.log('🔍 Dashboard Summary Debug:', {
      hotelId: hotelId?.toString(),
      startDate,
      endDate,
      period
    });

    try {
      // Execute all aggregation queries in parallel for maximum efficiency
      const [
        roomSummary,
        staffSummary,
        staySummary,
        housekeepingSummary,
        orderSummary,
        inventorySummary,
        revenueSummary
      ] = await Promise.all([
        this.getRoomSummary(hotelId, startDate, endDate),
        this.getStaffSummary(hotelId),
        this.getStaySummary(hotelId, startDate, endDate),
        this.getHousekeepingSummary(hotelId, startDate, endDate),
        this.getOrderSummary(hotelId, startDate, endDate),
        this.getInventorySummary(hotelId),
        this.getRevenueSummary(hotelId, startDate, endDate)
      ]);

      return {
        rooms: roomSummary,
        staff: staffSummary,
        stays: staySummary,
        housekeeping: housekeepingSummary,
        orders: orderSummary,
        inventory: inventorySummary,
        revenue: revenueSummary,
        metadata: {
          hotelId: hotelId.toString(),
          period,
          generatedAt: new Date(),
          version: "1.0"
        }
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }

  /**
   * Get quick summary for dashboard overview
   * Optimized for speed with essential metrics only
   */
  public async getQuickSummary(hotelId: Types.ObjectId): Promise<IQuickSummaryResponse> {
    try {
      console.log('⚡ Quick Summary Debug - hotelId:', hotelId?.toString());
      
      // Check if there's any data in the database
      const roomCount = await Room.countDocuments({ hotelId: new Types.ObjectId(hotelId) });
      console.log('📊 Total rooms for quick summary:', roomCount);
      
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

      // Parallel queries for quick stats
      const [
        roomStats,
        todayStats,
        staffStats,
        housekeepingStats,
        orderStats,
        inventoryStats,
        revenueStats
      ] = await Promise.all([
        this.getQuickRoomStats(hotelId),
        this.getTodayStats(hotelId, startOfDay, endOfDay),
        this.getQuickStaffStats(hotelId),
        this.getQuickHousekeepingStats(hotelId),
        this.getQuickOrderStats(hotelId, startOfDay, endOfDay),
        this.getQuickInventoryStats(hotelId),
        this.getTodayRevenue(hotelId, startOfDay, endOfDay)
      ]);

      return {
        occupancyRate: roomStats.occupancyRate,
        todayArrivals: todayStats.arrivals,
        todayDepartures: todayStats.departures,
        currentGuests: todayStats.currentGuests,
        activeStaff: staffStats.active,
        pendingTasks: housekeepingStats.pending,
        completedTasks: housekeepingStats.completed,
        todayRevenue: revenueStats.today,
        lowStockItems: inventoryStats.lowStock,
        pendingOrders: orderStats.pending,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting quick summary:', error);
      throw error;
    }
  }

  /**
   * Get room summary with aggregation
   */
  private async getRoomSummary(hotelId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const matchQuery: any = { hotelId: new Types.ObjectId(hotelId) };
    
    if (startDate || endDate) {
      matchQuery.updatedAt = {};
      if (startDate) matchQuery.updatedAt.$gte = startDate;
      if (endDate) matchQuery.updatedAt.$lte = endDate;
    }

    console.log('🏨 Room Summary Query:', matchQuery);

    // First, let's check if there are any rooms at all
    const totalRooms = await Room.countDocuments({ hotelId: new Types.ObjectId(hotelId) });
    console.log('📊 Total rooms in database:', totalRooms);
 
    const stats = await Room.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ["$roomStatus", "available"] }, 1, 0] } },
          occupied: { $sum: { $cond: [{ $eq: ["$roomStatus", "occupied"] }, 1, 0] } },
          maintenance: { $sum: { $cond: [{ $eq: ["$roomStatus", "maintenance"] }, 1, 0] } },
          cleaning: { $sum: { $cond: [{ $eq: ["$roomStatus", "cleaning"] }, 1, 0] } },
          outOfOrder: { $sum: { $cond: [{ $eq: ["$roomStatus", "out_of_order"] }, 1, 0] } }
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

    console.log('🔍 Room aggregation result:', stats);

    // Let's also check what the actual room data looks like
    const sampleRooms = await Room.find({ hotelId: new Types.ObjectId(hotelId) }).limit(3);
    console.log('🔍 Sample room data:', sampleRooms.map(r => ({ 
      roomNumber: r.roomNumber, 
      roomStatus: r.roomStatus,
      hotelId: r.hotelId 
    })));

    return stats[0] || {
      total: 0,
      available: 0,
      occupied: 0,
      maintenance: 0,
      cleaning: 0,
      outOfOrder: 0,
      occupancyRate: 0,
      revenue: 0
    };
  }

  /**
   * Get staff summary with aggregation
   */
  private async getStaffSummary(hotelId: Types.ObjectId) {
    const stats = await Staff.aggregate([
      { $match: { hotelId: new Types.ObjectId(hotelId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
          onLeave: { $sum: { $cond: [{ $eq: ["$status", "on_leave"] }, 1, 0] } },
          terminated: { $sum: { $cond: [{ $eq: ["$status", "terminated"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          active: 1,
          inactive: 1,
          onLeave: 1,
          terminated: 1,
          pending: 1
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      onLeave: 0,
      terminated: 0,
      pending: 0,
      byDepartment: {
        frontDesk: 0,
        housekeeping: 0,
        kitchen: 0,
        maintenance: 0,
        security: 0,
        management: 0
      }
    };
  }

  /**
   * Get stay summary with aggregation
   */
  private async getStaySummary(hotelId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const matchQuery: any = { hotelId: new Types.ObjectId(hotelId) };
    
    if (startDate || endDate) {
      matchQuery.$or = [
        { checkInDate: { $gte: startDate, $lte: endDate } },
        { checkOutDate: { $gte: startDate, $lte: endDate } }
      ];
    }

    const stats = await Stay.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room"
        }
      },
      {
        $addFields: {
          // Use actual totalAmount if available, otherwise calculate based on room rate and duration
          calculatedAmount: {
            $cond: {
              if: { $gt: ["$totalAmount", 0] },
              then: "$totalAmount",
              else: {
                $multiply: [
                  { $ifNull: [{ $arrayElemAt: ["$room.roomRate", 0] }, 100] }, // Default rate $100/night
                  {
                    $max: [
                      1,
                      {
                        $divide: [
                          { $subtract: ["$checkOutDate", "$checkInDate"] },
                          1000 * 60 * 60 * 24 // Convert to days
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
          checkedIn: { $sum: { $cond: [{ $eq: ["$status", "checked_in"] }, 1, 0] } },
          checkedOut: { $sum: { $cond: [{ $eq: ["$status", "checked_out"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
          noShow: { $sum: { $cond: [{ $eq: ["$status", "no_show"] }, 1, 0] } },
          revenue: { $sum: "$calculatedAmount" }
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
          noShow: 1,
          revenue: 1
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      confirmed: 0,
      checkedIn: 0,
      checkedOut: 0,
      cancelled: 0,
      noShow: 0,
      todayArrivals: 0,
      todayDepartures: 0,
      currentGuests: 0,
      averageStayDuration: 0,
      revenue: 0
    };
  }

  /**
   * Get housekeeping summary with aggregation
   */
  private async getHousekeepingSummary(hotelId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const matchQuery: any = { hotelId: new Types.ObjectId(hotelId) };
    
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
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          pending: 1,
          inProgress: 1,
          completed: 1,
          cancelled: 1
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
      byPriority: {
        high: 0,
        medium: 0,
        low: 0
      },
      byRoomType: {
        standard: 0,
        deluxe: 0,
        suite: 0
      }
    };
  }

  /**
   * Get order summary with aggregation
   */
  private async getOrderSummary(hotelId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const matchQuery: any = { hotelId };
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = startDate;
      if (endDate) matchQuery.createdAt.$lte = endDate;
    }

    const stats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
          preparing: { $sum: { $cond: [{ $eq: ["$status", "preparing"] }, 1, 0] } },
          ready: { $sum: { $cond: [{ $eq: ["$status", "ready"] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
          revenue: { $sum: { $ifNull: ["$totalAmount", 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          pending: 1,
          confirmed: 1,
          preparing: 1,
          ready: 1,
          delivered: 1,
          cancelled: 1,
          revenue: 1,
          averageOrderValue: {
            $round: [
              { $divide: ["$revenue", "$total"] },
              2
            ]
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
      revenue: 0,
      averageOrderValue: 0
    };
  }

  /**
   * Get inventory summary with aggregation
   */
  private async getInventorySummary(hotelId: Types.ObjectId) {
    const stats = await Inventory.aggregate([
      { $match: { hotelId: new Types.ObjectId(hotelId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          lowStock: { $sum: { $cond: [{ $lt: ["$currentStock", "$minimumStock"] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ["$currentStock", 0] }, 1, 0] } },
          expiringSoon: { $sum: { $cond: [{ $lt: ["$expiryDate", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          lowStock: 1,
          outOfStock: 1,
          expiringSoon: 1
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      lowStock: 0,
      outOfStock: 0,
      expiringSoon: 0,
      byCategory: {
        food: 0,
        beverage: 0,
        cleaning: 0,
        maintenance: 0,
        amenities: 0
      }
    };
  }

  /**
   * Get revenue summary with aggregation
   */
  private async getRevenueSummary(hotelId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
    
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [todayRevenue, weekRevenue, monthRevenue, yearRevenue] = await Promise.all([
      this.getTodayRevenue(hotelId, startOfDay, endOfDay),
      this.getPeriodRevenue(hotelId, startOfWeek, endOfDay),
      this.getPeriodRevenue(hotelId, startOfMonth, endOfDay),
      this.getPeriodRevenue(hotelId, startOfYear, endOfDay)
    ]);

    return {
      today: todayRevenue.today,
      thisWeek: weekRevenue.today,
      thisMonth: monthRevenue.today,
      thisYear: yearRevenue.today,
      bySource: {
        roomRevenue: todayRevenue.today,
        foodRevenue: 0,
        serviceRevenue: 0,
        otherRevenue: 0
      },
      averageDailyRate: 0,
      revenuePerAvailableRoom: 0
    };
  }

  // Quick stats methods for performance
  private async getQuickRoomStats(hotelId: Types.ObjectId) {
    const stats = await Room.aggregate([
      { $match: { hotelId: new Types.ObjectId(hotelId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          occupied: { $sum: { $cond: [{ $eq: ["$roomStatus", "occupied"] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          occupancyRate: {
            $round: [
              { $multiply: [{ $divide: ["$occupied", "$total"] }, 100] },
              1
            ]
          }
        }
      }
    ]);

    return stats[0] || { occupancyRate: 0 };
  }

  private async getTodayStats(hotelId: Types.ObjectId, startOfDay: Date, endOfDay: Date) {
    const [arrivals, departures, currentGuests] = await Promise.all([
      Stay.aggregate([
        {
          $match: {
            hotelId: new Types.ObjectId(hotelId),
            checkInDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ["confirmed", "checked_in"] }
          }
        },
        { $count: "arrivals" }
      ]),
      Stay.aggregate([
        {
          $match: {
            hotelId: new Types.ObjectId(hotelId),
            checkOutDate: { $gte: startOfDay, $lte: endOfDay },
            status: "checked_out"
          }
        },
        { $count: "departures" }
      ]),
      Stay.aggregate([
        { $match: { hotelId: new Types.ObjectId(hotelId), status: "checked_in" } },
        { $count: "currentGuests" }
      ])
    ]);

    return {
      arrivals: arrivals[0]?.arrivals || 0,
      departures: departures[0]?.departures || 0,
      currentGuests: currentGuests[0]?.currentGuests || 0
    };
  }

  private async getQuickStaffStats(hotelId: Types.ObjectId) {
    const stats = await Staff.aggregate([
      { $match: { hotelId: new Types.ObjectId(hotelId), status: "active" } },
      { $count: "active" }
    ]);

    return { active: stats[0]?.active || 0 };
  }

  private async getQuickHousekeepingStats(hotelId: Types.ObjectId) {
    const [pending, completed] = await Promise.all([
      HouseKeeping.aggregate([
        { $match: { hotelId: new Types.ObjectId(hotelId), status: "in_progress" } },
        { $count: "pending" }
      ]),
      HouseKeeping.aggregate([
        { $match: { hotelId: new Types.ObjectId(hotelId), status: "completed" } },
        { $count: "completed" }
      ])
    ]);

    return {
      pending: pending[0]?.pending || 0,
      completed: completed[0]?.completed || 0
    };
  }

  private async getQuickOrderStats(hotelId: Types.ObjectId, startOfDay: Date, endOfDay: Date) {
    const stats = await Order.aggregate([
      { $match: { hotelId, status: "pending" } },
      { $count: "pending" }
    ]);

    const pending = stats[0]?.pending || 0;

    return { pending };
  }

  private async getQuickInventoryStats(hotelId: Types.ObjectId) {
    const stats = await Inventory.aggregate([
      { $match: { hotelId: new Types.ObjectId(hotelId), $expr: { $lt: ["$currentStock", "$minimumStock"] } } },
      { $count: "lowStock" }
    ]);

    return { lowStock: stats[0]?.lowStock || 0 };
  }

  private async getTodayRevenue(hotelId: Types.ObjectId, startOfDay: Date, endOfDay: Date) {
    // First, let's see what stay data we have
    const sampleStays = await Stay.find({ hotelId: new Types.ObjectId(hotelId) }).limit(3);
    console.log('💰 Sample stay data for revenue:', sampleStays.map(s => ({
      status: s.status,
      checkInDate: s.checkInDate,
      totalAmount: s.totalAmount,
      paidAmount: s.paidAmount
    })));

    // Calculate revenue from stays with actual revenue data or estimate based on room rates
    const [stayRevenue, orderRevenue] = await Promise.all([
      // Revenue from stays - use actual totalAmount if available, otherwise estimate
      Stay.aggregate([
        {
          $match: {
            hotelId: new Types.ObjectId(hotelId),
            status: { $in: ["checked_in", "checked_out"] }
          }
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room"
          }
        },
        {
          $addFields: {
            // Use actual totalAmount if available, otherwise calculate based on room rate and duration
            calculatedAmount: {
              $cond: {
                if: { $gt: ["$totalAmount", 0] },
                then: "$totalAmount",
                else: {
                  $multiply: [
                    { $ifNull: [{ $arrayElemAt: ["$room.roomRate", 0] }, 100] }, // Default rate $100/night
                    {
                      $max: [
                        1,
                        {
                          $divide: [
                            { $subtract: ["$checkOutDate", "$checkInDate"] },
                            1000 * 60 * 60 * 24 // Convert to days
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$calculatedAmount" },
            paidRevenue: { $sum: { $ifNull: ["$paidAmount", 0] } }
          }
        }
      ]),
      // Revenue from orders (if available)
      Order.aggregate([
        {
          $match: {
            hotelId: new Types.ObjectId(hotelId),
            status: { $in: ["confirmed", "preparing", "ready", "delivered"] }
          }
        },
        {
          $group: {
            _id: null,
            orderRevenue: { $sum: { $ifNull: ["$totalAmount", 0] } }
          }
        }
      ])
    ]);

    const stayRev = stayRevenue[0]?.totalRevenue || 0;
    const orderRev = orderRevenue[0]?.orderRevenue || 0;
    const totalRevenue = stayRev + orderRev;

    console.log('💰 Revenue breakdown:', {
      stayRevenue: stayRev,
      orderRevenue: orderRev,
      totalRevenue: totalRevenue
    });

    return { today: totalRevenue };
  }

  private async getPeriodRevenue(hotelId: Types.ObjectId, startDate: Date, endDate: Date) {
    // Calculate revenue from ALL checked-out stays and paid orders
    const [stayRevenue, orderRevenue] = await Promise.all([
      // Revenue from stays - use actual totalAmount if available, otherwise estimate
      Stay.aggregate([
        {
          $match: {
            hotelId: new Types.ObjectId(hotelId),
            status: { $in: ["checked_in", "checked_out"] }
          }
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room"
          }
        },
        {
          $addFields: {
            // Use actual totalAmount if available, otherwise calculate based on room rate and duration
            calculatedAmount: {
              $cond: {
                if: { $gt: ["$totalAmount", 0] },
                then: "$totalAmount",
                else: {
                  $multiply: [
                    { $ifNull: [{ $arrayElemAt: ["$room.roomRate", 0] }, 100] }, // Default rate $100/night
                    {
                      $max: [
                        1,
                        {
                          $divide: [
                            { $subtract: ["$checkOutDate", "$checkInDate"] },
                            1000 * 60 * 60 * 24 // Convert to days
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$calculatedAmount" },
            paidRevenue: { $sum: { $ifNull: ["$paidAmount", 0] } }
          }
        }
      ]),
      // Revenue from orders (if available)
      Order.aggregate([
        {
          $match: {
            hotelId: new Types.ObjectId(hotelId),
            status: { $in: ["confirmed", "preparing", "ready", "delivered"] }
          }
        },
        {
          $group: {
            _id: null,
            orderRevenue: { $sum: { $ifNull: ["$totalAmount", 0] } }
          }
        }
      ])
    ]);

    const stayRev = stayRevenue[0]?.totalRevenue || 0;
    const orderRev = orderRevenue[0]?.orderRevenue || 0;
    const totalRevenue = stayRev + orderRev;

    return { today: totalRevenue };
  }
}

export const dashboardSummaryService = new DashboardSummaryService();

import { Types } from "mongoose";
import Room from "./entity";

/**
 * MongoDB Aggregation Methods for Room Service
 * 
 * These methods use MongoDB aggregation pipelines instead of fetching
 * full documents, making them efficient for millions of documents.
 */

export class RoomAggregationMethods {
  
  /**
   * Get room statistics using MongoDB aggregation pipeline
   * MUCH more efficient than fetching all documents
   */
  public static async getRoomStatisticsByHotelId(hotelId: string) {
    try {
      const stats = await Room.aggregate([
        {
          $match: { hotelId: new Types.ObjectId(hotelId) }
        },
        {
          $group: {
            _id: null,
            totalRooms: { $sum: 1 },
            availableRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "available"] }, 1, 0] }
            },
            occupiedRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "occupied"] }, 1, 0] }
            },
            maintenanceRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "maintenance"] }, 1, 0] }
            },
            cleaningRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "cleaning"] }, 1, 0] }
            },
            outOfOrderRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "out_of_order"] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalRooms: 1,
            availableRooms: 1,
            occupiedRooms: 1,
            maintenanceRooms: 1,
            cleaningRooms: 1,
            outOfOrderRooms: 1,
            occupancyRate: {
              $round: [
                { $multiply: [{ $divide: ["$occupiedRooms", "$totalRooms"] }, 100] },
                2
              ]
            }
          }
        }
      ]);

      return stats[0] || {
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
        maintenanceRooms: 0,
        cleaningRooms: 0,
        outOfOrderRooms: 0,
        occupancyRate: 0
      };
    } catch (error) {
      console.error('Error getting room statistics:', error);
      throw error;
    }
  }

  /**
   * Get room statistics by floor for better organization
   */
  public static async getRoomStatisticsByFloor(hotelId: string) {
    try {
      const floorStats = await Room.aggregate([
        {
          $match: { hotelId: new Types.ObjectId(hotelId) }
        },
        {
          $group: {
            _id: "$floor",
            totalRooms: { $sum: 1 },
            availableRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "available"] }, 1, 0] }
            },
            occupiedRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "occupied"] }, 1, 0] }
            },
            maintenanceRooms: {
              $sum: { $cond: [{ $eq: ["$roomStatus", "maintenance"] }, 1, 0] }
            }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      return floorStats;
    } catch (error) {
      console.error('Error getting floor statistics:', error);
      throw error;
    }
  }

  /**
   * Get room status distribution for dashboard
   */
  public static async getRoomStatusDistribution(hotelId: string) {
    try {
      const distribution = await Room.aggregate([
        {
          $match: { hotelId: new Types.ObjectId(hotelId) }
        },
        {
          $group: {
            _id: "$roomStatus",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      return distribution;
    } catch (error) {
      console.error('Error getting room status distribution:', error);
      throw error;
    }
  }

  /**
   * Get room availability for date range
   * Optimized for booking systems with millions of stays
   */
  public static async getRoomAvailability(
    hotelId: string,
    startDate: Date,
    endDate: Date
  ) {
    try {
      const availableRooms = await Room.aggregate([
        {
          $match: {
            hotelId: new Types.ObjectId(hotelId),
            roomStatus: "available"
          }
        },
        {
          $lookup: {
            from: "stays", // Assuming stays collection name
            let: { roomId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$roomId", "$$roomId"] },
                      { $gte: ["$checkOutDate", startDate] },
                      { $lte: ["$checkInDate", endDate] },
                      { $in: ["$status", ["confirmed", "checked_in"]] }
                    ]
                  }
                }
              }
            ],
            as: "conflictingStays"
          }
        },
        {
          $match: {
            "conflictingStays": { $size: 0 }
          }
        },
        {
          $project: {
            _id: 1,
            roomNumber: 1,
            floor: 1,
            roomTypeId: 1
          }
        }
      ]);

      return availableRooms;
    } catch (error) {
      console.error('Error getting room availability:', error);
      throw error;
    }
  }

  /**
   * Get room counts for lightweight stats
   */
  public static async getRoomCounts(hotelId: string) {
    try {
      const counts = await Room.aggregate([
        {
          $match: { hotelId: new Types.ObjectId(hotelId) }
        },
        {
          $group: {
            _id: "$roomStatus",
            count: { $sum: 1 }
          }
        }
      ]);

      // Transform array into object for easier access
      const result = {
        total: 0,
        available: 0,
        occupied: 0,
        maintenance: 0,
        cleaning: 0,
        out_of_order: 0
      };

      counts.forEach(item => {
        result.total += item.count;
        if (item._id in result) {
          result[item._id as keyof typeof result] = item.count;
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting room counts:', error);
      throw error;
    }
  }
}

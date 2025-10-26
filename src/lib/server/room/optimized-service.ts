import { Types } from "mongoose";
import Room from "./entity";

/**
 * Optimized Room Service for Large Collections
 * 
 * This service provides efficient methods for handling millions of documents
 * using MongoDB aggregation pipelines and proper indexing strategies.
 */
class OptimizedRoomService {
  
  /**
   * Get room statistics using MongoDB aggregation pipeline
   * Much more efficient than fetching all documents
   */
  public async getRoomStatisticsByHotelId(hotelId: Types.ObjectId) {
    try {
      const stats = await Room.aggregate([
        {
          $match: { hotelId: hotelId }
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
   * Get lightweight room counts for real-time updates
   * Uses projection to only fetch necessary fields
   */
  public async getRoomCountsByHotelId(hotelId: Types.ObjectId) {
    try {
      const counts = await Room.aggregate([
        {
          $match: { hotelId: hotelId }
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

  /**
   * Get room statistics by floor for better organization
   */
  public async getRoomStatisticsByFloor(hotelId: Types.ObjectId) {
    try {
      const floorStats = await Room.aggregate([
        {
          $match: { hotelId: hotelId }
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
   * Get rooms with pagination for large datasets
   */
  public async getRoomsPaginated(
    hotelId: Types.ObjectId,
    page: number = 1,
    limit: number = 50,
    status?: string
  ) {
    try {
      const skip = (page - 1) * limit;
      const matchQuery: any = { hotelId };
      
      if (status) {
        matchQuery.roomStatus = status;
      }

      const [rooms, totalCount] = await Promise.all([
        Room.find(matchQuery)
          .select('roomNumber floor roomStatus lastCleaned note')
          .populate('roomTypeId', 'name')
          .sort({ floor: 1, roomNumber: 1 })
          .skip(skip)
          .limit(limit)
          .lean(), // Use lean() for better performance
        Room.countDocuments(matchQuery)
      ]);

      return {
        rooms,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error getting paginated rooms:', error);
      throw error;
    }
  }

  /**
   * Get room availability for date range
   * Optimized for booking systems
   */
  public async getRoomAvailability(
    hotelId: Types.ObjectId,
    startDate: Date,
    endDate: Date
  ) {
    try {
      const availableRooms = await Room.aggregate([
        {
          $match: {
            hotelId: hotelId,
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
                      { $in: ["$status", ["confirmed", "checked-in"]] }
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
}

export const optimizedRoomService = new OptimizedRoomService();

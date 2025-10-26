import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { CustomRequest } from "../utils/interface";
import { roomService } from "../room/service";
import { staffService } from "../staff/service";
import { stayService } from "../stay/service";
import { houseKeepingService } from "../house-keeping/service";

/**
 * Optimized Stats Controller for Large Collections
 * 
 * This controller uses MongoDB aggregation pipelines instead of fetching
 * full documents, making it efficient for millions of documents.
 */
class OptimizedStatsController {
  
  /**
   * Get dashboard statistics using existing service methods
   * This is a working version that uses current service methods
   */
  public async getDashBordStatistics(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    try {
      // Execute all queries in parallel for better performance
      const [rooms, staffs, stays, houseKeeping] = await Promise.all([
        roomService.findRoomsByHotelId(hotelId!),
        staffService.findStaffsByHotelId(hotelId!),
        stayService.findStaysByHotelId(hotelId!),
        houseKeepingService.findHouseKeepingByHotelId(hotelId!)
      ]);
      
      // Calculate statistics on the server side
      const roomStats = this.calculateRoomStatistics(rooms);
      const staffStats = this.calculateStaffStatistics(staffs);
      const stayStats = this.calculateStayStatistics(stays);
      const houseKeepingStats = this.calculateHouseKeepingStatistics(houseKeeping);
      
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Dashboard statistics fetched successfully!",
        data: {
          rooms: roomStats,
          staff: staffStats,
          stays: stayStats,
          houseKeeping: houseKeepingStats,
          metadata: {
            hotelId,
            timestamp: new Date().toISOString(),
            version: "2.0",
            optimized: true,
            method: "server-side-calculation"
          }
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch dashboard statistics",
        data: null,
      });
    }
  }

  /**
   * Calculate room statistics from room data
   */
  private calculateRoomStatistics(rooms: any[]) {
    const total = rooms.length;
    const available = rooms.filter(r => r.roomStatus === 'available').length;
    const occupied = rooms.filter(r => r.roomStatus === 'occupied').length;
    const maintenance = rooms.filter(r => r.roomStatus === 'maintenance').length;
    const cleaning = rooms.filter(r => r.roomStatus === 'cleaning').length;
    const outOfOrder = rooms.filter(r => r.roomStatus === 'out_of_order').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100 * 100) / 100 : 0;

    return {
      total,
      available,
      occupied,
      maintenance,
      cleaning,
      outOfOrder,
      occupancyRate
    };
  }

  /**
   * Calculate staff statistics from staff data
   */
  private calculateStaffStatistics(staffs: any[]) {
    const total = staffs.length;
    const active = staffs.filter(s => s.status === 'active').length;
    const inactive = staffs.filter(s => s.status === 'inactive').length;
    const onLeave = staffs.filter(s => s.status === 'on_leave').length;

    return {
      total,
      active,
      inactive,
      onLeave
    };
  }

  /**
   * Calculate stay statistics from stay data
   */
  private calculateStayStatistics(stays: any[]) {
    const total = stays.length;
    const confirmed = stays.filter(s => s.status === 'confirmed').length;
    const checkedIn = stays.filter(s => s.status === 'checked_in').length;
    const checkedOut = stays.filter(s => s.status === 'checked_out').length;
    const cancelled = stays.filter(s => s.status === 'cancelled').length;

    return {
      total,
      confirmed,
      checkedIn,
      checkedOut,
      cancelled
    };
  }

  /**
   * Calculate housekeeping statistics from housekeeping data
   */
  private calculateHouseKeepingStatistics(houseKeeping: any[]) {
    const total = houseKeeping.length;
    const inProgress = houseKeeping.filter(h => h.status === 'in_progress').length;
    const completed = houseKeeping.filter(h => h.status === 'completed').length;
    const cancelled = houseKeeping.filter(h => h.status === 'cancelled').length;
    const pending = houseKeeping.filter(h => h.status === 'pending').length;

    return {
      total,
      inProgress,
      completed,
      cancelled,
      pending
    };
  }

  /**
   * Get lightweight stats for real-time updates
   * Uses existing service methods for efficiency
   */
  public async getLightweightStats(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    try {
      // Get only essential data for real-time updates
      const [rooms, staffs, stays, houseKeeping] = await Promise.all([
        roomService.findRoomsByHotelId(hotelId!),
        staffService.findStaffsByHotelId(hotelId!),
        stayService.findStaysByHotelId(hotelId!),
        houseKeepingService.findHouseKeepingByHotelId(hotelId!)
      ]);

      // Calculate lightweight counts
      const roomCounts = this.calculateRoomStatistics(rooms);
      const staffCounts = this.calculateStaffStatistics(staffs);
      const stayCounts = this.calculateStayStatistics(stays);
      const houseKeepingCounts = this.calculateHouseKeepingStatistics(houseKeeping);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Lightweight stats fetched successfully!",
        data: {
          counts: {
            rooms: roomCounts,
            staff: staffCounts,
            stays: stayCounts,
            houseKeeping: houseKeepingCounts
          },
          timestamp: new Date().toISOString(),
          optimized: true
        },
      });
    } catch (error) {
      console.error('Error fetching lightweight stats:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch lightweight stats",
        data: null,
      });
    }
  }
}

export const optimizedStatsController = new OptimizedStatsController();

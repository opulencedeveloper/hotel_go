import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { roomService } from "../room/service";
import { staffService } from "../staff/service";
import { stayService } from "../stay/service";
import { houseKeepingService } from "../house-keeping/service";

class StatsController {
  public async getDashBordStatistics(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    try {
      // Execute all queries in parallel for better performance
      // This is still much better than sequential execution
      const [rooms, staffs, stays, houseKeeping] = await Promise.all([
        roomService.findRoomsByHotelId(hotelId!),
        staffService.findStaffsByHotelId(hotelId!),
        stayService.findStaysByHotelId(hotelId!),
        houseKeepingService.findHouseKeepingByHotelId(hotelId!)
      ]);
      
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Dashboard statistics fetched successfully!",
        data: {
          rooms,
          staffs,
          stays,
          houseKeeping,
          metadata: {
            hotelId,
            timestamp: new Date().toISOString(),
            version: "1.1",
            optimized: true,
            note: "For large collections, implement aggregation pipelines for better performance"
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

  // Add a lightweight stats endpoint for real-time updates
  public async getLightweightStats(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    try {
      // Get only essential counts for real-time dashboard updates
      const [rooms, staffs, stays, houseKeeping] = await Promise.all([
        roomService.findRoomsByHotelId(hotelId!),
        staffService.findStaffsByHotelId(hotelId!),
        stayService.findStaysByHotelId(hotelId!),
        houseKeepingService.findHouseKeepingByHotelId(hotelId!)
      ]);

      // Calculate counts on the server side to reduce client processing
      const roomCounts = {
        total: rooms.length,
        available: rooms.filter(r => r.roomStatus === 'available').length,
        occupied: rooms.filter(r => r.roomStatus === 'occupied').length,
        maintenance: rooms.filter(r => r.roomStatus === 'maintenance').length
      };

      const staffCounts = {
        total: staffs.length,
        active: staffs.filter(s => s.status === 'active').length,
        inactive: staffs.filter(s => s.status === 'inactive').length
      };

      const stayCounts = {
        total: stays.length,
        confirmed: stays.filter(s => s.status === 'confirmed').length,
        checkedIn: stays.filter(s => s.status === 'checked_in').length,
        checkedOut: stays.filter(s => s.status === 'checked_out').length
      };

      const houseKeepingCounts = {
        total: houseKeeping.length,
        inProgress: houseKeeping.filter(h => h.status === 'in_progress').length,
        completed: houseKeeping.filter(h => h.status === 'completed').length,
        cancelled: houseKeeping.filter(h => h.status === 'cancelled').length
      };

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
          timestamp: new Date().toISOString()
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

export const statsController = new StatsController();

import { Types } from "mongoose";
import Room from "../room/entity";
import Stay from "../stay/entity";
import { Order } from "../order/entity";
import ScheduledService from "../scheduleService/entity";
import "../roomType/entity";
import "../menu/entity";
import "../hotelService/entity";


class AnayticsService {
  /**
   * Get start date based on period selection
   * Efficiently calculates the date range for filtering
   */
  private getDateRange(period: string = '30d'): Date | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(today);
    
    switch (period) {
      case '1d':
        // Last 24 hours
        startDate.setHours(startDate.getHours() - 24);
        return startDate;
      case '7d':
        // Last 7 days
        startDate.setDate(startDate.getDate() - 7);
        return startDate;
      case '30d':
        // Last 30 days
        startDate.setDate(startDate.getDate() - 30);
        return startDate;
      case '90d':
        // Last 90 days (3 months)
        startDate.setDate(startDate.getDate() - 90);
        return startDate;
      case '1y':
        // Last year
        startDate.setFullYear(startDate.getFullYear() - 1);
        return startDate;
      default:
        // Default to last 30 days
        startDate.setDate(startDate.getDate() - 30);
        return startDate;
    }
  }

  /**
   * Find rooms by hotel ID with optional date range filtering
   * Uses indexed queries for efficient filtering
   * 
   * Note: For analytics, we typically want all rooms regardless of period,
   * but period parameter is kept for consistency with other methods
   */
  public async findRoomsByHotelId(hotelId: Types.ObjectId, period: string = '30d') {
    /**
     * Note: Rooms are persistent entities, not time-bound like stays/orders
     * Room status (available/occupied) is current state, not historical
     * We want ALL rooms for accurate occupancy calculations
     */
    const query: any = { hotelId };
    
    // We typically don't filter rooms by date because:
    // 1. Room list changes rarely (new rooms added infrequently)
    // 2. Occupancy rates are current metrics, not historical
    // 3. Analytics needs TOTAL rooms to calculate percentages correctly
    // 
    // If you need historical room counts by creation date, uncomment:
    // const dateRange = this.getDateRange(period);
    // if (dateRange) {
    //   query.createdAt = { $gte: dateRange };
    // }
    
    const rooms = await Room.find(query)
      .select("roomNumber floor roomTypeId roomStatus lastCleaned hotelId note createdAt updatedAt") // Select only needed fields
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: "hotelId",
        select: "hotelName", // only the fields you need
      })
      .populate({
        path: "roomTypeId",
        select: "name", // fields from RoomType
      })
      .limit(10000) // Prevent extremely large result sets
      .lean(); // Return plain objects for better performance
  
    return rooms;
  }

  /**
   * Find stays by hotel ID with date range filtering
   * Uses indexed queries for efficient filtering
   */
  public async findStaysByHotelId(hotelId: Types.ObjectId, period: string = '30d') {
    const dateRange = this.getDateRange(period);
    
    // Build query with date filtering for efficient database queries
    const query: any = { hotelId };
    
    if (dateRange) {
      // Use indexed createdAt field for efficient filtering
      query.createdAt = { $gte: dateRange };
    }
    
    // Adjust limit based on period to prevent performance issues
    const limit = period === '1y' ? 5000 : 10000; // Lower limit for year view
    
    const stays = await Stay.find(query)
      .select("guestName phoneNumber emailAddress address checkInDate checkOutDate adults children status type totalAmount paidAmount discount serviceCharge tax paymentStatus paymentMethod createdAt updatedAt") // Select all fields used in analytics
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: "roomId",        
        select: "roomNumber roomTypeId",
      })
      .limit(limit) // Prevent extremely large result sets
      .lean() // Return plain objects for better performance
      .hint({ hotelId: 1, createdAt: -1 }); // Force use of optimal index
  
    return stays;
  }

  /**
   * Find orders by hotel ID with date range filtering
   * Uses indexed queries for efficient filtering
   */
  public async findOrdersByHotelId(hotelId: Types.ObjectId, period: string = '30d') {
    const dateRange = this.getDateRange(period);
    
    // Build query with date filtering for efficient database queries
    const query: any = { hotelId };
    
    if (dateRange) {
      // Use indexed createdAt field for efficient filtering
      query.createdAt = { $gte: dateRange };
    }
    
    // Adjust limit based on period to prevent performance issues
    const limit = period === '1y' ? 5000 : 10000; // Lower limit for year view
    
    const orders = await Order.find(query)
      .select("items roomId orderType tableNumber status paymentMethod discount tax createdAt updatedAt") // Select only needed fields
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: "items.menuId", // populate menuId inside items array
        select: "itemName category ingredients", // select fields you need
      })
      .limit(limit) // Prevent extremely large result sets
      .lean() // Return plain objects for better performance
      .hint({ hotelId: 1, createdAt: -1 }) // Force use of optimal index
      .exec();

    return orders;
  }

  /**
   * Find scheduled services by hotel ID with date range filtering
   * Uses indexed queries for efficient filtering
   */
  public async findScheduledServicesByHotelId(hotelId: Types.ObjectId, period: string = '30d') {
    const dateRange = this.getDateRange(period);
    
    // Build query with date filtering for efficient database queries
    const query: any = { hotelId: new Types.ObjectId(hotelId) };
    
    if (dateRange) {
      // Use indexed createdAt or scheduledAt field for efficient filtering
      query.$or = [
        { createdAt: { $gte: dateRange } },
        { scheduledAt: { $gte: dateRange } }
      ];
    }
    
    // Adjust limit based on period to prevent performance issues
    const limit = period === '1y' ? 5000 : 10000; // Lower limit for year view
    
    const scheduledServices = await ScheduledService.find(query)
      .select("hotelServiceId hotelId paymentMethod paymentStatus totalAmount scheduledAt note createdAt updatedAt") // Select only needed fields
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: "hotelServiceId",
        select: "name category location capacity price description status", // Select service fields
      })
      .limit(limit) // Prevent extremely large result sets
      .lean() // Return plain objects for better performance
      .exec();

    return scheduledServices;
  }
}

export const anayticsService = new AnayticsService();

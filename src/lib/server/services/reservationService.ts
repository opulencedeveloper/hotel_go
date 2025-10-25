import Reservation, { IReservation } from "../entities/reservation";
import { connectDB } from "../utils/db";

export class ReservationService {
  // Generate unique reservation number
  private static generateReservationNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `RES-${timestamp}-${random}`;
  }

  // Create a new reservation
  static async createReservation(reservationData: Partial<IReservation>): Promise<IReservation> {
    await connectDB();
    
    const reservation = new Reservation({
      ...reservationData,
      reservationNumber: this.generateReservationNumber(),
      balance: reservationData.totalAmount! - (reservationData.paidAmount || 0)
    });
    
    return await reservation.save();
  }

  // Get all reservations for a hotel
  static async getReservationsByHotel(hotelId: string, filters?: {
    status?: string;
    paymentStatus?: string;
    checkIn?: Date;
    checkOut?: Date;
    guestId?: string;
  }): Promise<IReservation[]> {
    await connectDB();
    
    const query: any = { hotelId, isActive: true };
    
    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }
    if (filters?.checkIn) {
      query.checkIn = { $gte: filters.checkIn };
    }
    if (filters?.checkOut) {
      query.checkOut = { $lte: filters.checkOut };
    }
    if (filters?.guestId) {
      query.guestId = filters.guestId;
    }
    
    return await Reservation.find(query)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber roomType floor')
      .sort({ createdAt: -1 });
  }

  // Get reservation by ID
  static async getReservationById(reservationId: string): Promise<IReservation | null> {
    await connectDB();
    
    return await Reservation.findOne({ _id: reservationId, isActive: true })
      .populate('guestId', 'firstName lastName email phone nationality')
      .populate('roomId', 'roomNumber roomType floor pricePerNight')
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');
  }

  // Get reservation by reservation number
  static async getReservationByNumber(reservationNumber: string): Promise<IReservation | null> {
    await connectDB();
    
    return await Reservation.findOne({ reservationNumber, isActive: true })
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber roomType floor');
  }

  // Update reservation
  static async updateReservation(
    reservationId: string, 
    updateData: Partial<IReservation>,
    updatedBy: string
  ): Promise<IReservation | null> {
    await connectDB();
    
    // Recalculate balance if totalAmount or paidAmount is updated
    if (updateData.totalAmount !== undefined || updateData.paidAmount !== undefined) {
      const currentReservation = await Reservation.findById(reservationId);
      if (currentReservation) {
        const totalAmount = updateData.totalAmount || currentReservation.totalAmount;
        const paidAmount = updateData.paidAmount || currentReservation.paidAmount;
        updateData.balance = totalAmount - paidAmount;
      }
    }
    
    return await Reservation.findOneAndUpdate(
      { _id: reservationId, isActive: true },
      { 
        ...updateData, 
        updatedBy,
        updatedAt: new Date() 
      },
      { new: true }
    ).populate('guestId', 'firstName lastName email phone')
     .populate('roomId', 'roomNumber roomType floor');
  }

  // Delete reservation (soft delete)
  static async deleteReservation(reservationId: string): Promise<boolean> {
    await connectDB();
    
    const result = await Reservation.findOneAndUpdate(
      { _id: reservationId, isActive: true },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    return !!result;
  }

  // Check in guest
  static async checkIn(reservationId: string, checkedInBy: string): Promise<IReservation | null> {
    await connectDB();
    
    return await Reservation.findOneAndUpdate(
      { _id: reservationId, isActive: true, status: 'confirmed' },
      { 
        status: 'checked-in',
        checkedInAt: new Date(),
        updatedBy: checkedInBy,
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  // Check out guest
  static async checkOut(reservationId: string, checkedOutBy: string): Promise<IReservation | null> {
    await connectDB();
    
    return await Reservation.findOneAndUpdate(
      { _id: reservationId, isActive: true, status: 'checked-in' },
      { 
        status: 'checked-out',
        checkedOutAt: new Date(),
        updatedBy: checkedOutBy,
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  // Cancel reservation
  static async cancelReservation(
    reservationId: string, 
    cancellationReason: string,
    cancelledBy: string
  ): Promise<IReservation | null> {
    await connectDB();
    
    return await Reservation.findOneAndUpdate(
      { _id: reservationId, isActive: true, status: { $in: ['confirmed', 'checked-in'] } },
      { 
        status: 'cancelled',
        cancellationReason,
        cancelledAt: new Date(),
        cancelledBy,
        updatedBy: cancelledBy,
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  // Get today's arrivals
  static async getTodaysArrivals(hotelId: string): Promise<IReservation[]> {
    await connectDB();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await Reservation.find({
      hotelId,
      isActive: true,
      status: 'confirmed',
      checkIn: { $gte: today, $lt: tomorrow }
    })
    .populate('guestId', 'firstName lastName email phone')
    .populate('roomId', 'roomNumber roomType floor')
    .sort({ checkIn: 1 });
  }

  // Get today's departures
  static async getTodaysDepartures(hotelId: string): Promise<IReservation[]> {
    await connectDB();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await Reservation.find({
      hotelId,
      isActive: true,
      status: { $in: ['confirmed', 'checked-in'] },
      checkOut: { $gte: today, $lt: tomorrow }
    })
    .populate('guestId', 'firstName lastName email phone')
    .populate('roomId', 'roomNumber roomType floor')
    .sort({ checkOut: 1 });
  }

  // Get reservation statistics
  static async getReservationStatistics(hotelId: string, dateRange?: {
    startDate: Date;
    endDate: Date;
  }): Promise<{
    total: number;
    confirmed: number;
    checkedIn: number;
    checkedOut: number;
    cancelled: number;
    noShow: number;
    totalRevenue: number;
    averageStayDuration: number;
  }> {
    await connectDB();
    
    const matchQuery: any = { hotelId, isActive: true };
    if (dateRange) {
      matchQuery.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
    }
    
    const stats = await Reservation.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const result = {
      total: 0,
      confirmed: 0,
      checkedIn: 0,
      checkedOut: 0,
      cancelled: 0,
      noShow: 0,
      totalRevenue: 0,
      averageStayDuration: 0
    };
    
    stats.forEach(stat => {
      result.total += stat.count;
      result[stat._id as keyof typeof result] = stat.count;
      result.totalRevenue += stat.totalRevenue;
    });
    
    // Calculate average stay duration
    const stayDurations = await Reservation.aggregate([
      { $match: matchQuery },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$checkOut', '$checkIn'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageDuration: { $avg: '$duration' }
        }
      }
    ]);
    
    if (stayDurations.length > 0) {
      result.averageStayDuration = Math.round(stayDurations[0].averageDuration * 10) / 10;
    }
    
    return result;
  }
}














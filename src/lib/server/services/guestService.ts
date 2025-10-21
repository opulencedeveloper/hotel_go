import Guest, { IGuest } from "../entities/guest";
import { connectDB } from "../utils/db";

export class GuestService {
  // Create a new guest
  static async createGuest(guestData: Partial<IGuest>): Promise<IGuest> {
    await connectDB();
    
    const guest = new Guest(guestData);
    return await guest.save();
  }

  // Get all guests for a hotel
  static async getGuestsByHotel(hotelId: string, filters?: {
    isVip?: boolean;
    nationality?: string;
    search?: string;
  }): Promise<IGuest[]> {
    await connectDB();
    
    const query: any = { hotelId, isActive: true };
    
    if (filters?.isVip !== undefined) {
      query.isVip = filters.isVip;
    }
    if (filters?.nationality) {
      query.nationality = filters.nationality;
    }
    if (filters?.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    return await Guest.find(query).sort({ createdAt: -1 });
  }

  // Get guest by ID
  static async getGuestById(guestId: string): Promise<IGuest | null> {
    await connectDB();
    return await Guest.findOne({ _id: guestId, isActive: true });
  }

  // Get guest by email
  static async getGuestByEmail(email: string, hotelId: string): Promise<IGuest | null> {
    await connectDB();
    return await Guest.findOne({ email, hotelId, isActive: true });
  }

  // Update guest
  static async updateGuest(guestId: string, updateData: Partial<IGuest>): Promise<IGuest | null> {
    await connectDB();
    
    return await Guest.findOneAndUpdate(
      { _id: guestId, isActive: true },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  // Delete guest (soft delete)
  static async deleteGuest(guestId: string): Promise<boolean> {
    await connectDB();
    
    const result = await Guest.findOneAndUpdate(
      { _id: guestId, isActive: true },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    return !!result;
  }

  // Update guest loyalty points
  static async updateLoyaltyPoints(guestId: string, points: number): Promise<IGuest | null> {
    await connectDB();
    
    return await Guest.findOneAndUpdate(
      { _id: guestId, isActive: true },
      { 
        $inc: { loyaltyPoints: points },
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  // Update guest stay information
  static async updateStayInfo(guestId: string, stayData: {
    totalStays?: number;
    lastStayDate?: Date;
    isVip?: boolean;
  }): Promise<IGuest | null> {
    await connectDB();
    
    return await Guest.findOneAndUpdate(
      { _id: guestId, isActive: true },
      { 
        ...stayData,
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  // Get VIP guests
  static async getVipGuests(hotelId: string): Promise<IGuest[]> {
    await connectDB();
    
    return await Guest.find({ 
      hotelId, 
      isActive: true, 
      isVip: true 
    }).sort({ loyaltyPoints: -1 });
  }

  // Get guest statistics
  static async getGuestStatistics(hotelId: string): Promise<{
    total: number;
    vip: number;
    newThisMonth: number;
    topNationalities: Array<{ nationality: string; count: number }>;
  }> {
    await connectDB();
    
    const [total, vip, newThisMonth, nationalities] = await Promise.all([
      Guest.countDocuments({ hotelId, isActive: true }),
      Guest.countDocuments({ hotelId, isActive: true, isVip: true }),
      Guest.countDocuments({ 
        hotelId, 
        isActive: true,
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      Guest.aggregate([
        { $match: { hotelId, isActive: true } },
        { $group: { _id: '$nationality', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);
    
    return {
      total,
      vip,
      newThisMonth,
      topNationalities: nationalities.map(n => ({
        nationality: n._id,
        count: n.count
      }))
    };
  }

  // Search guests
  static async searchGuests(hotelId: string, searchTerm: string): Promise<IGuest[]> {
    await connectDB();
    
    return await Guest.find({
      hotelId,
      isActive: true,
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
        { idNumber: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(20);
  }
}







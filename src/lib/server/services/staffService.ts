import Staff, { IStaff } from "../entities/staff";
import { connectDB } from "../utils/db";

export class StaffService {
  // Create a new staff member
  static async createStaff(staffData: Partial<IStaff>): Promise<IStaff> {
    await connectDB();
    
    const staff = new Staff(staffData);
    return await staff.save();
  }

  // Get all staff for a hotel
  static async getStaffByHotel(hotelId: string, filters?: {
    department?: string;
    status?: string;
    role?: string;
    search?: string;
  }): Promise<IStaff[]> {
    await connectDB();
    
    const query: any = { hotelId, isActive: true };
    
    if (filters?.department) {
      query.department = filters.department;
    }
    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.role) {
      query.role = filters.role;
    }
    if (filters?.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { position: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    return await Staff.find(query).sort({ department: 1, position: 1 });
  }

  // Get staff by ID
  static async getStaffById(staffId: string): Promise<IStaff | null> {
    await connectDB();
    return await Staff.findOne({ _id: staffId, isActive: true });
  }

  // Get staff by employee ID
  static async getStaffByEmployeeId(employeeId: string, hotelId: string): Promise<IStaff | null> {
    await connectDB();
    return await Staff.findOne({ employeeId, hotelId, isActive: true });
  }

  // Get staff by email
  static async getStaffByEmail(email: string, hotelId: string): Promise<IStaff | null> {
    await connectDB();
    return await Staff.findOne({ email, hotelId, isActive: true });
  }

  // Update staff
  static async updateStaff(staffId: string, updateData: Partial<IStaff>): Promise<IStaff | null> {
    await connectDB();
    
    return await Staff.findOneAndUpdate(
      { _id: staffId, isActive: true },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  // Delete staff (soft delete)
  static async deleteStaff(staffId: string): Promise<boolean> {
    await connectDB();
    
    const result = await Staff.findOneAndUpdate(
      { _id: staffId, isActive: true },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    return !!result;
  }

  // Update staff status
  static async updateStaffStatus(staffId: string, status: IStaff['status']): Promise<IStaff | null> {
    await connectDB();
    
    return await Staff.findOneAndUpdate(
      { _id: staffId, isActive: true },
      { status, updatedAt: new Date() },
      { new: true }
    );
  }

  // Update performance rating
  static async updatePerformanceRating(staffId: string, rating: number): Promise<IStaff | null> {
    await connectDB();
    
    if (rating < 1 || rating > 5) {
      throw new Error('Performance rating must be between 1 and 5');
    }
    
    return await Staff.findOneAndUpdate(
      { _id: staffId, isActive: true },
      { performanceRating: rating, updatedAt: new Date() },
      { new: true }
    );
  }

  // Get staff by department
  static async getStaffByDepartment(hotelId: string, department: string): Promise<IStaff[]> {
    await connectDB();
    
    return await Staff.find({ 
      hotelId, 
      isActive: true, 
      department,
      status: 'active'
    }).sort({ position: 1 });
  }

  // Get staff by shift
  static async getStaffByShift(hotelId: string, shift: string): Promise<IStaff[]> {
    await connectDB();
    
    return await Staff.find({ 
      hotelId, 
      isActive: true, 
      shift,
      status: 'active'
    }).sort({ department: 1, position: 1 });
  }

  // Get top performers
  static async getTopPerformers(hotelId: string, limit: number = 10): Promise<IStaff[]> {
    await connectDB();
    
    return await Staff.find({ 
      hotelId, 
      isActive: true, 
      status: 'active',
      performanceRating: { $exists: true }
    })
    .sort({ performanceRating: -1 })
    .limit(limit);
  }

  // Get staff statistics
  static async getStaffStatistics(hotelId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    terminated: number;
    onLeave: number;
    byDepartment: Array<{ department: string; count: number }>;
    byRole: Array<{ role: string; count: number }>;
    averageRating: number;
  }> {
    await connectDB();
    
    const [total, statusStats, departmentStats, roleStats, ratingStats] = await Promise.all([
      Staff.countDocuments({ hotelId, isActive: true }),
      Staff.aggregate([
        { $match: { hotelId, isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Staff.aggregate([
        { $match: { hotelId, isActive: true } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Staff.aggregate([
        { $match: { hotelId, isActive: true } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Staff.aggregate([
        { $match: { hotelId, isActive: true, performanceRating: { $exists: true } } },
        { $group: { _id: null, averageRating: { $avg: '$performanceRating' } } }
      ])
    ]);
    
    const result = {
      total,
      active: 0,
      inactive: 0,
      terminated: 0,
      onLeave: 0,
      byDepartment: departmentStats.map(d => ({ department: d._id, count: d.count })),
      byRole: roleStats.map(r => ({ role: r._id, count: r.count })),
      averageRating: 0
    };
    
    statusStats.forEach(stat => {
      result[stat._id as keyof typeof result] = stat.count;
    });
    
    if (ratingStats.length > 0) {
      result.averageRating = Math.round(ratingStats[0].averageRating * 10) / 10;
    }
    
    return result;
  }

  // Search staff
  static async searchStaff(hotelId: string, searchTerm: string): Promise<IStaff[]> {
    await connectDB();
    
    return await Staff.find({
      hotelId,
      isActive: true,
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { position: { $regex: searchTerm, $options: 'i' } },
        { employeeId: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(20);
  }

  // Get staff with login access
  static async getStaffWithLoginAccess(hotelId: string): Promise<IStaff[]> {
    await connectDB();
    
    return await Staff.find({ 
      hotelId, 
      isActive: true, 
      userId: { $exists: true, $ne: null }
    }).populate('userId', 'firstName lastName email userRole');
  }
}







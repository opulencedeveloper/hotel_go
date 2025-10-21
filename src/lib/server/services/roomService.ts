import Room, { IRoom } from "../entities/room";
import { connectDB } from "../utils/db";

export class RoomService {
  // Create a new room
  static async createRoom(roomData: Partial<IRoom>): Promise<IRoom> {
    await connectDB();
    
    const room = new Room(roomData);
    return await room.save();
  }

  // Get all rooms for a hotel
  static async getRoomsByHotel(hotelId: string, filters?: {
    status?: string;
    roomType?: string;
    floor?: number;
  }): Promise<IRoom[]> {
    await connectDB();
    
    const query: any = { hotelId, isActive: true };
    
    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.roomType) {
      query.roomType = filters.roomType;
    }
    if (filters?.floor) {
      query.floor = filters.floor;
    }
    
    return await Room.find(query).sort({ floor: 1, roomNumber: 1 });
  }

  // Get room by ID
  static async getRoomById(roomId: string): Promise<IRoom | null> {
    await connectDB();
    return await Room.findOne({ _id: roomId, isActive: true });
  }

  // Update room
  static async updateRoom(roomId: string, updateData: Partial<IRoom>): Promise<IRoom | null> {
    await connectDB();
    
    return await Room.findOneAndUpdate(
      { _id: roomId, isActive: true },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  // Delete room (soft delete)
  static async deleteRoom(roomId: string): Promise<boolean> {
    await connectDB();
    
    const result = await Room.findOneAndUpdate(
      { _id: roomId, isActive: true },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    return !!result;
  }

  // Get available rooms for a date range
  static async getAvailableRooms(
    hotelId: string, 
    checkIn: Date, 
    checkOut: Date,
    roomType?: string
  ): Promise<IRoom[]> {
    await connectDB();
    
    // Find rooms that are not occupied during the requested period
    const query: any = {
      hotelId,
      isActive: true,
      status: 'available'
    };
    
    if (roomType) {
      query.roomType = roomType;
    }
    
    // Get all rooms that match the criteria
    const allRooms = await Room.find(query);
    
    // Filter out rooms that have conflicting reservations
    const availableRooms = [];
    
    for (const room of allRooms) {
      const conflictingReservations = await Room.aggregate([
        {
          $lookup: {
            from: 'reservations',
            localField: '_id',
            foreignField: 'roomId',
            as: 'reservations'
          }
        },
        {
          $match: {
            _id: room._id,
            'reservations.status': { $in: ['confirmed', 'checked-in'] },
            'reservations.checkIn': { $lt: checkOut },
            'reservations.checkOut': { $gt: checkIn }
          }
        }
      ]);
      
      if (conflictingReservations.length === 0) {
        availableRooms.push(room);
      }
    }
    
    return availableRooms;
  }

  // Update room status
  static async updateRoomStatus(roomId: string, status: IRoom['status']): Promise<IRoom | null> {
    await connectDB();
    
    return await Room.findOneAndUpdate(
      { _id: roomId, isActive: true },
      { status, updatedAt: new Date() },
      { new: true }
    );
  }

  // Get room statistics
  static async getRoomStatistics(hotelId: string): Promise<{
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    cleaning: number;
    outOfOrder: number;
  }> {
    await connectDB();
    
    const stats = await Room.aggregate([
      { $match: { hotelId, isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = {
      total: 0,
      available: 0,
      occupied: 0,
      maintenance: 0,
      cleaning: 0,
      outOfOrder: 0
    };
    
    stats.forEach(stat => {
      result.total += stat.count;
      result[stat._id as keyof typeof result] = stat.count;
    });
    
    return result;
  }
}







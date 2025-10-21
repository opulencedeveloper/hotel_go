import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/utils/db";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { RoomService } from "@/lib/server/services/roomService";

async function GET(request: NextRequest) {
  await connectDB();
  
  try {
    // Get hotel ID from headers (set by middleware)
    const hotelId = request.headers.get('x-hotel-id');
    if (!hotelId || hotelId === '') {
      // For now, return empty array if no hotel ID
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "No hotel ID provided, returning empty rooms list",
        data: []
      });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const roomType = searchParams.get('roomType');
    const floor = searchParams.get('floor');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    
    let rooms;
    
    // If check-in and check-out dates are provided, get available rooms
    if (checkIn && checkOut) {
      rooms = await RoomService.getAvailableRooms(
        hotelId,
        new Date(checkIn),
        new Date(checkOut),
        roomType || undefined
      );
    } else {
      // Build filters object for regular room listing
      const filters: any = {};
      if (status) filters.status = status;
      if (roomType) filters.roomType = roomType;
      if (floor) filters.floor = parseInt(floor);
      
      // Get rooms from database
      rooms = await RoomService.getRoomsByHotel(hotelId, filters);
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Rooms retrieved successfully",
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to retrieve rooms",
      data: null
    });
  }
}

async function POST(request: NextRequest) {
  await connectDB();
  
  try {
    // Get hotel ID from headers (set by middleware)
    const hotelId = request.headers.get('x-hotel-id');
    
    if (!hotelId) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Hotel ID is required",
        data: null
      });
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['roomNumber', 'roomType', 'floor', 'pricePerNight', 'maxOccupancy'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: `${field} is required`,
          data: null
        });
      }
    }
    
    // Create room data
    const roomData = {
      ...body,
      hotelId,
      status: body.status || 'available',
      amenities: body.amenities || [],
      images: body.images || []
    };
    
    // Create room in database
    const newRoom = await RoomService.createRoom(roomData);
    
    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Room created successfully",
      data: newRoom
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to create room",
      data: null
    });
  }
}

export { GET, POST };
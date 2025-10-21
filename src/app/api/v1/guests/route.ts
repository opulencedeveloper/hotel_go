import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/utils/db";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { GuestService } from "@/lib/server/services/guestService";

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
        description: "No hotel ID provided, returning empty guests list",
        data: []
      });
    }
    
    const { searchParams } = new URL(request.url);
    const isVip = searchParams.get('isVip');
    const nationality = searchParams.get('nationality');
    const search = searchParams.get('search');
    
    // Build filters object
    const filters: any = {};
    if (isVip !== null) filters.isVip = isVip === 'true';
    if (nationality) filters.nationality = nationality;
    if (search) filters.search = search;
    
    // Get guests from database
    const guests = await GuestService.getGuestsByHotel(hotelId, filters);
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Guests retrieved successfully",
      data: guests
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to retrieve guests",
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
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'nationality', 'idNumber'];
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
    
    // Check if guest with email already exists
    const existingGuest = await GuestService.getGuestByEmail(body.email, hotelId);
    if (existingGuest) {
      return utils.customResponse({
        status: 409,
        message: MessageResponse.Error,
        description: "Guest with this email already exists",
        data: null
      });
    }
    
    // Create guest data
    const guestData = {
      ...body,
      hotelId,
      loyaltyPoints: body.loyaltyPoints || 0,
      totalStays: body.totalStays || 0,
      isVip: body.isVip || false,
      preferences: body.preferences || []
    };
    
    // Create guest in database
    const newGuest = await GuestService.createGuest(guestData);
    
    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Guest created successfully",
      data: newGuest
    });
  } catch (error) {
    console.error('Error creating guest:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to create guest",
      data: null
    });
  }
}

export { GET, POST };
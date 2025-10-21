import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/utils/db";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { GuestService } from "@/lib/server/services/guestService";

async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const guestId = params.id;
    
    // Get guest from database
    const guest = await GuestService.getGuestById(guestId);
    
    if (!guest) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Guest not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Guest retrieved successfully",
      data: guest
    });
  } catch (error) {
    console.error('Error fetching guest:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to retrieve guest",
      data: null
    });
  }
}

async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const guestId = params.id;
    const body = await request.json();
    
    // Update guest in database
    const updatedGuest = await GuestService.updateGuest(guestId, body);
    
    if (!updatedGuest) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Guest not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Guest updated successfully",
      data: updatedGuest
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to update guest",
      data: null
    });
  }
}

async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const guestId = params.id;
    
    // Delete guest from database
    const deleted = await GuestService.deleteGuest(guestId);
    
    if (!deleted) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Guest not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Guest deleted successfully",
      data: null
    });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to delete guest",
      data: null
    });
  }
}

export { GET, PUT, DELETE };
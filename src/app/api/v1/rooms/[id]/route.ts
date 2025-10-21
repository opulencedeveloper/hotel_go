import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/utils/db";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { RoomService } from "@/lib/server/services/roomService";

async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const roomId = params.id;
    
    // Get room from database
    const room = await RoomService.getRoomById(roomId);
    
    if (!room) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Room retrieved successfully",
      data: room
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to retrieve room",
      data: null
    });
  }
}

async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const roomId = params.id;
    const body = await request.json();
    
    // Update room in database
    const updatedRoom = await RoomService.updateRoom(roomId, body);
    
    if (!updatedRoom) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Room updated successfully",
      data: updatedRoom
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to update room",
      data: null
    });
  }
}

async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const roomId = params.id;
    
    // Delete room from database
    const deleted = await RoomService.deleteRoom(roomId);
    
    if (!deleted) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Room deleted successfully",
      data: null
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to delete room",
      data: null
    });
  }
}

export { GET, PUT, DELETE };
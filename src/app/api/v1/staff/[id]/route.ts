import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/utils/db";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { StaffService } from "@/lib/server/services/staffService";

async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const staffId = params.id;
    
    // Get staff from database
    const staff = await StaffService.getStaffById(staffId);
    
    if (!staff) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Staff not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Staff retrieved successfully",
      data: staff
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to retrieve staff",
      data: null
    });
  }
}

async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const staffId = params.id;
    const body = await request.json();
    
    // Update staff in database
    const updatedStaff = await StaffService.updateStaff(staffId, body);
    
    if (!updatedStaff) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Staff not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Staff updated successfully",
      data: updatedStaff
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to update staff",
      data: null
    });
  }
}

async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  
  try {
    const staffId = params.id;
    
    // Delete staff from database
    const deleted = await StaffService.deleteStaff(staffId);
    
    if (!deleted) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Staff not found",
        data: null
      });
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Staff deleted successfully",
      data: null
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to delete staff",
      data: null
    });
  }
}

export { GET, PUT, DELETE };
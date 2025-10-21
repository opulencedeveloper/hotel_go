import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/utils/db";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { StaffService } from "@/lib/server/services/staffService";

async function GET(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    // Build filters object
    const filters: any = {};
    if (department) filters.department = department;
    if (status) filters.status = status;
    if (role) filters.role = role;
    if (search) filters.search = search;
    
    // Get staff from database
    const staff = await StaffService.getStaffByHotel(hotelId, filters);
    
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
    const requiredFields = ['employeeId', 'firstName', 'lastName', 'email', 'phone', 'position', 'department', 'role', 'hireDate', 'shift'];
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
    
    // Check if staff with employee ID already exists
    const existingStaff = await StaffService.getStaffByEmployeeId(body.employeeId, hotelId);
    if (existingStaff) {
      return utils.customResponse({
        status: 409,
        message: MessageResponse.Error,
        description: "Staff with this employee ID already exists",
        data: null
      });
    }
    
    // Check if staff with email already exists
    const existingEmail = await StaffService.getStaffByEmail(body.email, hotelId);
    if (existingEmail) {
      return utils.customResponse({
        status: 409,
        message: MessageResponse.Error,
        description: "Staff with this email already exists",
        data: null
      });
    }
    
    // Create staff data
    const staffData = {
      ...body,
      hotelId,
      status: body.status || 'active',
      skills: body.skills || [],
      certifications: body.certifications || []
    };
    
    // Create staff in database
    const newStaff = await StaffService.createStaff(staffData);
    
    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Staff created successfully",
      data: newStaff
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to create staff",
      data: null
    });
  }
}

export { GET, POST };
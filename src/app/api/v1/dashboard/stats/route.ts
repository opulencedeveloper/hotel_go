import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/utils/db";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { DashboardService } from "@/lib/server/services/dashboardService";

async function GET(request: NextRequest) {
  await connectDB();
  
  try {
    // Get hotel ID from headers (set by middleware)
    const hotelId = request.headers.get('x-hotel-id');
    if (!hotelId || hotelId === '') {
      // For now, return mock data if no hotel ID
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "No hotel ID provided, returning mock dashboard stats",
        data: {
          totalRooms: 50,
          occupiedRooms: 35,
          availableRooms: 15,
          occupancyRate: 70,
          totalRevenue: 25000,
          arrivals_today: 8,
          departures_today: 6,
          in_house_guests: 45
        }
      });
    }
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'overview', 'revenue', 'occupancy'
    const period = searchParams.get('period'); // 'daily', 'weekly', 'monthly', 'yearly'
    
    let data;
    
    if (type === 'revenue' && period) {
      // Get revenue analytics
      data = await DashboardService.getRevenueAnalytics(hotelId, period as any);
    } else if (type === 'occupancy' && period) {
      // Get occupancy analytics
      data = await DashboardService.getOccupancyAnalytics(hotelId, period as any);
    } else {
      // Get comprehensive dashboard stats
      data = await DashboardService.getDashboardStats(hotelId);
    }
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Dashboard statistics retrieved successfully",
      data: data
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to retrieve dashboard statistics",
      data: null
    });
  }
}

export { GET };
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { CustomRequest } from "../utils/interface";
import { dashboardSummaryService } from "./service";
import { IDashboardSummaryParams } from "./interface";

class DashboardSummaryController {
  
  /**
   * Get comprehensive dashboard summary
   * Provides complete overview of hotel operations
   */
  public async getDashboardSummary(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    const query = customReq.query || {};

    try {
      // Parse query parameters
      const params: IDashboardSummaryParams = {
        hotelId: hotelId!,
        startDate: query.startDate ? new Date(query.startDate as string) : undefined,
        endDate: query.endDate ? new Date(query.endDate as string) : undefined,
        period: (query.period as 'today' | 'week' | 'month' | 'year' | 'all') || 'all',
      };

      // Get dashboard summary
      const summary = await dashboardSummaryService.getDashboardSummary(params);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Dashboard summary fetched successfully!",
        data: summary,
      });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch dashboard summary",
        data: null,
      });
    }
  }

  /**
   * Get quick dashboard summary
   * Optimized for speed with essential metrics only
   */
  public async getQuickSummary(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    try {
      // Get quick summary
      const summary = await dashboardSummaryService.getQuickSummary(hotelId!);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Quick dashboard summary fetched successfully!",
        data: {
          ...summary,
          metadata: {
            type: 'quick',
            generatedAt: new Date(),
            hotelId: hotelId!.toString()
          }
        },
      });
    } catch (error) {
      console.error('Error fetching quick summary:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch quick summary",
        data: null,
      });
    }
  }

  /**
   * Get room summary specifically
   * For room management dashboard
   */
  public async getRoomSummary(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    const query = customReq.query || {};

    try {
      const params: IDashboardSummaryParams = {
        hotelId: hotelId!,
        startDate: query.startDate ? new Date(query.startDate as string) : undefined,
        endDate: query.endDate ? new Date(query.endDate as string) : undefined,
        period: (query.period as 'today' | 'week' | 'month' | 'year' | 'all') || 'all',
      };

      const summary = await dashboardSummaryService.getDashboardSummary(params);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Room summary fetched successfully!",
        data: {
          rooms: summary.rooms,
          metadata: {
            type: 'room-summary',
            generatedAt: new Date(),
            hotelId: hotelId!.toString()
          }
        },
      });
    } catch (error) {
      console.error('Error fetching room summary:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch room summary",
        data: null,
      });
    }
  }

  /**
   * Get staff summary specifically
   * For staff management dashboard
   */
  public async getStaffSummary(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    try {
      const summary = await dashboardSummaryService.getDashboardSummary({
        hotelId: hotelId!,
        period: 'all'
      });

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Staff summary fetched successfully!",
        data: {
          staff: summary.staff,
          metadata: {
            type: 'staff-summary',
            generatedAt: new Date(),
            hotelId: hotelId!.toString()
          }
        },
      });
    } catch (error) {
      console.error('Error fetching staff summary:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch staff summary",
        data: null,
      });
    }
  }

  /**
   * Get revenue summary specifically
   * For financial dashboard
   */
  public async getRevenueSummary(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    const query = customReq.query || {};

    try {
      const params: IDashboardSummaryParams = {
        hotelId: hotelId!,
        startDate: query.startDate ? new Date(query.startDate as string) : undefined,
        endDate: query.endDate ? new Date(query.endDate as string) : undefined,
        period: (query.period as 'today' | 'week' | 'month' | 'year' | 'all') || 'all',
      };

      const summary = await dashboardSummaryService.getDashboardSummary(params);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Revenue summary fetched successfully!",
        data: {
          revenue: summary.revenue,
          metadata: {
            type: 'revenue-summary',
            generatedAt: new Date(),
            hotelId: hotelId!.toString()
          }
        },
      });
    } catch (error) {
      console.error('Error fetching revenue summary:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch revenue summary",
        data: null,
      });
    }
  }
}

export const dashboardSummaryController = new DashboardSummaryController();

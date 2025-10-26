import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { CustomRequest } from "../utils/interface";
import { dashboardStatsService } from "./service";
import { dashboardStatsValidator } from "./validator";
import { IDashboardStatsFilters } from "./interface";
import { realTimeDashboardService } from "./real-time-service";

class DashboardStatsController {
  
  /**
   * Get optimized dashboard statistics with date filtering
   * This endpoint supports date-based filtering to avoid loading all data
   */
  public async getDashboardStats(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    const query = customReq.query || {};

    try {
      // Parse query parameters
      const filters: IDashboardStatsFilters = {
        startDate: query.startDate ? new Date(query.startDate as string) : undefined,
        endDate: query.endDate ? new Date(query.endDate as string) : undefined,
        period: (query.period as 'day' | 'week' | 'month' | 'year' | 'all') || 'all',
        roomStatus: query.roomStatus ? (query.roomStatus as string).split(',') : undefined,
        staffStatus: query.staffStatus ? (query.staffStatus as string).split(',') : undefined,
        stayStatus: query.stayStatus ? (query.stayStatus as string).split(',') : undefined,
        housekeepingStatus: query.housekeepingStatus ? (query.housekeepingStatus as string).split(',') : undefined,
      };

      // Validate filters
      const { error: validationError } = dashboardStatsValidator.getDashboardStats(filters);
      if (validationError) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: validationError.details[0].message,
          data: null,
        });
      }

      // Validate date range
      const dateRangeError = dashboardStatsValidator.validateDateRange(filters.startDate, filters.endDate);
      if (dateRangeError) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: dateRangeError.error,
          data: null,
        });
      }

      // Get date range based on period if not provided
      let startDate = filters.startDate;
      let endDate = filters.endDate;

      if (filters.period && filters.period !== 'all' && !startDate && !endDate) {
        const dateRange = dashboardStatsService.getDateRange(filters.period);
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
      }

      // Get dashboard statistics
      const stats = await dashboardStatsService.getDashboardStats({
        hotelId: hotelId!,
        startDate,
        endDate,
        period: filters.period || 'all',
        limit: query.limit ? parseInt(query.limit as string) : undefined,
        offset: query.offset ? parseInt(query.offset as string) : undefined,
      });

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Dashboard statistics fetched successfully!",
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch dashboard statistics",
        data: null,
      });
    }
  }

  /**
   * Get dashboard statistics for a specific period
   * This is a convenience endpoint for common periods
   */
  public async getDashboardStatsByPeriod(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    const period = customReq.params?.period as string;

    try {
      // Validate period
      const validPeriods = ['day', 'week', 'month', 'year'];
      if (!validPeriods.includes(period)) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: `Invalid period. Must be one of: ${validPeriods.join(', ')}`,
          data: null,
        });
      }

      // Get detailed statistics using the optimized real-time service
      const detailedStats = await realTimeDashboardService.getDetailedStats(hotelId!, period);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: `Dashboard statistics for ${period} fetched successfully!`,
        data: {
          ...detailedStats,
          metadata: {
            period,
            generatedAt: new Date(),
            hotelId: hotelId!.toString()
          }
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard statistics by period:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch dashboard statistics",
        data: null,
      });
    }
  }

  /**
   * Get real-time dashboard statistics (lightweight)
   * This endpoint provides quick stats for real-time updates
   */
  public async getRealTimeStats(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    try {
      // Get quick stats using the optimized real-time service
      const quickStats = await realTimeDashboardService.getQuickStats(hotelId!);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Real-time statistics fetched successfully!",
        data: {
          ...quickStats,
          metadata: {
            type: 'realtime',
            generatedAt: new Date(),
            hotelId: hotelId!.toString()
          }
        },
      });
    } catch (error) {
      console.error('Error fetching real-time statistics:', error);
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to fetch real-time statistics",
        data: null,
      });
    }
  }
}

export const dashboardStatsController = new DashboardStatsController();

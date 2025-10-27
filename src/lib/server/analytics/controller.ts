import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { MessageResponse } from "../utils/enum";
import { anayticsService } from "./service";

class AnalyticsController {
  public async getAnalytics(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    // Get period from query params (defaults to '30d' if not provided)
    const period = customReq.query?.period as string || '30d';

    const rooms = await anayticsService.findRoomsByHotelId(hotelId!, period);
    const stays = await anayticsService.findStaysByHotelId(hotelId!, period);
    const orders = await anayticsService.findOrdersByHotelId(hotelId!, period);

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Analytics fetched successfully!",
      data: { rooms, stays, orders, period },
    });
  }


  
}

export const analyticsController = new AnalyticsController();

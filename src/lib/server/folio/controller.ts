import { orderService } from "../order/service";
import { stayService } from "../stay/service";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";

class FolioController {
  public async fetchFolio(customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    const orders = await orderService.findOrdersByHotelId(hotelId!);

    const stays = await stayService.findStaysByHotelId(hotelId!);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description:"Folio fetched successfully!",
      data: { stays, orders },
    });
  }
}

export const folioController = new FolioController();

import { menuService } from "../menu/service";
import { roomService } from "../room/service";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { OrderType } from "./enum";
import {
  ICreateOrderInput,
  ICreateOrderUserInput,
  IUpdateOrderStatus,
} from "./interface";
import { orderService } from "./service";

class OrderController {
  public async createOrder(
    body: ICreateOrderUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    if (body.roomNumber && body.orderType === OrderType.HOTEL_GUEST) {
      const roomExist = await roomService.findRoomByRoomNoAndHotelId(
        body.roomNumber,
        hotelId!.toString()
      );

      if (!roomExist) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.VerifyEmail,
          description: "Room number not found!",
          data: null,
        });
      }
    }

    const menuValidation = await menuService.validateMenuItems(body.items);

    if (!menuValidation.valid) {
      let description = "";

      if (menuValidation.missing && menuValidation.missing.length > 0) {
        description += `Invalid menuId(s): ${menuValidation.missing.join(
          ", "
        )}`;
      }

      if (menuValidation.unavailable && menuValidation.unavailable.length > 0) {
        if (description) description += " | "; // separate multiple issues
        description += `Unavailable menuId(s): ${menuValidation.unavailable.join(
          ", "
        )}`;
      }

      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description,
        data: null,
      });
    }

    const order = await orderService.createOrder({
      ...body,
      items: menuValidation.items!,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.VerifyEmail,
      description: "Menu created successfully!",
      data: {order},
    });
  }

  public async fetchAllOrders(req: CustomRequest) {
    const { hotelId } = req;

    const orders = await orderService.findOrdersByHotelId(hotelId!);

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Orders fetched successfully!",
      data: {
        orders,
      },
    });
  }

  public async updateOrderStatus(
    body: IUpdateOrderStatus,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const order = await orderService.findOrderBylId(body.orderId);

    if (!order) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Order not found!",
        data: null,
      });
    }
    const editedOrder = await orderService.editOrderStatus(body);

    if (!editedOrder) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Order not found!",
        data: null,
      });
    }

    if (typeof editedOrder === "string") {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: editedOrder,
        data: null,
      });
    }

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Orderer status updated successfully!",
      data: { editedOrder },
    });
  }
}

export const orderController = new OrderController();

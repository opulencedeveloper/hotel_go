import { Types } from "mongoose";
import { IAddInventoryItemUserInput } from "../inventory/inteface";
import { roomService } from "../room/service";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { InventoryDestination } from "./enum";
import { ICreateInventoryInventoryLogsUserInput } from "./interface";
import { inventoryLogsService } from "./service";
import { inventoryService } from "../inventory/service";

class InventoryLogsController {
  public async createInventory(
    body: ICreateInventoryInventoryLogsUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    let roomId = null;

    if (
      body.roomNumber &&
      body.destination === InventoryDestination.HOTEL_GUEST
    ) {
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

      roomId = roomExist._id;
    }

  const { missingIds, insufficientInventories } =
  await inventoryService.findMissingInventoryIds(body.inventories);

if (missingIds.length > 0) {
  return utils.customResponse({
    status: 400,
    message: MessageResponse.Error,
    description: "Some inventory items were not found!",
    data: { missingIds },
  });
}

if (insufficientInventories.length > 0) {
  return utils.customResponse({
    status: 400,
    message: MessageResponse.Error,
    description: "Some inventory items have insufficient stock!",
    data: { insufficientInventories },
  });
}


    const payload: any = {
      ...body,
      hotelId: hotelId!,
    };

    if (roomId) payload.roomId = roomId;

    const newMenu = await inventoryLogsService.createInventoryLogs(payload);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Inventory log created successfully!",
      data: newMenu,
    });
  }

}

export const inventoryLogsController = new InventoryLogsController();

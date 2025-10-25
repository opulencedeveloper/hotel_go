import { inventoryLogsService } from "../inventoryLogs/service";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { IAddInventoryItemUserInput } from "./inteface";
import { inventoryService } from "./service";

class InventoryController {
  public async addInventory(
    body: IAddInventoryItemUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const itemsWithHotelId = body.items.map((item) => ({
      ...item,
      hotelId: hotelId!,
    }));

    const addedItems = await inventoryService.createInventoryItems({
      items: itemsWithHotelId,
    });

    console.log(addedItems);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Menu created successfully!",
      data: {addedItems},
    });
  }

  public async fetchAllInventory(req: CustomRequest) {
    const { hotelId } = req;

    const inventories = await inventoryService.findInventorysByHotelId(
      hotelId!
    );

     const inventoryLogs = await inventoryLogsService.findInventoryLogsByHotelId(
      hotelId!
    );

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Inventories fetched successfully!",
      data: {
        inventories,
        inventoryLogs
      },
    });
  }
}

export const inventoryController = new InventoryController();

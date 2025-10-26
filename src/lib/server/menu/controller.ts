import { orderService } from "../order/service";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { ICreateMenuUserInput, IEditMenuUserInput } from "./interface";
import { menuService } from "./service";

class MenuController {
  public async createMenu(
    body: ICreateMenuUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const menuExist = await menuService.findMenuByNameAndHotelId(
      body.itemName,
      hotelId!
    );

    if (menuExist) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Item name exists!",
        data: null,
      });
    }

    const newMenu = await menuService.createMenu({
      ...body,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Menu created successfully!",
      data: { newMenu },
    });
  }

  public async fetchAllMenus(req: CustomRequest) {
    const { hotelId } = req;

    const menus = await menuService.findMenusByHotelId(hotelId!);

    const orders = await orderService.findOrdersByHotelId(hotelId!)

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Menus fetched successfully!",
      data: {
        menus,
        orders
      },
    });
  }

  public async updateMenu(body: IEditMenuUserInput, customReq: CustomRequest) {
    const hotelId = customReq.hotelId;
    console.log(body.menuId);
    const menu = await menuService.findMenuById(body.menuId!);

    if (!menu) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Menu not found!",
        data: null,
      });
    }

    if (
      body.itemName.toLowerCase().toString() !==
      menu.itemName.toLowerCase().toString()
    ) {
      const nameExist = await menuService.findMenuyByNameAndHotelId(
        body.itemName,
        hotelId!
      );

      if (nameExist) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Item name exist!",
          data: null,
        });
      }
    }

    const updatedMenu = await menuService.editMenuyIdAndHotelId(body, hotelId!);

    console.log(updatedMenu);
    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Menu updated successfully!",
      data: { updatedMenu },
    });
  }
}

export const menuController = new MenuController();

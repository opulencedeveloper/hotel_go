import { Types } from "mongoose";
import Menu from "./entity";
import { ICreateMenuInput, IEditMenuUserInput } from "./interface";
import { IOrderItem, IOrderItemUserInput } from "../order/interface";
import { MenuStatus } from "./enum";

class MenuService {
  public async createMenu(input: ICreateMenuInput) {
    const menu = new Menu({ ...input });
    await menu.save();

    return menu;
  }

  public async findMenuByNameAndHotelId(
    itemName: string,
    hotelId: Types.ObjectId
  ) {
    const hotel = await Menu.findOne({
      hotelId,
      itemName: { $regex: `^${itemName}$`, $options: "" },
    });

    return hotel;
  }

    public async findMenuyByNameAndHotelId(
    itemName: string,
    hotelId: Types.ObjectId
  ) {
    const facility = await Menu.findOne({ itemName: { $regex: `^${itemName}$`, $options: "" }, hotelId });

    return facility;
  }

  public async findMenusByHotelId(hotelId: Types.ObjectId) {
    const menu = await Menu.find({ hotelId });

    return menu;
  }

  public async findMenuById(id: Types.ObjectId) {
    const menu = await Menu.findById(id);

    return menu;
  }

    public async editMenuyIdAndHotelId(input: IEditMenuUserInput, hotelId: Types.ObjectId) {
    const { menuId, ...updateData } = input;

    const updatedMenu = await Menu.findOneAndUpdate(
      { _id: menuId, hotelId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedMenu;
  }

  public async validateMenuItems(items: IOrderItemUserInput[]) {
    // Extract menu IDs
    const menuIds = items.map((item) => item.menuId);

    // Query all menu items that exist and include their status & price
    const existingMenus = await Menu.find({ _id: { $in: menuIds } }).select(
      "_id price status"
    );

    // Create a lookup map for quick access
    const existingMap = new Map(
      existingMenus.map((menu) => [menu._id.toString(), menu])
    );

    // Separate valid, missing, and unavailable items
    const validItems: {
      menuId: Types.ObjectId;
      quantity: number;
      priceWhenOrdered: number;
    }[] = [];

    const missingMenus: string[] = [];
    const unavailableMenus: string[] = [];

    for (const item of items) {
      const menu = existingMap.get(item.menuId.toString());

      if (!menu) {
        missingMenus.push(item.menuId.toString());
      } else if (menu.status !== MenuStatus.Available) {
        unavailableMenus.push(item.menuId.toString());
      } else {
        validItems.push({
          menuId: item.menuId,
          quantity: item.quantity,
          priceWhenOrdered: menu.price,
        });
      }
    }

    if (missingMenus.length > 0 || unavailableMenus.length > 0) {
      return {
        valid: false,
        missing: missingMenus,
        unavailable: unavailableMenus,
      };
    }

    return {
      valid: true,
      items: validItems,
    };
  }

  // public async validateMenuItems(items: IOrderItemUserInput[]) {
  //   // Extract menu IDs
  //   const menuIds = items.map((item) => item.menuId);

  //   // Query all menu items that exist
  //   const existingMenus = await Menu.find({ _id: { $in: menuIds } }).select("_id price");

  //   // Create a lookup map for quick access
  //   const existingMap = new Map(
  //     existingMenus.map((menu) => [menu._id.toString(), menu])
  //   );

  //   // Separate valid and missing items
  //   const validItems: {
  //     menuId: Types.ObjectId;
  //     quantity: number;
  //     priceWhenOrdered: number;
  //   }[] = [];

  //   const missingMenus: string[] = [];

  //   for (const item of items) {
  //     const menu = existingMap.get(item.menuId.toString());
  //     if (!menu) {
  //       missingMenus.push(item.menuId.toString());
  //     } else {
  //       validItems.push({
  //         menuId: item.menuId,
  //         quantity: item.quantity,
  //         // if you want to respect the menu price at the time of order:
  //         priceWhenOrdered: menu.price,
  //       });
  //     }
  //   }

  //   // If any missing menus found
  //   if (missingMenus.length > 0) {
  //     return {
  //       valid: false,
  //       missing: missingMenus,
  //     };
  //   }

  //   // Otherwise, return valid items
  //   return {
  //     valid: true,
  //     items: validItems,
  //   };
  // }
}

export const menuService = new MenuService();

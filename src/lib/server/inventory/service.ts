import { Types } from "mongoose";
import Inventory from "./enitity";
import { IAddInventoryItems } from "./inteface";
import { IInventoryItem } from "../inventoryLogs/interface";

class InventoryService {
 public async createInventoryItems(input: IAddInventoryItems) {
  const { items } = input;

  // Insert all items efficiently at once
  const createdItems = await Inventory.insertMany(items);

  return createdItems;
}

public async findInventorysByHotelId(hotelId: Types.ObjectId) {
  const inventorys = await Inventory.find({ hotelId }).sort({ createdAt: -1 });
  return inventorys;
}

 /**
   * Checks for invalid or insufficient inventory items.
   * @param items - Array of inventoryId and quantity requested.
   * @returns Object containing missingIds and insufficientInventories.
   */

 public async findMissingInventoryIdsAndUpdateInventoryQuantityIfFound(
  items: IInventoryItem[]
) {
  if (!items.length) return { missingIds: [], insufficientInventories: [] };

  const inventoryIds = items.map((item) => item.inventoryId);

  // Fetch all inventories from DB
  const existingInventories = await Inventory.find({
    _id: { $in: inventoryIds },
  });

  // Create a map for quick lookup
  const inventoryMap = new Map<string, any>();
  existingInventories.forEach((inv) => {
    inventoryMap.set(inv._id.toString(), inv);
  });

  // Arrays to track issues
  const missingIds: string[] = [];
  const insufficientInventories: {
    inventoryId: string;
    available: number;
    requested: number;
  }[] = [];

  let savedInventory = null;
  // Loop through requested items
  for (const item of items) {
    const idStr = item.inventoryId.toString();
    const inventoryDoc = inventoryMap.get(idStr);

    // If the inventory item doesn't exist
    if (!inventoryDoc) {
      missingIds.push(idStr);
      continue;
    }

    const availableStock = inventoryDoc.currentStock;

    // If there isn't enough stock
    if (item.quantity > availableStock) {
      insufficientInventories.push({
        inventoryId: idStr,
        available: availableStock,
        requested: item.quantity,
      });
      continue;
    }

    // ✅ Reduce the currentStock
    inventoryDoc.currentStock = availableStock - item.quantity;

    // ✅ Save the updated inventory document
  savedInventory =  await inventoryDoc.save();
  }

  return { missingIds, insufficientInventories, savedInventory };
}


  // public async findMissingInventoryIdsAndUpateInventoryQunatityIfFound(items: IInventoryItem[]) {
  //   if (!items.length) return { missingIds: [], insufficientInventories: [] };

  //   // Extract IDs
  //   const inventoryIds = items.map((item) => item.inventoryId);

  //   // Step 1: Fetch all matching inventory docs at once
  //   const existingInventories = await Inventory.find(
  //     { _id: { $in: inventoryIds } },
  //     { _id: 1, quantity: 1 } // only get id and available quantity
  //   ).lean();

  //   // Step 2: Build a map for quick lookup
  //   const inventoryMap = new Map<string, number>();
  //   existingInventories.forEach((inv) => {
  //     inventoryMap.set(inv._id.toString(), inv.currentStock);
  //   });

  //   // Step 3: Determine missing and insufficient ones
  //   const missingIds: string[] = [];
  //   const insufficientInventories: { inventoryId: string; available: number; requested: number }[] = [];

  //   for (const item of items) {
  //     const idStr = item.inventoryId.toString();

  //     if (!inventoryMap.has(idStr)) {
  //       // ID not found in DB
  //       missingIds.push(idStr);
  //       continue;
  //     }

  //     const availableQty = inventoryMap.get(idStr)!;
  //     if (item.quantity > availableQty) {
  //       insufficientInventories.push({
  //         inventoryId: idStr,
  //         available: availableQty,
  //         requested: item.quantity,
  //       });
  //     }
  //   }

  //   return { missingIds, insufficientInventories };
  // }
}

export const inventoryService = new InventoryService();

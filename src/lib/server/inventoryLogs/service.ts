import { Types } from "mongoose";
import { ICreateInventoryInventoryLogsInput } from "./interface";
import InventoryLogs from "./entity";

class InventoryLogsService {
public async createInventoryLogs(input: ICreateInventoryInventoryLogsInput) {
  // Step 1: Create and save the inventory log
  const inventoryLog = new InventoryLogs({ ...input });
  await inventoryLog.save();

  // Step 2: Use aggregation to return a populated and shaped result
  const [populatedLog] = await InventoryLogs.aggregate([
    // Match just the newly created one
    { $match: { _id: new Types.ObjectId(inventoryLog._id) } },

    // Lookup staff info
    {
      $lookup: {
        from: "staffs",
        localField: "staffId",
        foreignField: "_id",
        as: "staff",
      },
    },
    { $unwind: { path: "$staff", preserveNullAndEmptyArrays: true } },

    // Lookup room info
    {
      $lookup: {
        from: "rooms",
        localField: "roomId",
        foreignField: "_id",
        as: "room",
      },
    },
    { $unwind: { path: "$room", preserveNullAndEmptyArrays: true } },

    // Lookup roomType info (nested)
    {
      $lookup: {
        from: "roomtypes",
        localField: "room.roomTypeId",
        foreignField: "_id",
        as: "roomType",
      },
    },
    { $unwind: { path: "$roomType", preserveNullAndEmptyArrays: true } },

    // Lookup inventories
    {
      $lookup: {
        from: "inventories",
        localField: "inventories.inventoryId",
        foreignField: "_id",
        as: "inventoryDetails",
      },
    },

    // Merge inventory details back
    {
      $addFields: {
        inventories: {
          $map: {
            input: "$inventories",
            as: "inv",
            in: {
              $mergeObjects: [
                "$$inv",
                {
                  inventoryInfo: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$inventoryDetails",
                          as: "details",
                          cond: { $eq: ["$$details._id", "$$inv.inventoryId"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },

    // Remove temp field
    { $unset: "inventoryDetails" },

    // Match projection for consistent response shape
    {
      $project: {
        _id: 1,
        destination: 1,
        notes: 1,
        createdAt: 1,
        staff: {
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          userRole: 1,
        },
        room: {
          roomNumber: 1,
          floor: 1,
        },
        roomType: {
          name: 1,
          price: 1,
          capacity: 1,
        },
        inventories: {
          inventoryId: 1,
          quantity: 1,
          "inventoryInfo.itemName": 1,
          "inventoryInfo.category": 1,
          "inventoryInfo.unit": 1,
          "inventoryInfo.currentStock": 1,
          "inventoryInfo.costPerUnit": 1,
          "inventoryInfo.supplier": 1,
          "inventoryInfo.storageLocation": 1,
        },
      },
    },
  ]);

  // Step 3: Return the same structured response
  return populatedLog;
}


public async findInventoryLogsByHotelId(hotelId: Types.ObjectId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const inventoryLogs = await InventoryLogs.aggregate([
      // Match by hotel ID (uses index)
      { $match: { hotelId: new Types.ObjectId(hotelId) } },

      // Sort newest first
      { $sort: { createdAt: -1 } },

      // Pagination
      { $skip: skip },
      { $limit: limit },

      // Lookup staff info
      {
        $lookup: {
          from: "staffs", // collection name in MongoDB
          localField: "staffId",
          foreignField: "_id",
          as: "staff",
        },
      },
      { $unwind: { path: "$staff", preserveNullAndEmptyArrays: true } },

      // Lookup room info
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: { path: "$room", preserveNullAndEmptyArrays: true } },

      // Lookup roomType info (nested)
      {
        $lookup: {
          from: "roomtypes",
          localField: "room.roomTypeId",
          foreignField: "_id",
          as: "roomType",
        },
      },
      { $unwind: { path: "$roomType", preserveNullAndEmptyArrays: true } },

      // Lookup inventories
      {
        $lookup: {
          from: "inventories",
          localField: "inventories.inventoryId",
          foreignField: "_id",
          as: "inventoryDetails",
        },
      },

      // Optional: merge inventory details back into each item
      {
        $addFields: {
          inventories: {
            $map: {
              input: "$inventories",
              as: "inv",
              in: {
                $mergeObjects: [
                  "$$inv",
                  {
                    inventoryInfo: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$inventoryDetails",
                            as: "details",
                            cond: { $eq: ["$$details._id", "$$inv.inventoryId"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },

      // Remove temp field
      { $unset: "inventoryDetails" },

      // Project only necessary fields (to reduce payload)
      {
        $project: {
          _id: 1,
          destination: 1,
          notes: 1,
          createdAt: 1,
          staff: {
            firstName: 1,
            lastName: 1,
            email: 1,
            phoneNumber: 1,
            userRole: 1,
          },
          room: {
            roomNumber: 1,
            floor: 1,
          },
          roomType: {
            name: 1,
            price: 1,
            capacity: 1,
          },
          inventories: {
            inventoryId: 1,
            quantity: 1,
            "inventoryInfo.itemName": 1,
            "inventoryInfo.category": 1,
            "inventoryInfo.unit": 1,
            "inventoryInfo.currentStock": 1,
            "inventoryInfo.costPerUnit": 1,
            "inventoryInfo.supplier": 1,
            "inventoryInfo.storageLocation": 1,
          },
        },
      },
    ]);

    return inventoryLogs;
  }

}

export const inventoryLogsService = new InventoryLogsService();

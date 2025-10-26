import mongoose, { Types } from "mongoose";
import { ICreateHouseKeepingInput } from "./interface";
import HouseKeeping from "./entity";
import "../room/entity";
import "../staff/entity";
import { HouseKeepingStatus } from "./enum";

class HouseKeepingService {
  public async createHouseKeeping(input: ICreateHouseKeepingInput) {
    const houseKeeping = new HouseKeeping({ ...input });
    await houseKeeping.save();

    return houseKeeping;
  }

  public async findHouseKeepingByHotelId(hotelId: Types.ObjectId) {
    const houseKeeping = await HouseKeeping.find({ hotelId })
      .select("title description roomIds staffIds status createdAt") // only needed fields
      .populate({
        path: "roomIds", // updated to match schema array
        select: "roomNumber floor", // only essential fields
      })
      .populate({
        path: "staffIds", // still an array
        select: "firstName lastName email phoneNumber userRole", // essential staff fields
      })
      .sort({ createdAt: -1 })
      .lean(); // returns plain JS objects for better performance

    return houseKeeping;
  }

  public async updateHouseKeepingStatus(
    id: Types.ObjectId,
    status: HouseKeepingStatus
  ) {
    const houseKeeping = await HouseKeeping.findOneAndUpdate(
      {
        _id: id,
      },
      { status },
      { new: true }
    ) .select("title description roomIds staffIds status createdAt") // only needed fields
      .populate({
        path: "roomIds", // updated to match schema array
        select: "roomNumber floor", // only essential fields
      })
      .populate({
        path: "staffIds", // still an array
        select: "firstName lastName email phoneNumber userRole", // essential staff fields
      })
      .sort({ createdAt: -1 })
      .lean();;

    return houseKeeping;
  }
}

export const houseKeepingService = new HouseKeepingService();

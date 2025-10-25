import {
  ICreateScheduledServiceInput,
  IEditScheduledServiceUserInput,
} from "./interface";

import ScheduleService from "./entity";
import { Types } from "mongoose";
import "../hotelService/entity";

class ScheduledServiceService {
  public async creatScheduledServiceService(
    input: ICreateScheduledServiceInput
  ) {
    const savedScheduleService = new ScheduleService({ ...input });
    await savedScheduleService.save();

    return savedScheduleService;
  }

  public async fetchScheduledServiceByHotelId(hotelId: Types.ObjectId) {
    return await ScheduleService.find({ hotelId })
      .populate({
        path: "hotelServiceId",
        model: "HotelService",
      })
      .exec();
  }

  public async findScheduledServiceByIdAndHotellId(
    scheduledServiceId: string,
    hotelId: Types.ObjectId
  ) {
    const hotel = await ScheduleService.findOne({
      _id: scheduledServiceId,
      hotelId,
    });

    return hotel;
  }

  public async editHotelScheduledServiceByIdAndHotelId(
    input: IEditScheduledServiceUserInput,
    hotelId: Types.ObjectId
  ) {
    const { scheduledServiceId, ...updateData } = input;

    const updatedRoom = await ScheduleService.findOneAndUpdate(
      { _id: scheduledServiceId, hotelId },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate({
        path: "hotelServiceId",
        model: "HotelService",
      })
      .exec();;

    return updatedRoom;
  }
}

export const scheduledServiceService = new ScheduledServiceService();

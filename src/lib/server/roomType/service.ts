import { Types } from "mongoose";
import RoomType from "./entity";
import { IAddRoomTypeInput, IEditRoomTypeUserInput } from "./interface";

class RoomTypeService {
  public async addRoomType(input: IAddRoomTypeInput) {
    const roomType = new RoomType({
      ...input,
    });

    const savedRoomType = await roomType.save();

    return savedRoomType;
  }

  public async editRoomType(
    input: IEditRoomTypeUserInput,
    hotelId: Types.ObjectId
  ) {
    const { roomTypeId, ...updateData } = input;

    console.log({ roomTypeId, ...updateData });

    const updatedRoomType = await RoomType.findOneAndUpdate(
      { _id: roomTypeId, hotelId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedRoomType;
  }

  public async deleteRoomTypeByIdAndHotelId(
    roomTypeId: string,
    hotelId: Types.ObjectId
  ) {
    return await RoomType.findOneAndDelete({ _id: roomTypeId, hotelId });
  }

  public async findRoomTypeByNameAndHotelId(name: string, hotelId: string) {
    const roomType = await RoomType.findOne({ name: { $regex: `^${name}$`, $options: "" }, hotelId });

    return roomType;
  }


  public async findHotelRoomTypeByHotelId(hotelId: Types.ObjectId) {
    const roomTypes = await RoomType.find({ hotelId });

    return roomTypes;
  }

   public async findHotelRoomTypeById(id: string) {
   
    const roomType = await RoomType.findById(id);

    return roomType;
  }
}

export const roomTypeService = new RoomTypeService();

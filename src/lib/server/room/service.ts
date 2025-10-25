import { IAddRoomInput, IEditRoomUserInput } from "./interface";
import Room from "./entity";
import { Types } from "mongoose";
// Import models to ensure they're registered with Mongoose
import "../roomType/model";

class RoomService {
  public async createRoom(input: IAddRoomInput) {
    const room = new Room({ ...input });
    await room.save();

    return room;
  }
  

  public async editRoomByIdAndHotelId(input: IEditRoomUserInput, hotelId: Types.ObjectId) {
    const { roomId, ...updateData } = input;

    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId, hotelId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedRoom;
  }

public async findRoomByRoomNoAndHotelId(roomNumber: string, hotelId: string) {
  const room = await Room.findOne({
    hotelId,
    roomNumber: { $regex: `^${roomNumber}$`, $options: "" }, // no 'i' flag → case-sensitive
  });

  return room;
}


   public async findRoomByRoomIdAndHotellId(roomId: string, hotelId: string) {
    const hotel = await Room.findOne({ _id: roomId, hotelId });

    return hotel;
  }

  public async findRoomsByHotelId(hotelId: Types.ObjectId) {
    const rooms = await Room.find({ hotelId })
      .populate({
        path: "hotelId",
        select: "hotelName", // only the fields you need
      })
      .populate({
        path: "roomTypeId",
        select: "name", // fields from RoomType
      });

    return rooms;
  }

  public async updateRoomStatusByIdAndHotelId(roomId: Types.ObjectId, hotelId: Types.ObjectId, roomStatus: string) {
      const room = await Room.findOneAndUpdate(
        {
         _id: roomId,
         hotelId
        },
        { roomStatus },
        { new: true }
      );
  
      console.log(room);
      return room;
    }
}

export const roomService = new RoomService();

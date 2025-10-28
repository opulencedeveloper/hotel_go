import { IAddRoomInput, IEditRoomUserInput } from "./interface";
import Room from "./entity";
import { Types } from "mongoose";
// Import models to ensure they're registered with Mongoose
import "../roomType/model";
import { RoomStatus } from "./enum";

class RoomService {
  public async createRoom(input: IAddRoomInput) {
    const room = new Room({ ...input });
    await room.save();

    return room;
  }

  public async editRoomByIdAndHotelId(
    input: IEditRoomUserInput,
    hotelId: Types.ObjectId
  ) {
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

   public async findRoomsByIdAndRoomStatus(roomIds: Types.ObjectId[], roomStatus: RoomStatus) {
    // Query all staff that match the given IDs AND have the given role
    const staffs = await Room.find({
      _id: { $in: roomIds },
      roomStatus,
    });
  
    return staffs;
  }

  // public async findRoomByIdAndStatus(
  //   id: Types.ObjectId,
  //   roomStatus: RoomStatus
  // ) {
  //   const room = await Room.findOne({
  //     _id: id,
  //     roomStatus, // no 'i' flag → case-sensitive
  //   });

  //   return room;
  // }

  public async findRoomByRoomIdAndHotellId(roomId: string, hotelId: string) {
     const room = await Room.findOne({ _id: roomId, hotelId })
      .populate({
        path: "roomTypeId",
        select: "name price capacity", // pull only what’s needed
      })
      .lean(); 

      return room;
  }

  public async findRoomsByHotelId(hotelId: Types.ObjectId) {
    const rooms = await Room.find({ hotelId })
      .populate({
        path: "hotelId",
        select: "hotelName", // only the fields you need
      })
      .populate({
        path: "roomTypeId",
        select: "name price capacity", // fields from RoomType
      });

    return rooms;
  }

  public async updateRoomStatusByIdAndHotelId(
    roomId: Types.ObjectId,
    hotelId: Types.ObjectId,
    roomStatus: string
  ) {
    const room = await Room.findOneAndUpdate(
      {
        _id: roomId,
        hotelId,
      },
      { roomStatus },
      { new: true }
    );

    console.log(room);
    return room;
  }

  public async markRoomsAsAvailable(roomIds: Types.ObjectId[]) {
  if (!roomIds.length) return [];

  // Update all rooms whose _id is in the roomIds array
  const updatedRooms = await Room.updateMany(
    { _id: { $in: roomIds } },
    { $set: { roomStatus: RoomStatus.Available } }
  );

  return updatedRooms; // returns { acknowledged: true, modifiedCount: X }
}
}

export const roomService = new RoomService();

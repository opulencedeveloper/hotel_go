import { Document } from "mongoose";
import { Types } from "mongoose";

export interface IRoom extends Document {
  _id: Types.ObjectId;
  floor: number;
  roomNumber: string;
  roomTypeId: string;
  roomStatus: string;
  note?: string;
  lastCleaned?: Date;
  hotelId: Types.ObjectId;
}

export interface IAddRoomInput {
  floor: number;
  roomNumber: string;
  roomTypeId: string;
  note?: string;
  roomStatus: string;
  hotelId: Types.ObjectId;
} 

export interface IAddRoomUserInput {
  floor: number;
  roomNumber: string;
  roomTypeId: string;
  roomStatus: string;
  note?: string;
}

export interface IEditRoomUserInput {
  roomId: string,
  floor: number;
  roomNumber: string;
  roomTypeId: string;
  roomStatus: string;
  note?: string;
}

export interface IAddHotelAmenities {
  amenities: string[];
}

import { Document, Types } from "mongoose";

export interface IRoomType extends Document {
  _id: Types.ObjectId;
  name: string;
  hotelId: Types.ObjectId,
  capacity: number;
  price: number;
  description?: string;
  amenities?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddRoomTypeUserInput {
  name: string;
  capacity: number;
  price: number;
  description?: string;
  amenities?: string[];
}

export interface IEditRoomTypeUserInput {
  roomTypeId: string,
  name: string;
  capacity: number;
  price: number;
  description?: string;
  amenities?: string[];
}

export interface IAddRoomTypeInput {
  name: string;
  capacity: number;
  price: number;
  description?: string;
  hotelId: Types.ObjectId,
  amenities?: string[];
}
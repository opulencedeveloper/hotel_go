import { Document, Types } from "mongoose";
import { HouseKeepingStatus } from "./enum";

export interface IHouseKeeping extends Document {
  hotelId: Types.ObjectId;
  staffIds: Types.ObjectId[]; // multiple staff members
  roomIds: Types.ObjectId[];  // multiple rooms
  title: string;
  status: HouseKeepingStatus;
  description?: string;
}

export interface ICreateHouseKeepingInput {
  hotelId: Types.ObjectId;
  staffIds: Types.ObjectId[];
  roomIds: Types.ObjectId[];
  title: string;
  description?: string;
}

export interface ICreateHouseKeepingUserInput {
  staffIds: Types.ObjectId[];
  roomIds: Types.ObjectId[];
  title: string;
  description?: string;
}


export interface IMarkHouseKeepingUserInputAsComplete {
  houseKeepingId: Types.ObjectId;
  roomIds: Types.ObjectId[];
}

export interface IMarkHouseKeepingUserInputAsCancelled {
  houseKeepingId: Types.ObjectId;
}

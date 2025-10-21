import mongoose, { Schema } from "mongoose";
import { RoomStatus } from "./enum";
import { IRoom } from "./interface";

const roomSchema: Schema = new Schema(
  {
    roomNumber: { type: String, required: true },
    floor: { type: Number, required: true },
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      trim: true,
    },
    roomStatus: {
      type: String,
      required: true,
      enum: Object.values(RoomStatus),
      trim: true,
    },
    lastCleaned: {
      type: Date,
      default: null,
      trim: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room =
  (mongoose.models.Room as mongoose.Model<IRoom>) ||
  mongoose.model<IRoom>("Room", roomSchema);

export default Room;

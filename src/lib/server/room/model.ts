import mongoose, { Schema } from "mongoose";
import { IRoom } from "./interface";

const RoomSchema = new Schema<IRoom>(
  {
    floor: {
      type: Number,
      required: true,
      min: 1,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    roomTypeId: {
      type: String,
      required: true,
    },
    roomStatus: {
      type: String,
      required: true,
      enum: ['available', 'occupied', 'maintenance', 'cleaning', 'out_of_order'],
      default: 'available',
    },
    note: {
      type: String,
      trim: true,
    },
    lastCleaned: {
      type: Date,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

import mongoose, { Schema } from "mongoose";
import { IRoomType } from "./interface";

const RoomTypeSchema = new Schema<IRoomType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    amenities: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RoomType || mongoose.model<IRoomType>("RoomType", RoomTypeSchema);

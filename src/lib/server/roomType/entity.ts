import mongoose, { Schema } from "mongoose";
import { IRoomType } from "./interface";
import { utils } from "../utils";

const roomTypeSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true, set: utils.toSentenceCase, },
    capacity: { type: Number, required: true, trim: true },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v: mongoose.Types.Decimal128 | undefined): number =>
        v ? parseFloat(v.toString()) : 0,
      set: (v: string | number): mongoose.Types.Decimal128 =>
        mongoose.Types.Decimal128.fromString(v.toString()),
    },

    description: { type: String, default: "", trim: true },
    amenities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const RoomType =
  (mongoose.models.RoomType as mongoose.Model<IRoomType>) ||
  mongoose.model<IRoomType>("RoomType", roomTypeSchema);

export default RoomType;

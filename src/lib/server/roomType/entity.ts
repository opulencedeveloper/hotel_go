import mongoose, { Schema, Types } from "mongoose";
import { IRoomType } from "./interface";
import { utils } from "../utils";

const roomTypeSchema = new Schema<IRoomType>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true, // ✅ speeds up all lookups by hotel
    },
    name: {
      type: String,
      required: true,
      trim: true,
      set: utils.toSentenceCase,
      index: true, // ✅ faster search and filtering by name
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Schema.Types.Decimal128 as unknown as NumberConstructor,
      required: true,
      get: (v: Types.Decimal128 | undefined): number =>
        v ? parseFloat(v.toString()) : 0,
      set: (v: string | number): Types.Decimal128 =>
        Types.Decimal128.fromString(v.toString()),
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
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

// ✅ Compound index for hotel + room name (fast unique lookups)
roomTypeSchema.index({ hotelId: 1, name: 1 }, { unique: true });

// ✅ Optional: text index for searching across fields
roomTypeSchema.index({ name: "text", description: "text" });

// ✅ Optional: sort optimization
roomTypeSchema.index({ price: 1, capacity: -1 });

const RoomType =
  (mongoose.models.RoomType as mongoose.Model<IRoomType>) ||
  mongoose.model<IRoomType>("RoomType", roomTypeSchema);

export default RoomType;

import mongoose, { Schema, Document } from "mongoose";
import { IHotelService } from "./interface"; // your interface file
import { HotelServiceCategory, HotelServiceStatus } from "./enum";

const hotelServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: Object.values(HotelServiceCategory),
      trim: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(HotelServiceStatus),
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v: mongoose.Types.Decimal128 | undefined): number =>
        v ? parseFloat(v.toString()) : 0,
      set: (v: string | number): mongoose.Types.Decimal128 =>
        mongoose.Types.Decimal128.fromString(v.toString()),
    },
    capacity: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
  }
);

const HotelService =
  (mongoose.models.HotelService as mongoose.Model<IHotelService>) ||
  mongoose.model<IHotelService>("HotelService", hotelServiceSchema);

export default HotelService;

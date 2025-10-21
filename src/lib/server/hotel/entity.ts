import mongoose, { Schema } from "mongoose";
import { IHotel } from "./interface";

const hotelSchema: Schema = new Schema(
  {
    hotelName: { type: String, required: true, trim: true },

    amenities: {
      type: [String],
      default: ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar"],
    },

    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    totalRooms: { type: Number, required: true, trim: true },
    totalRoomsOccupied: { type: Number, default: 0, trim: true },
    totalRoomsInMaintenance: { type: Number, default: 0, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    currency: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    agreeToTerms: { type: Boolean, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    licenseKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LicenseKey",
      default: null,
      trim: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Hotel =
  (mongoose.models.Hotel as mongoose.Model<IHotel>) ||
  mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;

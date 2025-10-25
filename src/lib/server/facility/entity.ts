import mongoose, { Schema } from "mongoose";
import { FacilityStatus } from "./enum";
import { IFacility } from "./interface";

const facilitySchema: Schema = new Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    facilityName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(FacilityStatus),
      trim: true,
    },
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Facility =
  (mongoose.models.Facility as mongoose.Model<IFacility>) ||
  mongoose.model<IFacility>("Facility", facilitySchema);

export default Facility;

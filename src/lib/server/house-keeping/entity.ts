import mongoose, { Schema } from "mongoose";
import { IHouseKeeping } from "./interface";
import { HouseKeepingStatus } from "./enum";

const houseKeepingSchema: Schema<IHouseKeeping> = new Schema(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    staffIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
        trim: true,
      },
    ],
    roomIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(HouseKeepingStatus),
      default: HouseKeepingStatus.IN_PROGRESS,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const HouseKeeping =
  (mongoose.models.HouseKeeping as mongoose.Model<IHouseKeeping>) ||
  mongoose.model<IHouseKeeping>("HouseKeeping", houseKeepingSchema);

export default HouseKeeping;

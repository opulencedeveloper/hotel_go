import mongoose, { Schema } from "mongoose";
import { IScheduledService } from "./interface";

const scheduledServiceSchema: Schema = new Schema(
  {
    hotelServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelService",
      required: true,
      trim: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
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

// ✅ Make sure model name matches in both places
const ScheduledService =
  (mongoose.models.ScheduledService as mongoose.Model<IScheduledService>) ||
  mongoose.model<IScheduledService>("ScheduledService", scheduledServiceSchema);

export default ScheduledService;

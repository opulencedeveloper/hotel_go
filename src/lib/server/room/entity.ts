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
      index: true, // ✅ helps group and filter by status
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
    timestamps: true, // ✅ gives you createdAt & updatedAt for sorting & filtering
  }
);

/**
 * 🧠 Index Strategy
 *
 * These compound indexes make your aggregation pipelines fast and index-covered.
 * MongoDB can skip full collection scans when you match by hotelId + status or date range.
 */

// 1️⃣ Core dashboard filter: get all rooms by hotelId
roomSchema.index({ hotelId: 1 });

// 2️⃣ For aggregations filtering by room status (available/occupied/etc.)
roomSchema.index({ hotelId: 1, roomStatus: 1 });

// 3️⃣ For date-filtered aggregations (startDate/endDate on updatedAt)
roomSchema.index({ hotelId: 1, updatedAt: -1 });

// 4️⃣ For date range queries for analytics (efficient date filtering)
roomSchema.index({ hotelId: 1, createdAt: -1 });

// 5️⃣ Optional: For searching or sorting by roomNumber in the UI
roomSchema.index({ hotelId: 1, roomNumber: 1 });

const Room =
  (mongoose.models.Room as mongoose.Model<IRoom>) ||
  mongoose.model<IRoom>("Room", roomSchema);

export default Room;

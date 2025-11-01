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
        trim: true,
      },
    ],

    // ✅ facilityIds is now optional
    facilityIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Facility",
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(HouseKeepingStatus),
      default: HouseKeepingStatus.IN_PROGRESS,
      trim: true,
      index: true, // ✅ used for filters like "Completed", "In Progress"
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

/**
 * 🧠 Index Strategy
 *
 * These indexes are optimized for your dashboard and housekeeping workflow:
 * - Filtering by hotelId (always present)
 * - Filtering by hotelId + status (common in aggregations)
 * - Checking recent housekeeping tasks (updatedAt)
 * - Optional: Searching by title within a hotel
 */

// 1️⃣ Core hotel-level filter
houseKeepingSchema.index({ hotelId: 1 });

// 2️⃣ For dashboard summaries by status
houseKeepingSchema.index({ hotelId: 1, status: 1 });

// 3️⃣ For recently updated tasks (dashboard "recent cleaning" section)
houseKeepingSchema.index({ hotelId: 1, updatedAt: -1 });

// 4️⃣ Optional: Search by title (useful for quick admin search)
houseKeepingSchema.index({ hotelId: 1, title: 1 });

// 5️⃣ Optional: Filter by staff assigned (if used in staff dashboard)
houseKeepingSchema.index({ hotelId: 1, staffIds: 1 });

// 6️⃣ Optional: Filter by room involved
houseKeepingSchema.index({ hotelId: 1, roomIds: 1 });

const HouseKeeping =
  (mongoose.models.HouseKeeping as mongoose.Model<IHouseKeeping>) ||
  mongoose.model<IHouseKeeping>("HouseKeeping", houseKeepingSchema);

export default HouseKeeping;



// import mongoose, { Schema } from "mongoose";
// import { IHouseKeeping } from "./interface";
// import { HouseKeepingStatus } from "./enum";

// const houseKeepingSchema: Schema<IHouseKeeping> = new Schema(
//   {
//     hotelId: {
//       type: Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     staffIds: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Staff",
//         required: true,
//         trim: true,
//       },
//     ],
//     roomIds: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Room",
//         required: true,
//         trim: true,
//       },
//     ],
//     status: {
//       type: String,
//       enum: Object.values(HouseKeepingStatus),
//       default: HouseKeepingStatus.IN_PROGRESS,
//       trim: true,
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const HouseKeeping =
//   (mongoose.models.HouseKeeping as mongoose.Model<IHouseKeeping>) ||
//   mongoose.model<IHouseKeeping>("HouseKeeping", houseKeepingSchema);

// export default HouseKeeping;

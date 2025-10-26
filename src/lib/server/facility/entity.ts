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
    category: { type: String, required: true, trim: true, index: true }, // ✅ Common for filtering/grouping
    location: { type: String, required: true, trim: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(FacilityStatus),
      trim: true,
      index: true, // ✅ Used for status-based aggregations
    },
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

/**
 * 🧠 Index Strategy
 *
 * These indexes help speed up dashboard and admin operations like:
 * - Counting facilities by status per hotel
 * - Filtering by category or updatedAt
 * - Sorting by name or creation date
 */

// 1️⃣ Core filter for all queries
facilitySchema.index({ hotelId: 1 });

// 2️⃣ For aggregations like: facilities grouped by status (Available, Maintenance, etc.)
facilitySchema.index({ hotelId: 1, status: 1 });

// 3️⃣ For filtering by category (e.g., "Gym", "Pool", "Restaurant")
facilitySchema.index({ hotelId: 1, category: 1 });

// 4️⃣ For recency or dashboard updates (recently modified)
facilitySchema.index({ hotelId: 1, updatedAt: -1 });

// 5️⃣ Optional: For searching or sorting alphabetically by name
facilitySchema.index({ hotelId: 1, facilityName: 1 });

const Facility =
  (mongoose.models.Facility as mongoose.Model<IFacility>) ||
  mongoose.model<IFacility>("Facility", facilitySchema);

export default Facility;



// import mongoose, { Schema } from "mongoose";
// import { FacilityStatus } from "./enum";
// import { IFacility } from "./interface";

// const facilitySchema: Schema = new Schema(
//   {
//     hotelId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     facilityName: { type: String, required: true, trim: true },
//     category: { type: String, required: true, trim: true },
//     location: { type: String, required: true, trim: true },
//     floor: { type: Number, required: true },
//     capacity: { type: Number, required: true },
//     status: {
//       type: String,
//       required: true,
//       enum: Object.values(FacilityStatus),
//       trim: true,
//     },
//     description: { type: String, required: true, trim: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Facility =
//   (mongoose.models.Facility as mongoose.Model<IFacility>) ||
//   mongoose.model<IFacility>("Facility", facilitySchema);

// export default Facility;

import mongoose, { Schema } from "mongoose";
import { IHotelService } from "./interface";
import { HotelServiceCategory, HotelServiceStatus } from "./enum";

const hotelServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, index: true }, // ✅ helps search/filter services by location
    category: {
      type: String,
      required: true,
      enum: Object.values(HotelServiceCategory),
      trim: true,
      index: true, // ✅ category-based dashboard analytics
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
      index: true, // ✅ active/inactive status filter
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

/**
 * 🧠 Index Strategy
 *
 * These compound indexes are optimized for your typical use cases:
 * - Fetching services by hotelId (core relation)
 * - Filtering by category or status
 * - Sorting or aggregating by updatedAt
 * - Searching by name within a hotel
 */

// 1️⃣ Basic per-hotel filter
hotelServiceSchema.index({ hotelId: 1 });

// 2️⃣ Dashboard filter: active/inactive services
hotelServiceSchema.index({ hotelId: 1, status: 1 });

// 3️⃣ For category-based service summaries
hotelServiceSchema.index({ hotelId: 1, category: 1 });

// 4️⃣ For date-filtered operations (e.g. recent updates)
hotelServiceSchema.index({ hotelId: 1, updatedAt: -1 });

// 5️⃣ Optional: for quick lookups/search by name
hotelServiceSchema.index({ hotelId: 1, name: 1 });

const HotelService =
  (mongoose.models.HotelService as mongoose.Model<IHotelService>) ||
  mongoose.model<IHotelService>("HotelService", hotelServiceSchema);

export default HotelService;


// import mongoose, { Schema, Document } from "mongoose";
// import { IHotelService } from "./interface"; // your interface file
// import { HotelServiceCategory, HotelServiceStatus } from "./enum";

// const hotelServiceSchema: Schema = new Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     location: { type: String, required: true, trim: true },
//     category: {
//       type: String,
//       required: true,
//       enum: Object.values(HotelServiceCategory),
//       trim: true,
//     },
//     hotelId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: Object.values(HotelServiceStatus),
//       trim: true,
//     },
//     price: {
//       type: mongoose.Schema.Types.Decimal128,
//       required: true,
//       get: (v: mongoose.Types.Decimal128 | undefined): number =>
//         v ? parseFloat(v.toString()) : 0,
//       set: (v: string | number): mongoose.Types.Decimal128 =>
//         mongoose.Types.Decimal128.fromString(v.toString()),
//     },
//     capacity: { type: Number, required: true },
//     description: { type: String, required: true, trim: true },
//   },
//   {
//     toJSON: { getters: true },
//     toObject: { getters: true },
//     timestamps: true,
//   }
// );

// const HotelService =
//   (mongoose.models.HotelService as mongoose.Model<IHotelService>) ||
//   mongoose.model<IHotelService>("HotelService", hotelServiceSchema);

// export default HotelService;

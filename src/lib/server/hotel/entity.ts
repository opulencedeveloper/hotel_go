import mongoose, { Schema } from "mongoose";
import { IHotel } from "./interface";

const hotelSchema: Schema = new Schema(
  {
    hotelName: { type: String, required: true, trim: true }, // ✅ used in searches & sorting

    amenities: {
      type: [String],
      default: ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar"],
    },

    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true }, // ✅ useful for regional lookups
    state: { type: String, required: true, trim: true, index: true }, // ✅ filtering by state
    country: { type: String, required: true, trim: true, index: true }, // ✅ country-based dashboards
    currency: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    agreeToTerms: { type: Boolean, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
      index: true, // ✅ for filtering hotels by owner/admin
    },
  
    isActive: { type: Boolean, default: true, index: true }, // ✅ used in most active/inactive filters
  },
  { timestamps: true }
);

/**
 * 🧠 Index Strategy
 *
 * These indexes ensure fast querying for:
 * - Owner dashboards (fetching all hotels owned by a user)
 * - Filtering by location (state, city, country)
 * - Searching or sorting by hotel name
 * - Fetching only active hotels
 * - Licensing & activation checks
 */

// 1️⃣ Owner + active status filter
hotelSchema.index({ ownerId: 1, isActive: 1 });

// 2️⃣ Location-based filters
hotelSchema.index({ country: 1, state: 1, city: 1 });

// 3️⃣ Recently created or updated hotels (for dashboards)
hotelSchema.index({ updatedAt: -1 });

// 4️⃣ Optional: license-based activation tracking
hotelSchema.index({ licenseKeyId: 1, isActive: 1 });

// 5️⃣ Search/sort optimization for hotelName
hotelSchema.index({ hotelName: 1 });

const Hotel =
  (mongoose.models.Hotel as mongoose.Model<IHotel>) ||
  mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;




// import mongoose, { Schema } from "mongoose";
// import { IHotel } from "./interface";

// const hotelSchema: Schema = new Schema(
//   {
//     hotelName: { type: String, required: true, trim: true },

//     amenities: {
//       type: [String],
//       default: ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar"],
//     },

//     phone: { type: String, required: true, trim: true },
//     address: { type: String, required: true, trim: true },
//     city: { type: String, required: true, trim: true },
//     state: { type: String, required: true, trim: true },
//     country: { type: String, required: true, trim: true },
//     currency: { type: String, required: true, trim: true },
//     postalCode: { type: String, required: true, trim: true },
//     agreeToTerms: { type: Boolean, required: true },
//     ownerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       trim: true,
//     },
//     licenseKeyId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LicenseKey",
//       default: null,
//       trim: true,
//     },

//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// const Hotel =
//   (mongoose.models.Hotel as mongoose.Model<IHotel>) ||
//   mongoose.model<IHotel>("Hotel", hotelSchema);

// export default Hotel;

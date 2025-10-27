import mongoose, { Schema } from "mongoose";
import { IStay } from "./interface";
import { PaymentMethod, PaymentStatus, StayStatus, StayType } from "./enum";

const staySchema = new Schema<IStay>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true, // 🔹 Optimized for frequent room lookups
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true, // 🔹 Optimized for hotel-level queries
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔹 Enables text/name searches
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔹 For quick lookups by guest phone
    },
    emailAddress: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: true,
      index: true, // 🔹 For date range queries
    },
    checkOutDate: {
      type: Date,
      default: null,
      index: true,
    },
    adults: {
      type: Number,
      default: 1,
      min: 1,
    },
    children: {
      type: Number,
      default: 0,
      min: 0,
    },
    specialRequests: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    status: {
      type: String,
      enum: Object.values(StayStatus),
      required: true,
      index: true, // 🔹 Filter by active/cancelled/completed
    },
    type: {
      type: String,
      enum: Object.values(StayType),
      required: true,
      index: true, // 🔹 Day stay / Overnight
    },
    paymentDate: {
      type: Date,
      required: true,
      index: true, // 🔹 For financial reporting
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      index: true, // 🔹 Common filter in billing dashboards
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
     tax: {
      type: Number,
      default: null,
      trim: true,
    },
    serviceCharge: {
      type: Number,
      default: null,
      trim: true,
    },
    discount: {
      type: Number,
      default: null,
      trim: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Compound indexes for fast dashboard & analytics queries
staySchema.index({ hotelId: 1, status: 1, checkInDate: -1 });
staySchema.index({ hotelId: 1, paymentStatus: 1 });
staySchema.index({ phoneNumber: 1, hotelId: 1 });
staySchema.index({ guestName: "text", emailAddress: "text" }); // 🔹 Enables text search

// 🔹 Date range queries for analytics (efficient date filtering)
staySchema.index({ hotelId: 1, createdAt: -1 }); // For date range queries

// 🔹 Performance tweaks
staySchema.set("versionKey", false);
staySchema.set("toJSON", { virtuals: true });
staySchema.set("toObject", { virtuals: true });

const Stay =
  (mongoose.models.Stay as mongoose.Model<IStay>) ||
  mongoose.model<IStay>("Stay", staySchema);

export default Stay;



// import mongoose, { Schema, Types } from "mongoose";
// import { IStay } from "./interface";
// import { PaymentMethod, PaymentStatus, StayStatus, StayType } from "./enum";



// const staySchema: Schema = new Schema(
//   {
//     roomId: {
//       type: Types.ObjectId,
//       ref: "Room",
//       required: true,
//       trim: true,
//     },
//     hotelId: {
//       type: Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     guestName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     phoneNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     emailAddress: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     paymentMethod: {
//       type: String,
//       enum: Object.values(PaymentMethod),
//       required: true,
//       trim: true,
//     },
//     checkInDate: {
//       type: Date,
//       required: true,
//     },
//     checkOutDate: {
//       type: Date,
//       default: null,
//     },
//     adults: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },
//     children: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     specialRequests: {
//       type: String,
//       trim: true,
//       default: "",
//       maxlength: 500,
//     },
//     status: {
//       type: String,
//       enum: Object.values(StayStatus),
//       required: true,
//     },
//      type: {
//       type: String,
//       enum: Object.values(StayType),
//       required: true,
//     },
//     paymentDate: {
//       type: Date,
//       trim: true,
//       required: true,
//     },
//     paymentStatus: {
//       type: String,
//       enum: Object.values(PaymentStatus),
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Stay =
//   (mongoose.models.Stay as mongoose.Model<IStay>) ||
//   mongoose.model<IStay>("Stay", staySchema);

// export default Stay;

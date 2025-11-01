import mongoose, { Schema } from "mongoose";
import { IStaff } from "./interface";
import { StaffRole, StaffShift, StaffStatus } from "./enum";

const staffSchema = new Schema<IStaff>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ enables name-based searches
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    dashboardAccessPassword: {
      type: String,
      trim: true,
      select: false, // ✅ exclude sensitive data from normal queries
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // ✅ ensure fast login/lookup
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ helps search/filter by phone
    },
    hasPassword: {
      type: Boolean,
      default: false,
    },
    userRole: {
      type: String,
      required: true,
      enum: Object.values(StaffRole),
      trim: true,
      index: true, // ✅ allows filtering by role (manager, cleaner, etc.)
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
      index: true, // ✅ useful for reports, filtering
    },
    shift: {
      type: String,
      required: true,
      enum: Object.values(StaffShift),
      trim: true,
      index: true,
    },
    status: {
      type: String,
      default: StaffStatus.ACTIVE,
      enum: Object.values(StaffStatus),
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    stateOrProvince: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ for filtering staff by location
    },
    postalCode: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collation: { locale: "en", strength: 2 }, // ✅ makes text searches case-insensitive
  }
);

// ✅ Compound indexes
//staffSchema.index({ hotelId: 1, email: 1 }, { unique: true }); // prevents duplicate emails in same hotel
staffSchema.index({ hotelId: 1, userRole: 1 }); // filter by role within hotel quickly
staffSchema.index({ hotelId: 1, status: 1, shift: 1 }); // fast filtering in dashboards
staffSchema.index({ firstName: "text", lastName: "text", city: "text" }); // full-text search support

const Staff =
  (mongoose.models.Staff as mongoose.Model<IStaff>) ||
  mongoose.model<IStaff>("Staff", staffSchema);

export default Staff;




// import mongoose, { Schema } from "mongoose";
// import { IStaff } from "./interface";
// import { StaffRole, StaffShift, StaffStatus } from "./enum"; // Assuming these enums exist
// import StaffStats from "@/components/staff/StaffStats";

// const staffSchema = new Schema<IStaff>(
//   {
//     hotelId: {
//       type: Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     middleName: {
//       type: String,
//       trim: true,
//     },
//     dashboardAccessPassword: {
//       type: String,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     phoneNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     hasPassword: {
//       type: Boolean,
//       default: false,
//       trim: true,
//     },
//     userRole: {
//       type: String,
//       required: true,
//       enum: Object.values(StaffRole),
//       trim: true,
//     },
//     salary: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     shift: {
//       type: String,
//       required: true,
//       enum: Object.values(StaffShift),
//       trim: true,
//     },
//     status: {
//       type: String,
//       default: StaffStatus.ACTIVE,
//       enum: Object.values(StaffStats),
//       trim: true,
//     },
//     country: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     stateOrProvince: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     city: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     postalCode: {
//       type: String,
//       trim: true,
//     },
//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// const Staff =
//   (mongoose.models.Staff as mongoose.Model<IStaff>) ||
//   mongoose.model<IStaff>("Staff", staffSchema);

// export default Staff;

import mongoose, { Schema } from "mongoose";
import { IStaff } from "./interface";
import { StaffRole, StaffShift, StaffStatus } from "./enum"; // Assuming these enums exist
import StaffStats from "@/components/staff/StaffStats";

const staffSchema = new Schema<IStaff>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    dashboardAccessPassword: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    hasPassword: {
      type: Boolean,
      default: false,
      trim: true,
    },
    userRole: {
      type: String,
      required: true,
      enum: Object.values(StaffRole),
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    shift: {
      type: String,
      required: true,
      enum: Object.values(StaffShift),
      trim: true,
    },
    status: {
      type: String,
      default: StaffStatus.ACTIVE,
      enum: Object.values(StaffStats),
      trim: true,
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
  { timestamps: true }
);

const Staff =
  (mongoose.models.Staff as mongoose.Model<IStaff>) ||
  mongoose.model<IStaff>("Staff", staffSchema);

export default Staff;

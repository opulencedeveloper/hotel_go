import mongoose, { Schema } from "mongoose";
import { UserRole } from "./enum";
import { IUser } from "./interface";

const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true,  trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
     userRole: {
      type: String,
      required: true, trim: true,
      enum: Object.values(UserRole),
    },
    password: { type: String, required: true, trim: true },
    hotelId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Hotel", 
      default: null,
      trim: true
    },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationOtp: { type: String, default: undefined, trim: true },
    emailVerificationOtpExpiration: { type: Date, default: undefined },
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;

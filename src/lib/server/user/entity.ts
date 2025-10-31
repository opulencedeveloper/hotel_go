import mongoose, { Schema } from "mongoose";
import { UserRole } from "./enum";
import { IUser } from "./interface";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔹 Enables fast search by name
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔹 Enables fast search by name
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // 🔹 Prevents duplicates
      lowercase: true, // 🔹 For consistent matching
      index: true,
    },
    userRole: {
      type: String,
      required: true,
      trim: true,
      enum: Object.values(UserRole),
      index: true, // 🔹 Enables role-based filtering
    },
    password: {
      type: String,
      required: true,
      trim: true,
     // select: false, // 🔒 Security: don’t include password in queries by default
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // 🔹 Helps filter active/inactive users quickly
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true, // 🔹 Enables efficient email verification checks
    },
    emailVerificationOtp: {
      type: String,
      trim: true,
      default: undefined,
    },
    emailVerificationOtpExpiration: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true, // 🔹 createdAt / updatedAt
  }
);

// ✅ Compound Indexes
userSchema.index({ hotelId: 1, userRole: 1 });
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ email: "text", firstName: "text", lastName: "text" }); // 🔹 Text search across user identity

// ✅ Optional TTL index: auto-remove expired verification records (e.g., after 24h)

// ✅ Performance Tweaks
userSchema.set("versionKey", false);
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;



// import mongoose, { Schema } from "mongoose";
// import { UserRole } from "./enum";
// import { IUser } from "./interface";

// const userSchema: Schema = new Schema(
//   {
//     firstName: { type: String, required: true,  trim: true },
//     lastName: { type: String, required: true, trim: true },
//     email: { type: String, required: true, trim: true, unique: true },
//      userRole: {
//       type: String,
//       required: true, trim: true,
//       enum: Object.values(UserRole),
//     },
//     password: { type: String, required: true, trim: true },
//     hotelId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "Hotel", 
//       default: null,
//       trim: true
//     },
//     isActive: { type: Boolean, default: true },
//     emailVerified: { type: Boolean, default: false },
//     emailVerificationOtp: { type: String, default: undefined, trim: true },
//     emailVerificationOtpExpiration: { type: Date, default: undefined },
//   },
//   {
//     timestamps: true,
//   }
// );

// const User =
//   (mongoose.models.User as mongoose.Model<IUser>) ||
//   mongoose.model<IUser>("User", userSchema);

// export default User;

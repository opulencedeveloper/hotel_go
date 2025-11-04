import mongoose, { Schema } from "mongoose";
import { ILicence } from "./interface";
import { PaymentStatus } from "@/utils/enum";

const licenceSchema = new Schema<ILicence>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.PENDING,
      index: true,
      trim: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      trim: true,
    },
    licenceKey: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows multiple nulls, unique: true automatically creates index
      default: null,
      trim: true,
      // Note: unique: true automatically creates index, no need for schema.index()
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    billingPeriod: {
      type: String,
      enum: ["yearly", "quarterly"],
      default: null,
      trim: true,
    },
    flutterwaveTransactionId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ✅ Compound Indexes
 */
licenceSchema.index({ planId: 1, userId: 1 });
licenceSchema.index({ expiresAt: 1 });

// ❌ REMOVE this line to prevent duplicate index conflict
// licenceSchema.index({ licenceKey: 1 });

/**
 * ✅ Mongoose Config
 */
licenceSchema.set("versionKey", false);
licenceSchema.set("toJSON", { virtuals: true });
licenceSchema.set("toObject", { virtuals: true });

const Licence =
  (mongoose.models.Licence as mongoose.Model<ILicence>) ||
  mongoose.model<ILicence>("Licence", licenceSchema);

export default Licence;

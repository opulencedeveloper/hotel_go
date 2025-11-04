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
      required: true, // always required
      default: PaymentStatus.PENDING, // default value
      index: true, // useful for filtering payment states
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
      sparse: true, // ✅ allows multiple nulls
      default: null,
      trim: true,
    },
     email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true, // ✅ Efficient lookup by email
    },
    billingPeriod: {
      type: String,
      enum: ['yearly', 'quarterly'],
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
    timestamps: true, // ✅ adds createdAt / updatedAt
  }
);

/**
 * 🧩 Virtual Property
 * Returns true if the license has expired.
 */
// licenceSchema.virtual("isExpired").get(function (this: ILicence) {
//   return this.expiresAt ? new Date() > this.expiresAt : false;
// });

// ✅ Indexes
licenceSchema.index({ planId: 1, userId: 1 });
licenceSchema.index({ expiresAt: 1 });
licenceSchema.index({ licenceKey: 1 });

// ✅ Mongoose Configs
licenceSchema.set("versionKey", false);
licenceSchema.set("toJSON", { virtuals: true });
licenceSchema.set("toObject", { virtuals: true });

const Licence =
  (mongoose.models.Licence as mongoose.Model<ILicence>) ||
  mongoose.model<ILicence>("Licence", licenceSchema);

export default Licence;

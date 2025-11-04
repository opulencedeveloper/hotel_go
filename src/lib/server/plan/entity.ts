import mongoose, { Schema } from "mongoose";
import { IPlan } from "./interface";
import { PlanName } from "./enum";

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      enum: Object.values(PlanName),
      trim: true,
      unique: true,
      index: true, // 🔹 Enables quick lookup by name
    },

    price: {
      type: {
        quarterly: {
          type: Number,
          min: 0,
        },
        yearly: {
          type: Number,
          min: 0,
        },
      },
      default: null, // ✅ allows null price for Enterprise
    },

    rooms: {
      type: String,
      required: true,
      trim: true,
    },

    multiProperty: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    features: {
      type: [String],
      required: true,
      default: [],
    },

    popular: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes
planSchema.index({ name: 1, popular: 1 });
planSchema.index({ "price.yearly": 1 });
planSchema.index({ "price.quarterly": 1 });

// ✅ Performance Tweaks
planSchema.set("versionKey", false);
planSchema.set("toJSON", { virtuals: true });
planSchema.set("toObject", { virtuals: true });

const Plan =
  (mongoose.models.Plan as mongoose.Model<IPlan>) ||
  mongoose.model<IPlan>("Plan", planSchema);

export default Plan;

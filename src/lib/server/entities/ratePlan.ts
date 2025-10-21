import mongoose, { Schema } from "mongoose";

export interface IRatePlan {
  _id: string;
  code: string;
  name: string;
  description: string;
  rules: {
    minLengthOfStay: number;
    maxLengthOfStay: number;
    blackoutDates: Date[];
    advanceBookingDays: number;
    cancellationPolicy: string;
    depositRequired: boolean;
    depositPercentage: number;
  };
  rates: {
    [date: string]: number; // Dynamic pricing by date
  };
  roomTypeIds: mongoose.Types.ObjectId[];
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ratePlanSchema: Schema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    rules: {
      minLengthOfStay: { type: Number, default: 1, min: 1 },
      maxLengthOfStay: { type: Number, default: 30, min: 1 },
      blackoutDates: [{ type: Date }],
      advanceBookingDays: { type: Number, default: 365, min: 0 },
      cancellationPolicy: { type: String, required: true },
      depositRequired: { type: Boolean, default: false },
      depositPercentage: { type: Number, default: 0, min: 0, max: 100 }
    },
    rates: { type: Map, of: Number }, // Dynamic pricing
    roomTypeIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType"
    }],
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
ratePlanSchema.index({ hotelId: 1, code: 1 }, { unique: true });
ratePlanSchema.index({ hotelId: 1, isActive: 1 });
ratePlanSchema.index({ hotelId: 1, roomTypeIds: 1 });

const RatePlan =
  (mongoose.models.RatePlan as mongoose.Model<IRatePlan>) ||
  mongoose.model<IRatePlan>("RatePlan", ratePlanSchema);

export default RatePlan;






import mongoose, { Schema } from "mongoose";
import { IStay } from "./interface";

const StaySchema = new Schema<IStay>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(require("./enum").PaymentMethod),
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
StaySchema.index({ hotelId: 1, checkInDate: -1 });
StaySchema.index({ roomId: 1, checkInDate: 1 });
StaySchema.index({ guestName: 1 });

export const StayModel = mongoose.models.Stay || mongoose.model<IStay>("Stay", StaySchema);

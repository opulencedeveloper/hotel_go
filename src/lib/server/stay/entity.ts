import mongoose, { Schema, Types } from "mongoose";
import { IStay } from "./interface";
import { PaymentMethod, PaymentStatus, StayStatus, StayType } from "./enum";



const staySchema: Schema = new Schema(
  {
    roomId: {
      type: Types.ObjectId,
      ref: "Room",
      required: true,
      trim: true,
    },
    hotelId: {
      type: Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
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
    },
    checkOutDate: {
      type: Date,
      default: null,
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
    },
     type: {
      type: String,
      enum: Object.values(StayType),
      required: true,
    },
    paymentDate: {
      type: Date,
      trim: true,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stay =
  (mongoose.models.Stay as mongoose.Model<IStay>) ||
  mongoose.model<IStay>("Stay", staySchema);

export default Stay;

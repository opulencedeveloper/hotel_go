import mongoose, { Schema } from "mongoose";

export interface IReservation {
  _id: string;
  reservationNumber: string;
  guestId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'bank-transfer' | 'online';
  specialRequests?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema: Schema = new Schema(
  {
    reservationNumber: { type: String, required: true, unique: true },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    status: { 
      type: String, 
      required: true,
      enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'],
      default: 'confirmed'
    },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    paymentStatus: { 
      type: String, 
      required: true,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentMethod: { 
      type: String, 
      enum: ['cash', 'card', 'bank-transfer', 'online']
    },
    specialRequests: { type: String },
    notes: { type: String },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    checkedInAt: { type: Date },
    checkedOutAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
reservationSchema.index({ hotelId: 1, reservationNumber: 1 }, { unique: true });
reservationSchema.index({ hotelId: 1, status: 1 });
reservationSchema.index({ hotelId: 1, checkIn: 1, checkOut: 1 });
reservationSchema.index({ guestId: 1 });
reservationSchema.index({ roomId: 1 });
reservationSchema.index({ hotelId: 1, paymentStatus: 1 });

const Reservation =
  (mongoose.models.Reservation as mongoose.Model<IReservation>) ||
  mongoose.model<IReservation>("Reservation", reservationSchema);

export default Reservation;














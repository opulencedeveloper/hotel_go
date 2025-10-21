import mongoose, { Schema } from "mongoose";

export interface IFolio {
  _id: string;
  folioNumber: string;
  reservationId: mongoose.Types.ObjectId;
  guestId: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  status: 'open' | 'closed' | 'settled' | 'transferred';
  charges: mongoose.Types.ObjectId[]; // References to Charge documents
  payments: mongoose.Types.ObjectId[]; // References to Payment documents
  adjustments: {
    amount: number;
    reason: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  transferredTo?: mongoose.Types.ObjectId; // If transferred to another folio
  closedAt?: Date;
  closedBy?: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const folioSchema: Schema = new Schema(
  {
    folioNumber: { type: String, required: true },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'USD' },
    status: { 
      type: String, 
      required: true,
      enum: ['open', 'closed', 'settled', 'transferred'],
      default: 'open'
    },
    charges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charge"
    }],
    payments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    }],
    adjustments: [{
      amount: { type: Number, required: true },
      reason: { type: String, required: true },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      createdAt: { type: Date, default: Date.now }
    }],
    transferredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folio"
    },
    closedAt: { type: Date },
    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
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
folioSchema.index({ hotelId: 1, folioNumber: 1 }, { unique: true });
folioSchema.index({ hotelId: 1, reservationId: 1 });
folioSchema.index({ hotelId: 1, guestId: 1 });
folioSchema.index({ hotelId: 1, status: 1 });
folioSchema.index({ hotelId: 1, balance: 1 });

const Folio =
  (mongoose.models.Folio as mongoose.Model<IFolio>) ||
  mongoose.model<IFolio>("Folio", folioSchema);

export default Folio;







import mongoose, { Schema } from "mongoose";

export interface ICharge {
  _id: string;
  chargeNumber: string;
  folioId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  category: 'room' | 'f_and_b' | 'service' | 'tax' | 'fee' | 'discount' | 'adjustment';
  subcategory?: string; // e.g., 'breakfast', 'spa', 'parking'
  outletId?: mongoose.Types.ObjectId; // For F&B charges
  roomId?: mongoose.Types.ObjectId; // For room-related charges
  postedBy: mongoose.Types.ObjectId;
  postedAt: Date;
  reversed: boolean;
  reversedAt?: Date;
  reversedBy?: mongoose.Types.ObjectId;
  reversalReason?: string;
  notes?: string;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chargeSchema: Schema = new Schema(
  {
    chargeNumber: { type: String, required: true },
    folioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folio",
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    unitPrice: { type: Number, required: true },
    taxRate: { type: Number, required: true, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['room', 'f_and_b', 'service', 'tax', 'fee', 'discount', 'adjustment']
    },
    subcategory: { type: String },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet"
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postedAt: { type: Date, required: true, default: Date.now },
    reversed: { type: Boolean, default: false },
    reversedAt: { type: Date },
    reversedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reversalReason: { type: String },
    notes: { type: String },
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
chargeSchema.index({ hotelId: 1, chargeNumber: 1 }, { unique: true });
chargeSchema.index({ hotelId: 1, folioId: 1 });
chargeSchema.index({ hotelId: 1, category: 1 });
chargeSchema.index({ hotelId: 1, postedAt: 1 });
chargeSchema.index({ hotelId: 1, outletId: 1 });
chargeSchema.index({ hotelId: 1, reversed: 1 });

const Charge =
  (mongoose.models.Charge as mongoose.Model<ICharge>) ||
  mongoose.model<ICharge>("Charge", chargeSchema);

export default Charge;







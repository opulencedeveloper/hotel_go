import mongoose, { Schema } from "mongoose";

export interface IPayment {
  _id: string;
  paymentNumber: string;
  folioId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'cash' | 'card' | 'bank_transfer' | 'voucher' | 'check' | 'mobile_payment' | 'cryptocurrency';
  paymentDetails: {
    cardType?: string; // visa, mastercard, amex
    lastFourDigits?: string;
    authorizationCode?: string;
    transactionId?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    checkNumber?: string;
    voucherCode?: string;
    mobileProvider?: string;
    cryptoType?: string;
    cryptoAddress?: string;
  };
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  processedBy: mongoose.Types.ObjectId;
  processedAt: Date;
  reference: string; // External reference number
  notes?: string;
  refundedAmount?: number;
  refundedAt?: Date;
  refundedBy?: mongoose.Types.ObjectId;
  refundReason?: string;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema: Schema = new Schema(
  {
    paymentNumber: { type: String, required: true },
    folioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folio",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },
    method: { 
      type: String, 
      required: true,
      enum: ['cash', 'card', 'bank_transfer', 'voucher', 'check', 'mobile_payment', 'cryptocurrency']
    },
    paymentDetails: {
      cardType: { type: String },
      lastFourDigits: { type: String },
      authorizationCode: { type: String },
      transactionId: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      routingNumber: { type: String },
      checkNumber: { type: String },
      voucherCode: { type: String },
      mobileProvider: { type: String },
      cryptoType: { type: String },
      cryptoAddress: { type: String }
    },
    status: { 
      type: String, 
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    processedAt: { type: Date, required: true, default: Date.now },
    reference: { type: String, required: true },
    notes: { type: String },
    refundedAmount: { type: Number, default: 0, min: 0 },
    refundedAt: { type: Date },
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    refundReason: { type: String },
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
paymentSchema.index({ hotelId: 1, paymentNumber: 1 }, { unique: true });
paymentSchema.index({ hotelId: 1, folioId: 1 });
paymentSchema.index({ hotelId: 1, status: 1 });
paymentSchema.index({ hotelId: 1, method: 1 });
paymentSchema.index({ hotelId: 1, processedAt: 1 });
paymentSchema.index({ hotelId: 1, reference: 1 });

const Payment =
  (mongoose.models.Payment as mongoose.Model<IPayment>) ||
  mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;














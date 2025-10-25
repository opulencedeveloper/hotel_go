import mongoose, { Schema } from "mongoose";

export interface IPOSOrder {
  _id: string;
  orderNumber: string;
  outletId: mongoose.Types.ObjectId;
  folioId?: mongoose.Types.ObjectId; // If charged to guest room
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled' | 'completed';
  orderType: 'dine_in' | 'takeaway' | 'room_service' | 'delivery';
  items: {
    itemId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    modifiers: {
      name: string;
      price: number;
    }[];
    notes?: string;
    status: 'pending' | 'preparing' | 'ready' | 'served';
    preparedBy?: mongoose.Types.ObjectId;
    preparedAt?: Date;
  }[];
  subtotal: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  total: number;
  tableNumber?: string;
  roomNumber?: string;
  guestName?: string;
  guestPhone?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  specialInstructions?: string;
  createdBy: mongoose.Types.ObjectId; // Staff member who took the order
  kitchenNotes?: string;
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  servedAt?: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'room_charge' | 'voucher';
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const posOrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: true,
    },
    folioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folio"
    },
    status: { 
      type: String, 
      required: true,
      enum: ['pending', 'preparing', 'ready', 'served', 'cancelled', 'completed'],
      default: 'pending'
    },
    orderType: { 
      type: String, 
      required: true,
      enum: ['dine_in', 'takeaway', 'room_service', 'delivery'],
      default: 'dine_in'
    },
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "POSItem",
        required: true
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true, min: 0 },
      totalPrice: { type: Number, required: true, min: 0 },
      modifiers: [{
        name: { type: String, required: true },
        price: { type: Number, required: true }
      }],
      notes: { type: String },
      status: { 
        type: String, 
        enum: ['pending', 'preparing', 'ready', 'served'],
        default: 'pending'
      },
      preparedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
      },
      preparedAt: { type: Date }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    serviceCharge: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    tableNumber: { type: String },
    roomNumber: { type: String },
    guestName: { type: String },
    guestPhone: { type: String },
    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String }
    },
    specialInstructions: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    kitchenNotes: { type: String },
    estimatedReadyTime: { type: Date },
    actualReadyTime: { type: Date },
    servedAt: { type: Date },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentMethod: { 
      type: String, 
      enum: ['cash', 'card', 'room_charge', 'voucher']
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
posOrderSchema.index({ hotelId: 1, orderNumber: 1 }, { unique: true });
posOrderSchema.index({ hotelId: 1, outletId: 1 });
posOrderSchema.index({ hotelId: 1, status: 1 });
posOrderSchema.index({ hotelId: 1, orderType: 1 });
posOrderSchema.index({ hotelId: 1, folioId: 1 });
posOrderSchema.index({ hotelId: 1, roomNumber: 1 });
posOrderSchema.index({ hotelId: 1, tableNumber: 1 });
posOrderSchema.index({ hotelId: 1, createdAt: 1 });

const POSOrder =
  (mongoose.models.POSOrder as mongoose.Model<IPOSOrder>) ||
  mongoose.model<IPOSOrder>("POSOrder", posOrderSchema);

export default POSOrder;














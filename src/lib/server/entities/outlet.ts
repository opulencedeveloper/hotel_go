import mongoose, { Schema } from "mongoose";

export interface IOutlet {
  _id: string;
  outletCode: string;
  name: string;
  type: 'restaurant' | 'bar' | 'spa' | 'gift_shop' | 'room_service' | 'cafe' | 'lounge' | 'pool_bar' | 'concierge' | 'business_center';
  location: string;
  floor: number;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'closed';
  settings: {
    taxRate: number;
    serviceCharge: number;
    autoCloseTime: string;
    openingHours: {
      [key: string]: { 
        open: string; 
        close: string; 
        closed: boolean;
        breakStart?: string;
        breakEnd?: string;
      };
    };
    posPrinterId?: string;
    kitchenPrinterId?: string;
    receiptPrinterId?: string;
    allowRoomCharge: boolean;
    requireManagerApproval: boolean;
    maxDiscountPercentage: number;
  };
  contact: {
    phone?: string;
    email?: string;
    extension?: string;
  };
  managerId?: mongoose.Types.ObjectId; // Staff member
  staffIds: mongoose.Types.ObjectId[]; // Staff members assigned to this outlet
  capacity?: number; // For restaurants/bars
  amenities: string[];
  images: string[];
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const outletSchema: Schema = new Schema(
  {
    outletCode: { type: String, required: true },
    name: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['restaurant', 'bar', 'spa', 'gift_shop', 'room_service', 'cafe', 'lounge', 'pool_bar', 'concierge', 'business_center']
    },
    location: { type: String, required: true },
    floor: { type: Number, required: true },
    description: { type: String },
    status: { 
      type: String, 
      required: true,
      enum: ['active', 'inactive', 'maintenance', 'closed'],
      default: 'active'
    },
    settings: {
      taxRate: { type: Number, default: 0, min: 0, max: 100 },
      serviceCharge: { type: Number, default: 0, min: 0, max: 100 },
      autoCloseTime: { type: String, default: '23:00' },
      openingHours: {
        type: Map,
        of: {
          open: { type: String, required: true },
          close: { type: String, required: true },
          closed: { type: Boolean, default: false },
          breakStart: { type: String },
          breakEnd: { type: String }
        }
      },
      posPrinterId: { type: String },
      kitchenPrinterId: { type: String },
      receiptPrinterId: { type: String },
      allowRoomCharge: { type: Boolean, default: true },
      requireManagerApproval: { type: Boolean, default: false },
      maxDiscountPercentage: { type: Number, default: 20, min: 0, max: 100 }
    },
    contact: {
      phone: { type: String },
      email: { type: String },
      extension: { type: String }
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    },
    staffIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    }],
    capacity: { type: Number, min: 1 },
    amenities: [{ type: String }],
    images: [{ type: String }],
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
outletSchema.index({ hotelId: 1, outletCode: 1 }, { unique: true });
outletSchema.index({ hotelId: 1, type: 1 });
outletSchema.index({ hotelId: 1, status: 1 });
outletSchema.index({ hotelId: 1, floor: 1 });
outletSchema.index({ hotelId: 1, managerId: 1 });

const Outlet =
  (mongoose.models.Outlet as mongoose.Model<IOutlet>) ||
  mongoose.model<IOutlet>("Outlet", outletSchema);

export default Outlet;







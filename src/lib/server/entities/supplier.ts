import mongoose, { Schema } from "mongoose";

export interface ISupplier {
  _id: string;
  supplierCode: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  taxId?: string;
  businessLicense?: string;
  paymentTerms: string; // e.g., "Net 30", "COD", "2/10 Net 30"
  creditLimit?: number;
  currentBalance: number;
  currency: string;
  categories: string[]; // What they supply
  rating: number; // 1-5 stars
  notes?: string;
  contactHistory: {
    date: Date;
    type: 'email' | 'phone' | 'meeting' | 'order';
    description: string;
    outcome?: string;
    nextFollowUp?: Date;
  }[];
  documents: {
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
  }[];
  status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
  lastOrderDate?: Date;
  totalOrders: number;
  totalValue: number;
  averageDeliveryTime: number; // in days
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema: Schema = new Schema(
  {
    supplierCode: { type: String, required: true },
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    website: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true }
    },
    billingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String }
    },
    taxId: { type: String },
    businessLicense: { type: String },
    paymentTerms: { type: String, required: true },
    creditLimit: { type: Number, min: 0 },
    currentBalance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    categories: [{ type: String }],
    rating: { type: Number, min: 1, max: 5, default: 3 },
    notes: { type: String },
    contactHistory: [{
      date: { type: Date, required: true },
      type: { 
        type: String, 
        enum: ['email', 'phone', 'meeting', 'order'],
        required: true 
      },
      description: { type: String, required: true },
      outcome: { type: String },
      nextFollowUp: { type: Date }
    }],
    documents: [{
      name: { type: String, required: true },
      type: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    }],
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'suspended', 'blacklisted'],
      default: 'active'
    },
    lastOrderDate: { type: Date },
    totalOrders: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 7 }, // in days
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
supplierSchema.index({ hotelId: 1, supplierCode: 1 }, { unique: true });
supplierSchema.index({ hotelId: 1, name: 1 });
supplierSchema.index({ hotelId: 1, email: 1 });
supplierSchema.index({ hotelId: 1, status: 1 });
supplierSchema.index({ hotelId: 1, categories: 1 });
supplierSchema.index({ hotelId: 1, rating: 1 });

const Supplier =
  (mongoose.models.Supplier as mongoose.Model<ISupplier>) ||
  mongoose.model<ISupplier>("Supplier", supplierSchema);

export default Supplier;






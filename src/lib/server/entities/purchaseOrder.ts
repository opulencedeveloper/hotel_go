import mongoose, { Schema } from "mongoose";

export interface IPurchaseOrder {
  _id: string;
  poNumber: string;
  supplierId: mongoose.Types.ObjectId;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled' | 'closed';
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  lineItems: {
    itemId: mongoose.Types.ObjectId;
    itemName: string;
    itemSku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    receivedQuantity: number;
    pendingQuantity: number;
    status: 'pending' | 'partial' | 'received' | 'cancelled';
    notes?: string;
  }[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    contactPerson: string;
    phone: string;
  };
  specialInstructions?: string;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  sentAt?: Date;
  receivedBy?: mongoose.Types.ObjectId;
  receivedAt?: Date;
  invoiceNumber?: string;
  invoiceDate?: Date;
  invoiceAmount?: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentDate?: Date;
  notes?: string;
  attachments: string[]; // File URLs
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderSchema: Schema = new Schema(
  {
    poNumber: { type: String, required: true },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    status: { 
      type: String, 
      required: true,
      enum: ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled', 'closed'],
      default: 'draft'
    },
    orderDate: { type: Date, required: true, default: Date.now },
    expectedDeliveryDate: { type: Date, required: true },
    actualDeliveryDate: { type: Date },
    lineItems: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryItem",
        required: true
      },
      itemName: { type: String, required: true },
      itemSku: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true, min: 0 },
      totalPrice: { type: Number, required: true, min: 0 },
      receivedQuantity: { type: Number, default: 0, min: 0 },
      pendingQuantity: { type: Number, required: true, min: 0 },
      status: { 
        type: String, 
        enum: ['pending', 'partial', 'received', 'cancelled'],
        default: 'pending'
      },
      notes: { type: String }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0, default: 0 },
    discountAmount: { type: Number, required: true, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },
    paymentTerms: { type: String, required: true },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      contactPerson: { type: String, required: true },
      phone: { type: String, required: true }
    },
    specialInstructions: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: { type: Date },
    sentAt: { type: Date },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    receivedAt: { type: Date },
    invoiceNumber: { type: String },
    invoiceDate: { type: Date },
    invoiceAmount: { type: Number, min: 0 },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending'
    },
    paymentDate: { type: Date },
    notes: { type: String },
    attachments: [{ type: String }],
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
purchaseOrderSchema.index({ hotelId: 1, poNumber: 1 }, { unique: true });
purchaseOrderSchema.index({ hotelId: 1, supplierId: 1 });
purchaseOrderSchema.index({ hotelId: 1, status: 1 });
purchaseOrderSchema.index({ hotelId: 1, orderDate: 1 });
purchaseOrderSchema.index({ hotelId: 1, expectedDeliveryDate: 1 });
purchaseOrderSchema.index({ hotelId: 1, createdBy: 1 });
purchaseOrderSchema.index({ hotelId: 1, paymentStatus: 1 });

const PurchaseOrder =
  (mongoose.models.PurchaseOrder as mongoose.Model<IPurchaseOrder>) ||
  mongoose.model<IPurchaseOrder>("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;












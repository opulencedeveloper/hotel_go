import mongoose, { Schema } from "mongoose";

export interface IInventoryItem {
  _id: string;
  sku: string;
  name: string;
  description: string;
  category: 'food' | 'beverage' | 'cleaning' | 'maintenance' | 'office' | 'linen' | 'amenities' | 'other';
  subcategory?: string;
  unit: 'piece' | 'kg' | 'liter' | 'box' | 'case' | 'roll' | 'sheet' | 'bottle' | 'can' | 'pack';
  quantityOnHand: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  sellingPrice?: number;
  supplierId?: mongoose.Types.ObjectId;
  supplierName?: string;
  supplierSku?: string;
  location: string; // Storage location
  shelf?: string;
  bin?: string;
  expiryDate?: Date;
  batchNumber?: string;
  serialNumber?: string;
  barcode?: string;
  images: string[];
  specifications?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    color?: string;
    material?: string;
    brand?: string;
    model?: string;
  };
  lastUpdated: Date;
  lastUpdatedBy: mongoose.Types.ObjectId;
  isPerishable: boolean;
  isHazardous: boolean;
  requiresRefrigeration: boolean;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryItemSchema: Schema = new Schema(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['food', 'beverage', 'cleaning', 'maintenance', 'office', 'linen', 'amenities', 'other']
    },
    subcategory: { type: String },
    unit: { 
      type: String, 
      required: true,
      enum: ['piece', 'kg', 'liter', 'box', 'case', 'roll', 'sheet', 'bottle', 'can', 'pack']
    },
    quantityOnHand: { type: Number, required: true, min: 0 },
    minStock: { type: Number, required: true, min: 0 },
    maxStock: { type: Number, required: true, min: 0 },
    reorderPoint: { type: Number, required: true, min: 0 },
    reorderQuantity: { type: Number, required: true, min: 1 },
    unitCost: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, min: 0 },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier"
    },
    supplierName: { type: String },
    supplierSku: { type: String },
    location: { type: String, required: true },
    shelf: { type: String },
    bin: { type: String },
    expiryDate: { type: Date },
    batchNumber: { type: String },
    serialNumber: { type: String },
    barcode: { type: String },
    images: [{ type: String }],
    specifications: {
      weight: { type: Number, min: 0 },
      dimensions: {
        length: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 }
      },
      color: { type: String },
      material: { type: String },
      brand: { type: String },
      model: { type: String }
    },
    lastUpdated: { type: Date, required: true, default: Date.now },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPerishable: { type: Boolean, default: false },
    isHazardous: { type: Boolean, default: false },
    requiresRefrigeration: { type: Boolean, default: false },
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
inventoryItemSchema.index({ hotelId: 1, sku: 1 }, { unique: true });
inventoryItemSchema.index({ hotelId: 1, category: 1 });
inventoryItemSchema.index({ hotelId: 1, subcategory: 1 });
inventoryItemSchema.index({ hotelId: 1, supplierId: 1 });
inventoryItemSchema.index({ hotelId: 1, location: 1 });
inventoryItemSchema.index({ hotelId: 1, quantityOnHand: 1 });
inventoryItemSchema.index({ hotelId: 1, expiryDate: 1 });
inventoryItemSchema.index({ hotelId: 1, barcode: 1 });

const InventoryItem =
  (mongoose.models.InventoryItem as mongoose.Model<IInventoryItem>) ||
  mongoose.model<IInventoryItem>("InventoryItem", inventoryItemSchema);

export default InventoryItem;












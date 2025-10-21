import mongoose, { Schema } from "mongoose";

export interface IPOSItem {
  _id: string;
  itemCode: string;
  name: string;
  description: string;
  category: 'food' | 'beverage' | 'service' | 'retail' | 'package' | 'promotion';
  subcategory?: string; // e.g., 'appetizer', 'main_course', 'dessert'
  price: number;
  cost: number; // Cost price for profit calculation
  available: boolean;
  image?: string;
  images: string[];
  modifiers: {
    modifierId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    required: boolean;
    maxSelections?: number;
  }[];
  ingredients: {
    ingredientId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    unit: string;
    cost: number;
  }[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  allergens: string[];
  preparationTime: number; // in minutes
  servingSize?: string;
  tags: string[]; // e.g., 'vegetarian', 'gluten-free', 'spicy'
  outletIds: mongoose.Types.ObjectId[]; // Which outlets can serve this item
  displayOrder: number;
  isPopular: boolean;
  isSeasonal: boolean;
  seasonalStartDate?: Date;
  seasonalEndDate?: Date;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const posItemSchema: Schema = new Schema(
  {
    itemCode: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['food', 'beverage', 'service', 'retail', 'package', 'promotion']
    },
    subcategory: { type: String },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    image: { type: String },
    images: [{ type: String }],
    modifiers: [{
      modifierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modifier"
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      required: { type: Boolean, default: false },
      maxSelections: { type: Number, min: 1 }
    }],
    ingredients: [{
      ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient"
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
      unit: { type: String, required: true },
      cost: { type: Number, required: true, min: 0 }
    }],
    nutritionalInfo: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
      fiber: { type: Number, min: 0 },
      sugar: { type: Number, min: 0 },
      sodium: { type: Number, min: 0 }
    },
    allergens: [{ type: String }],
    preparationTime: { type: Number, required: true, min: 0 },
    servingSize: { type: String },
    tags: [{ type: String }],
    outletIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet"
    }],
    displayOrder: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isSeasonal: { type: Boolean, default: false },
    seasonalStartDate: { type: Date },
    seasonalEndDate: { type: Date },
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
posItemSchema.index({ hotelId: 1, itemCode: 1 }, { unique: true });
posItemSchema.index({ hotelId: 1, category: 1 });
posItemSchema.index({ hotelId: 1, subcategory: 1 });
posItemSchema.index({ hotelId: 1, available: 1 });
posItemSchema.index({ hotelId: 1, outletIds: 1 });
posItemSchema.index({ hotelId: 1, isPopular: 1 });
posItemSchema.index({ hotelId: 1, tags: 1 });

const POSItem =
  (mongoose.models.POSItem as mongoose.Model<IPOSItem>) ||
  mongoose.model<IPOSItem>("POSItem", posItemSchema);

export default POSItem;







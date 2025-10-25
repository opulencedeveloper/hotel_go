import mongoose, { Schema, Types, Document } from "mongoose";
import { IInventory} from "./inteface";
import { InventoryCategory, InventoryUnit } from "./enum";

// Schema
const inventorySchema: Schema<IInventory> = new Schema(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(InventoryCategory),
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      enum: Object.values(InventoryUnit),
      trim: true,
    },
    costPerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: {
      type: String,
      trim: true,
    },
    storageLocation: {
      type: String,
      trim: true,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Inventory =
  (mongoose.models.Inventory as mongoose.Model<IInventory>) ||
  mongoose.model<IInventory>("Inventory", inventorySchema);

export default Inventory;

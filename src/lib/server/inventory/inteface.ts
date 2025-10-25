import { Document, Types } from "mongoose";
import { InventoryCategory, InventoryUnit } from "./enum";

export interface IInventory extends Document {
  hotelId: Types.ObjectId;
  itemName: string; // e.g., "Bath Towel", "Coffee", "Soap"
  category: InventoryCategory; // e.g., InventoryCategory.AMENITIES
  unit: InventoryUnit; // e.g., Unit.PIECES
  costPerUnit: number; // e.g., 10
  supplier?: string; // optional, e.g., "Supplier name"
  storageLocation?: string; // optional, e.g., "Housekeeping Storage"
  currentStock: number; // e.g., 0
  description?: string; // optional description
}

export interface IAddInventoryItems {
  items: {
    hotelId: Types.ObjectId;
    itemName: string; // e.g., "Bath Towel", "Coffee", "Soap"
    category: InventoryCategory; // e.g., InventoryCategory.AMENITIES
    unit: InventoryUnit; // e.g., Unit.PIECES
    costPerUnit: number; // e.g., 10
    supplier?: string; // optional, e.g., "Supplier name"
    storageLocation?: string; // optional, e.g., "Housekeeping Storage"
    currentStock: number; // e.g., 0
    description?: string; // optional description
  }[];
}

export interface IAddInventoryItemUserInput {
  items: {
    itemName: string;
    category: InventoryCategory;
    unit: InventoryUnit;
    costPerUnit: number;
    supplier?: string;
    storageLocation?: string;
    currentStock: number;
    description?: string;
  }[];
}

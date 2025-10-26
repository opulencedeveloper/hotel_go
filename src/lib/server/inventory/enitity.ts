import mongoose, { Schema } from "mongoose";
import { IInventory } from "./inteface";
import { InventoryCategory, InventoryUnit } from "./enum";

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
      index: true, // ✅ Useful for search and sorting
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(InventoryCategory),
      trim: true,
      index: true, // ✅ Used for grouping and filtering
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
      index: true, // ✅ Helpful if filtering by supplier
    },
    storageLocation: {
      type: String,
      trim: true,
      index: true, // ✅ Useful for sorting/filtering by storage
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
      index: true, // ✅ Often used in low-stock checks
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

/**
 * 🧠 Index Strategy
 *
 * These indexes are optimized for:
 * - Per-hotel inventory lookups
 * - Category-based aggregations
 * - Low-stock and recent update checks
 * - Searching or sorting by itemName
 */

// 1️⃣ Core per-hotel filter
inventorySchema.index({ hotelId: 1 });

// 2️⃣ For aggregations by category
inventorySchema.index({ hotelId: 1, category: 1 });

// 3️⃣ For low-stock queries
inventorySchema.index({ hotelId: 1, currentStock: 1 });

// 4️⃣ For recent updates (inventory history)
inventorySchema.index({ hotelId: 1, updatedAt: -1 });

// 5️⃣ For searching or sorting by item name
inventorySchema.index({ hotelId: 1, itemName: 1 });

// 6️⃣ Optional: to quickly find items by supplier per hotel
inventorySchema.index({ hotelId: 1, supplier: 1 });

const Inventory =
  (mongoose.models.Inventory as mongoose.Model<IInventory>) ||
  mongoose.model<IInventory>("Inventory", inventorySchema);

export default Inventory;



// import mongoose, { Schema, Types, Document } from "mongoose";
// import { IInventory} from "./inteface";
// import { InventoryCategory, InventoryUnit } from "./enum";

// // Schema
// const inventorySchema: Schema<IInventory> = new Schema(
//   {
//     hotelId: {
//       type: Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     itemName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: Object.values(InventoryCategory),
//       trim: true,
//     },
//     unit: {
//       type: String,
//       required: true,
//       enum: Object.values(InventoryUnit),
//       trim: true,
//     },
//     costPerUnit: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     supplier: {
//       type: String,
//       trim: true,
//     },
//     storageLocation: {
//       type: String,
//       trim: true,
//     },
//     currentStock: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Model
// const Inventory =
//   (mongoose.models.Inventory as mongoose.Model<IInventory>) ||
//   mongoose.model<IInventory>("Inventory", inventorySchema);

// export default Inventory;

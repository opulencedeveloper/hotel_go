import mongoose, { Schema } from "mongoose";
import { IMenu } from "./interface";
import { MenuStatus } from "./enum";

const menuSchema: Schema<IMenu> = new Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ Useful for search & autocomplete
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ Filter menus by category (e.g. Drinks, Main Course)
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true, // ✅ For sorting/filtering
    },
    prepTime: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(MenuStatus),
      trim: true,
      index: true, // ✅ “Available”, “Unavailable”, etc.
    },
    ingredients: {
      type: String,
      required: true,
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
 * - Optimize frequent filters like: hotel menus, available items, categories.
 * - Support search (text & filters) and fast dashboard queries.
 */

// 1️⃣ Hotel-level filtering
menuSchema.index({ hotelId: 1 });

// 2️⃣ Hotel + category filtering (e.g. “Starters in Hotel A”)
menuSchema.index({ hotelId: 1, category: 1 });

// 3️⃣ Hotel + status filtering (e.g. “Available” menus only)
menuSchema.index({ hotelId: 1, status: 1 });

// 4️⃣ Hotel + itemName (for searching a specific dish)
menuSchema.index({ hotelId: 1, itemName: 1 });

// 5️⃣ Optional: hotel + price for menu sorting
menuSchema.index({ hotelId: 1, price: 1 });

// 6️⃣ Text index (optional — for full-text search)
menuSchema.index({ itemName: "text", ingredients: "text" });

const Menu =
  (mongoose.models.Menu as mongoose.Model<IMenu>) ||
  mongoose.model<IMenu>("Menu", menuSchema);

export default Menu;



// import mongoose, { Schema } from "mongoose";
// import { IMenu } from "./interface";
// import { MenuStatus } from "./enum";

// const menuSchema: Schema = new Schema(
//   {
//     itemName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     hotelId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     prepTime: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: Object.values(MenuStatus),
//       trim: true,
//     },
//     ingredients: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Menu =
//   (mongoose.models.Menu as mongoose.Model<IMenu>) ||
//   mongoose.model<IMenu>("Menu", menuSchema);

// export default Menu;

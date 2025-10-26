import mongoose, { Schema } from "mongoose";
import { IInventoryLogs } from "./interface";
import { InventoryDestination } from "./enum";

const inventoryLogSchema = new Schema<IInventoryLogs>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
      trim: true,
      index: true, // ✅ per-staff activity queries
    },
    destination: {
      type: String,
      enum: Object.values(InventoryDestination),
      required: true,
      trim: true,
      index: true, // ✅ used for category reports
    },
    tableNumber: {
      type: String,
      trim: true,
      default: null,
      index: true, // ✅ useful for bar/restaurant tracking
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
      index: true, // ✅ for room service lookups
    },
    guestName: {
      type: String,
      trim: true,
      default: null,
      index: true, // ✅ searching by guest name (optional)
    },
    inventories: [
      {
        inventoryId: {
          type: Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
          index: true, // ✅ if you want to trace usage of an item
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/**
 * 🧠 Index Strategy
 *
 * These indexes help with:
 * - Filtering logs by hotel
 * - Tracking staff activity
 * - Generating reports by destination (Kitchen, Bar, RoomService)
 * - Quickly accessing room or table-related logs
 * - Getting recent transactions per hotel or staff
 */

// 1️⃣ Core hotel-level filter
inventoryLogSchema.index({ hotelId: 1 });

// 2️⃣ Logs per staff
inventoryLogSchema.index({ hotelId: 1, staffId: 1 });

// 3️⃣ Logs per destination (e.g. Kitchen, Bar)
inventoryLogSchema.index({ hotelId: 1, destination: 1 });

// 4️⃣ Logs by room for room service
inventoryLogSchema.index({ hotelId: 1, roomId: 1 });

// 5️⃣ Recent logs per hotel (for dashboard feeds)
inventoryLogSchema.index({ hotelId: 1, createdAt: -1 });

// 6️⃣ Optional — to analyze item usage trends
inventoryLogSchema.index({ hotelId: 1, "inventories.inventoryId": 1 });

const InventoryLogs =
  (mongoose.models.InventoryLogs as mongoose.Model<IInventoryLogs>) ||
  mongoose.model<IInventoryLogs>("InventoryLogs", inventoryLogSchema);

export default InventoryLogs;



// import mongoose, { Schema, Types } from "mongoose";
// import { IInventoryLogs } from "./interface";
// import { InventoryDestination } from "./enum";

// const inventoryLogSchema = new Schema<IInventoryLogs>(
//   {
//     hotelId: {
//       type: Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//       trim: true,
//     },
//     staffId: {
//       type: Schema.Types.ObjectId,
//       ref: "Staff",
//       required: true,
//       trim: true,
//     },
//     destination: {
//       type: String,
//       enum: Object.values(InventoryDestination),
//       required: true,
//       trim: true,
//     },
//     tableNumber: {
//       type: String,
//       trim: true,
//       default: null,
//     },
//     roomId: {
//       type: Schema.Types.ObjectId,
//       ref: "Room",
//       default: null,
//     },
//     guestName: {
//       type: String,
//       trim: true,
//       default: null, // ✅ Optional
//     },
//     inventories: [
//       {
//         inventoryId: {
//           type: Schema.Types.ObjectId,
//           ref: "Inventory",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//       },
//     ],
//     notes: {
//       type: String,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// const InventoryLogs =
//   (mongoose.models.InventoryLogs as mongoose.Model<IInventoryLogs>) ||
//   mongoose.model<IInventoryLogs>("InventoryLogs", inventoryLogSchema);

// export default InventoryLogs;

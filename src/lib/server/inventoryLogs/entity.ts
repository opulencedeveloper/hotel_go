import mongoose, { Schema, Types } from "mongoose";
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
    },
    destination: {
      type: String,
      enum: Object.values(InventoryDestination),
      required: true,
      trim: true,
    },
    tableNumber: {
      type: String,
      trim: true,
      default: null,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    guestName: {
      type: String,
      trim: true,
      default: null, // ✅ Optional
    },
    inventories: [
      {
        inventoryId: {
          type: Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
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

const InventoryLogs =
  (mongoose.models.InventoryLogs as mongoose.Model<IInventoryLogs>) ||
  mongoose.model<IInventoryLogs>("InventoryLogs", inventoryLogSchema);

export default InventoryLogs;

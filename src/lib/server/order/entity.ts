import mongoose, { Schema } from "mongoose";
import { OrderStatus, OrderType } from "./enum";
import { IOrder, IOrderItem } from "./interface";
import { PaymentMethod } from "@/utils/enum";

// Embedded order items
const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
      index: true, // ✅ enables item-level lookups/joins
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceWhenOrdered: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
      index: true, // ✅ helpful for room-service lookups
    },
    orderType: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
      trim: true,
      index: true,
    },
    tableNumber: {
      type: String,
      trim: true,
      default: null,
      index: true, // ✅ useful for dine-in orders
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      trim: true,
      index: true, // ✅ critical for dashboards & workflows
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: null,
      trim: true,
      index: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

/**
 * 🧠 Index Strategy
 *
 * These compound indexes cover the main operational queries:
 * - Get orders by hotel and status
 * - Filter by order type (room, dine-in, takeaway)
 * - Show recent orders or analytics by date
 * - Payment analytics (method breakdowns)
 * - Faster room-service & staff dashboards
 */

// 1️⃣ Hotel-level lookup
OrderSchema.index({ hotelId: 1 });

// 2️⃣ Filter by hotel + status (used in dashboard overviews)
OrderSchema.index({ hotelId: 1, status: 1 });

// 3️⃣ Filter by hotel + orderType (room vs restaurant)
OrderSchema.index({ hotelId: 1, orderType: 1 });

// 4️⃣ Payment analytics (by hotel & payment method)
OrderSchema.index({ hotelId: 1, paymentMethod: 1 });

// 5️⃣ Recent orders (sorted by updatedAt)
OrderSchema.index({ hotelId: 1, updatedAt: -1 });

// 6️⃣ Date range queries for analytics (efficient date filtering)
OrderSchema.index({ hotelId: 1, createdAt: -1 });

// 7️⃣ Room-service filtering
OrderSchema.index({ hotelId: 1, roomId: 1, status: 1 });

// 8️⃣ Table-based restaurant orders
OrderSchema.index({ hotelId: 1, tableNumber: 1, status: 1 });

export const Order =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);


// import mongoose, { Schema } from "mongoose";
// import { OrderStatus, OrderType } from "./enum";
// import { IOrder, IOrderItem } from "./interface";
// import { PaymentMethod } from "@/utils/enum";

// const OrderItemSchema = new Schema<IOrderItem>(
//   {
//     menuId: {
//       type: Schema.Types.ObjectId,
//       ref: "Menu",
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//     priceWhenOrdered: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//   },
//   { _id: false } // prevent creating separate _id for each subitem
// );

// const OrderSchema = new Schema<IOrder>(
//   {
//     hotelId: {
//       type: Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//     },
//     roomId: {
//       type: Schema.Types.ObjectId,
//       ref: "Room",
//       required: false, // ✅ optional, only for hotel guest orders
//     },
//     orderType: {
//       type: String,
//       enum: Object.values(OrderType),
//       required: true,
//       trim: true,
//     },
//     tableNumber: {
//       type: String,
//       trim: true,
//       required: false, // ✅ optional for restaurant/walk-in orders
//     },
//     items: {
//       type: [OrderItemSchema],
//       required: true, // ✅ at least one item
//     },
//      status: {
//       type: String,
//       enum: Object.values(OrderStatus),
//       default: OrderStatus.PENDING,
//       trim: true,
//     },
//    paymentMethod: {
//       type: String,
//       enum: Object.values(PaymentMethod),
//       default: null,
//       trim: true,
//     },
//     discount: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     tax: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//   },
//   { timestamps: true }
// );

// export const Order =
//   mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

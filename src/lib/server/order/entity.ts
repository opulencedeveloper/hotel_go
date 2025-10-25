import mongoose, { Schema } from "mongoose";
import { OrderStatus, OrderType } from "./enum";
import { IOrder, IOrderItem } from "./interface";
import { PaymentMethod } from "@/utils/enum";

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
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
  { _id: false } // prevent creating separate _id for each subitem
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
      required: false, // ✅ optional, only for hotel guest orders
    },
    orderType: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
      trim: true,
    },
    tableNumber: {
      type: String,
      trim: true,
      required: false, // ✅ optional for restaurant/walk-in orders
    },
    items: {
      type: [OrderItemSchema],
      required: true, // ✅ at least one item
    },
     status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      trim: true,
    },
   paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: null,
      trim: true,
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

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

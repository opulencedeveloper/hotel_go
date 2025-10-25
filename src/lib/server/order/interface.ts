import { Types } from "mongoose";
import { OrderStatus, OrderType } from "./enum";
import { PaymentMethod } from "../stay/enum";

export interface IOrderItem {
  menuId: Types.ObjectId;
  quantity: number;
  priceWhenOrdered: number;
}

export interface IOrderItemUserInput {
  menuId: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  hotelId: Types.ObjectId;
  roomId?: Types.ObjectId;
  orderType: OrderType;
  tableNumber?: string;
  status: OrderStatus;
  items: IOrderItem[];
   paymentMethod?: PaymentMethod;
  discount?: number;
  tax?: number;
}

export interface ICreateOrderInput {
  hotelId: Types.ObjectId;
  tableNumber?: string;
  roomId?: Types.ObjectId;
  orderType: OrderType;
  items: IOrderItem[];
  discount?: number;
  tax?: number;
}

export interface ICreateOrderUserInput {
  roomNumber?: string;
  tableNumber?: string;
  orderType: OrderType;
  items: IOrderItemUserInput[];
}

export interface IUpdateOrderStatus {
  status: OrderStatus;
  orderId: Types.ObjectId
  paymentMethod?: PaymentMethod;
}
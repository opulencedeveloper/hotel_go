import { PaymentMethod } from "@/utils/enum";
import { Document, Types } from "mongoose";
import { PaymentStatus } from "../stay/enum";

export interface IScheduledService extends Document {
  hotelServiceId: Types.ObjectId;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  hotelId: Types.ObjectId;
  scheduledAt: Date;
  notes?: string;
}
export interface ICreateScheduledServiceUserInput {
  hotelServiceId: Types.ObjectId;
  paymentMethod: PaymentMethod;
  scheduledAt: Date;
  notes?: string;
}

export interface ICreateScheduledServiceInput {
  hotelId: Types.ObjectId;
  hotelServiceId: Types.ObjectId;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  scheduledAt: Date;
  notes?: string;
}

export interface IEditScheduledServiceUserInput {
  scheduledServiceId: string;
  hotelId: Types.ObjectId;
  hotelServiceId: Types.ObjectId;
  scheduledAt: Date;
  notes?: string;
}

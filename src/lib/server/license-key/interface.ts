import { Document, Types } from "mongoose";
import { PaymentStatus } from "@/utils/enum";

export interface ILicence extends Document {
   _id: Types.ObjectId;
  userId?: Types.ObjectId;
  planId: Types.ObjectId;
  email: string;
  expiresAt?: Date;
  licenceKey?: string;
  paymentStatus: PaymentStatus;
  billingPeriod?: "yearly" | "quarterly" | null;
  flutterwaveTransactionId?: string | null;
}

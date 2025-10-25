import { Document, Types } from "mongoose";

export interface IScheduledService extends Document {
  hotelServiceId: Types.ObjectId;
  hotelId: Types.ObjectId;
  scheduledAt: Date;
  notes?: string;
}
export interface ICreateScheduledServiceUserInput {
  hotelServiceId: Types.ObjectId;
  scheduledAt: Date;
  notes?: string;
}

export interface ICreateScheduledServiceInput {
  hotelId: Types.ObjectId;
  hotelServiceId: Types.ObjectId;
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

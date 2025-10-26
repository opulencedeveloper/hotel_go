import { Document, Types } from "mongoose";
import { PaymentMethod, PaymentStatus, StayStatus, StayType } from "./enum";

export interface IStay extends Document {
  roomId: Types.ObjectId;
  hotelId: Types.ObjectId;
  paymentDate: Date;
  guestName: string;
  phoneNumber: string;
  emailAddress?: string;
  address: string;
  paymentMethod: PaymentMethod;
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  specialRequests?: string;
  status: StayStatus;
  type: StayType;
  paymentStatus: PaymentStatus;
  totalAmount?: number;
  paidAmount?: number;
}


export interface IAddStayInput {
  roomId: Types.ObjectId;
  hotelId: Types.ObjectId;
  paymentDate: Date;
  guestName: string;
  phoneNumber: string;
  emailAddress?: string;
  address: string;
  paymentMethod: PaymentMethod;
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  specialRequests?: string;
  status: StayStatus;
  type: StayType;
  paymentStatus: PaymentStatus;     
}

export interface IAddStayUserInput {
   roomId: Types.ObjectId;
  paymentDate: Date;
  guestName: string;
  phoneNumber: string;
  emailAddress?: string;
  address: string;
  paymentMethod: PaymentMethod;
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  specialRequests?: string;
  type: StayType;       
}

export interface IEditStayUserInput {
  stayId: string,
  guestName: string;
  paymentStatus?: PaymentStatus;
  phoneNumber: string;
  emailAddress?: string;
  specialRequests?: string;
  status: StayStatus;
}
import { Document, Types } from "mongoose";
import { HotelServiceCategory, HotelServiceStatus } from "./enum";

export interface IHotelService extends Document {
  name: string;
  category: HotelServiceCategory;
  price: number;
  capacity: number;
  description: string;
  location: string;
  status: HotelServiceStatus;
}

export interface ICreateHotelServiceUserInput {
  name: string;
  category: HotelServiceCategory;
  price: number;
  capacity: number;
  description: string;
  location: string;
  status: HotelServiceStatus;
}

export interface ICreateHotelServiceInput {
  hotelId: Types.ObjectId;
  name: string;
  status: HotelServiceStatus;
  category: HotelServiceCategory;
  price: number;
  capacity: number;
  description: string;
  location: string;
}

export interface IEditHotelServiceUserInput {
  hotelServiceId: string,
  name: string;
  category: HotelServiceCategory;
  price: number;
  capacity: number;
  description: string;
  location: string;
  status: HotelServiceStatus;
}
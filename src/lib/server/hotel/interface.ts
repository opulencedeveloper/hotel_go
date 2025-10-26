import { UserRole } from "@/utils/enum";
import { Document, Types } from "mongoose";

export interface IHotel extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  hotelName: string;
  description: string;
  email: string;
  phoneNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  amenities?: string[];
  postalCode: string;
  licenseKeyId: Types.ObjectId;
  ownerId: Types.ObjectId;
  currency: string;
  agreeToTerms: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHotelRegistrationUserInput {
  hotelName: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  userRole: UserRole;
  country: string;
  state: string;
  city: string;
  // countryCode: string;
  postalCode: string;
  phone: string;
  currency: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface IHotelRegistrationInput {
  hotelName: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  address: string;
  currency: string;
  ownerId: Types.ObjectId;
  agreeToTerms: boolean;
  postalCode: string;
}

export interface ISuperAdminRegistraionInput {
  email: string;
  hotelId?: Types.ObjectId;
  password: string;
  firstName: string;
  lastName: string;
}

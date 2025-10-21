import { Document, Types } from "mongoose";
import { UserRole } from "./enum";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userRole: UserRole;
  hotelId?: Types.ObjectId;
  isActive: boolean;
  emailVerified: boolean;
  emailVerificationOtp?: string;
  emailVerificationOtpExpiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

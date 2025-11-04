import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

import { MessageResponse } from "./enum";
import { UserRole } from "../user/enum";
import { NextResponse } from "next/server";

export interface ISendEmail {
  receiverEmail: string;
  subject: string;
  emailTemplate: string;
}

export interface CustomRequest {
  userId?: Types.ObjectId;
  ownerId?: Types.ObjectId;
  hotelId?: Types.ObjectId;
  userRole?: UserRole;
  query?: Record<string, any>;
  params?: Record<string, any>;
  user?: any;
}

export interface CustomHttpResponse {
  status: number;
  message: MessageResponse;
  description: string;
  data: any;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
  userRole: string;
}

export type Handler = (req: Request) => Promise<NextResponse<any>>;


export interface IOTP {
  email: string;
  otp: string;
}

export interface IValidateEmail {
  email: string;
}

export interface IVerificationEmail extends IOTP {
  firstName: string;
  expiryTime: string;
}


export type IVerifyEmail = IOTP;

export interface IForgotPasswordEmail {
  otp: string;
  firstName: string;
  email: string;
  expiryTime: string;
}

export interface ILicenseKeyEmail {
  email: string;
  firstName?: string;
  licenseKey: string;
  planName: string;
  expiresAt: Date;
  billingPeriod: 'yearly' | 'quarterly';
}

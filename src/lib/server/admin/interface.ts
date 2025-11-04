import { Document, Types } from "mongoose";
import { AdminRole } from "./enum";

export interface IAdmin extends Document {
  email: string;
  password: string;
  adminRole: AdminRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateAdmin {
  email: string;
  password: string;
}

export interface IAdminLogin {
  email: string;
  password: string;
}
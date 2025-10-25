import { Document, Types } from "mongoose";
import { StaffRole, StaffShift, StaffStatus } from "./enum";

export interface IStaff extends Document {
  hotelId: Types.ObjectId;
  firstName: string;
  lastName: string;
  dashboardAccessPassword?: string;
  hasPassword?: boolean;
  middleName?: string;
  status: StaffStatus;
  email: string;
  phoneNumber: string;
  userRole: StaffRole;
  salary: number;
  shift: StaffShift;
  country: string;
  stateOrProvince: string;
  city: string;
  postalCode?: string;
  address: string;
}

export interface ICreateStaffInput {
  hotelId: Types.ObjectId;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber: string;
  userRole: StaffRole;
  salary: number;
  shift: StaffShift;
  country: string;
  stateOrProvince: string;
  city: string;
  postalCode?: string;
  address: string;
}

export interface ICreateStaffUserInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber: string;
  userRole: StaffRole;
  salary: number;
  shift: StaffShift;
  country: string;
  stateOrProvince: string;
  city: string;
  postalCode?: string;
  address: string;
}

export interface IEditStaffUserInput {
  staffId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber: string;
  userRole: StaffRole;
  salary: number;
  shift: StaffShift;
  country: string;
  stateOrProvince: string;
  city: string;
  postalCode?: string;
  address: string;
  status: StaffStatus;
}

export interface ICreateStaffPasswordUserInput {
password: string;
staffId: string;
}
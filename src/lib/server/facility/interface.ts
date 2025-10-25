import { Document, Types } from "mongoose";
import { FacilityStatus } from "./enum";

export interface IFacility extends Document {
  hotelId: Types.ObjectId;
  facilityName: string;
  category: string;
  location: string;
  floor: number;
  capacity: number;
  status: FacilityStatus;
  description: string;
}

export interface ICreateFacilityInput {
  hotelId: Types.ObjectId;
  facilityName: string;
  category: string;
  location: string;
  floor: number;
  capacity: number;
  status: FacilityStatus;
  description: string;
}

export interface ICreateFacilityUserInput {
  facilityName: string;
  category: string;
  location: string;
  floor: number;
  capacity: number;
  status: FacilityStatus;
  description: string;
}

export interface IEditFacilityUserInput {
  facilityId: Types.ObjectId;
  facilityName: string;
  category: string;
  location: string;
  floor: number;
  capacity: number;
  status: FacilityStatus;
  description: string;
}

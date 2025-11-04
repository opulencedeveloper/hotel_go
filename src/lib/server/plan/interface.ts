import { Document } from "mongoose";
import { PlanName } from "./enum";

export interface IPrice {
  quarterly?: number;
  yearly?: number;
}

export interface IPlan extends Document {
  name: PlanName;
  price: IPrice | null; // ✅ can be null
  rooms: string;
  multiProperty: boolean;
  description: string;
  features: string[];
  popular: boolean;
}

export interface ICreatePlan {
  name: PlanName;
  price: IPrice | null; // ✅ can be null
  rooms: string;
  multiProperty: boolean;
  description: string;
  features: string[];
  popular: boolean;
}

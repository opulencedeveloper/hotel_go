import { Types, Document } from "mongoose";
import { InventoryDestination } from "./enum";

export interface IInventoryItem {
  inventoryId: Types.ObjectId;
  quantity: number;
}

export interface IInventoryLogs extends Document {
  _id: Types.ObjectId;
  hotelId: Types.ObjectId;
  staffId: Types.ObjectId;
  destination: InventoryDestination;
  tableNumber?: string;
  roomId?: Types.ObjectId;
  guestName?: string; // ✅ Optional field
  inventories: IInventoryItem[];
  notes?: string;
}

export interface ICreateInventoryInventoryLogsInput {
  hotelId: Types.ObjectId;
  staffId: Types.ObjectId;
  destination: InventoryDestination;
  tableNumber?: string;
  roomId?: Types.ObjectId;
  guestName?: string; // ✅ Optional field
  inventories: IInventoryItem[];
  notes?: string;
}

export interface ICreateInventoryInventoryLogsUserInput {
  staffId: Types.ObjectId;
  destination: InventoryDestination;
  tableNumber?: string;
  roomNumber?: string;
  guestName?: string; // ✅ Optional field
  inventories: IInventoryItem[];
  notes?: string;
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomSliceParams } from "@/types/room-management/room-management";
import { OrderStatus } from "@/lib/server/order/enum";
import { OrderType } from "@/utils/enum";

/* ------------------- Stay Interfaces ------------------- */
export interface StayRoom {
  _id: string;
  roomNumber: string;
  roomTypeId: string;
}

export interface StaySliceParams {
  _id: string;
  roomId: StayRoom;
  guestName: string;
  emailAddress?: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  specialRequests?: string;
  status: string;
  type: string;
  totalAmount?: number;
  paidAmount?: number;
  discount?: number | null;
  serviceCharge?: number | null;
  tax?: number | null;
  reatedAt: string;
  updatedAt: string;
}

/* ------------------- Order Interfaces ------------------- */
export interface OrderItem {
  menuId: {
    _id: string;
    itemName: string;
    category: string;
    ingredients: string;
  };
  quantity: number;
  priceWhenOrdered: number;
}

export interface Order {
  _id: string;
  hotelId: string;
  items: OrderItem[];
  orderType: OrderType;
  tableNumber?: string;
  paymentMethod?: string;
  roomId?: string;
  status: OrderStatus;
  discount?: number;
  tax?: number;
  createdAt: string;
  updatedAt: string;
}

/* ------------------- Analytics State ------------------- */
export interface AnalyticsState {
  fetchedRooms: boolean;
  hotelRooms: RoomSliceParams[];
  stays: StaySliceParams[];
  orders: Order[];
  fetchedStays: boolean;
  fetchedOrders: boolean;
}

const initialState: AnalyticsState = {
  fetchedRooms: false,
  hotelRooms: [],
  stays: [],
  orders: [],
  fetchedStays: false,
  fetchedOrders: false,
};

/* ------------------- Slice ------------------- */
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    /* -------- Setters Only -------- */
    setRooms: (state, action: PayloadAction<RoomSliceParams[]>) => {
      state.fetchedRooms = true;
      state.hotelRooms = action.payload;
    },

    setStays: (state, action: PayloadAction<StaySliceParams[]>) => {
      state.fetchedStays = true;
      state.stays = action.payload;
    },

    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.fetchedOrders = true;
      state.orders = action.payload;
    },
  },
});

export const analyticsActions = analyticsSlice.actions;
export default analyticsSlice;

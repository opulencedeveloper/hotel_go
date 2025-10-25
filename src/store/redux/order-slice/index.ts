import { OrderStatus } from "@/lib/server/order/enum";
import { OrderType } from "@/utils/enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the OrderItem type
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

// Define the Order type
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

// Define the OrderState type
export interface OrderState {
  orders: Order[];
  fetchedData: boolean;
}

const initialState: OrderState = {
  orders: [],
  fetchedData: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Set all orders
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.fetchedData = true;
      state.orders = action.payload;
    },

    // Add a new order
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },

    // Update an existing order
    updateOrder: (state, action: PayloadAction<Order>) => {
      const updated = action.payload;
      state.orders = state.orders.map((order) =>
        order._id === updated._id ? { ...order, ...updated } : order
      );
    },

    // Delete an order by ID
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((order) => order._id !== action.payload);
    },
  },
});

export const orderActions = orderSlice.actions;
export default orderSlice;

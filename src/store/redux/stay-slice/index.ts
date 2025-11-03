import { PaymentStatus } from "@/utils/enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Room inside a stay
export interface StayRoom {
  _id: string;
  roomNumber: string;
  roomTypeId: string;
}

// Full stay object
export interface StaySliceParams {
  _id: string;
  roomId: StayRoom;
  guestName: string;
  emailAddress?: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
  roomRateAtPayment?: number | null;
  paymentStatus: PaymentStatus;
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
}

// Redux state shape
export interface StayState {
  stays: StaySliceParams[];
  fetchedData: boolean;
}

// Initial state
const initialState: StayState = {
  stays: [],
  fetchedData: false,
};

// Slice
const staySlice = createSlice({
  name: "stay",
  initialState,
  reducers: {
    // Sets the entire stays array (e.g., from backend fetch)
    setStays: (state, action: PayloadAction<StaySliceParams[]>) => {
      state.fetchedData = true;
      state.stays = action.payload;
    },

    // Adds a new stay
    addStay: (state, action: PayloadAction<StaySliceParams>) => {
      state.stays.push(action.payload);
    },

    // Updates a stay if it exists
    updateStay: (state, action: PayloadAction<StaySliceParams>) => {
      const updatedStay = action.payload;
      state.stays = state.stays.map((stay) =>
        stay._id === updatedStay._id ? { ...stay, ...updatedStay } : stay
      );
    },

    // Deletes a stay by ID
    deleteStay: (state, action: PayloadAction<string>) => {
      state.stays = state.stays.filter((stay) => stay._id !== action.payload);
    },

    reset: () => initialState,
  },
});

export const stayActions = staySlice.actions;
export default staySlice;

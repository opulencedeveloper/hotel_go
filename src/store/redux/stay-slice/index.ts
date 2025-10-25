import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for room type and room inside a stay
export interface StayRoomType {
  _id: string;
  name: string;
}

export interface StayRoom {
  _id: string;
  roomNumber: string;
  roomTypeId: StayRoomType;
  roomStatus?: string;
}

export interface StaySliceParams {
  _id: string;
  hotelId: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface StayState {
  stays: StaySliceParams[]; // updated to array
  fetchedData: boolean;
}

const initialState: StayState = {
  stays: [],
  fetchedData: false,
};

const staySlice = createSlice({
  name: "stay",
  initialState,
  reducers: {
    setStays: (state, action: PayloadAction<StaySliceParams[]>) => {
      state.fetchedData = true;
      state.stays = action.payload;
    },
    addStay: (state, action: PayloadAction<StaySliceParams>) => {
      state.stays.push(action.payload);
    },
    updateStay: (state, action: PayloadAction<StaySliceParams>) => {
      const updatedStay = action.payload;
      state.stays = state.stays.map((stay) => {
        console.log(stay._id === updatedStay._id);
       return stay._id === updatedStay._id ? { ...stay, ...updatedStay } : stay }
      );
    },
    deleteStay: (state, action: PayloadAction<string>) => {
      state.stays = state.stays.filter((stay) => stay._id !== action.payload);
    },
  },
});

export const stayActions = staySlice.actions;
export default staySlice;

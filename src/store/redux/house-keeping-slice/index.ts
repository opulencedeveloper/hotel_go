import { HouseKeepingStatus, StaffRole } from "@/utils/enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Staff type
export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userRole: StaffRole;
}

// Define the Room type
export interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
}

// Define the HouseKeeping type
export interface HouseKeeping {
  _id: string;
  createdAt: string;
  description?: string;
  roomIds: Room[]; // 👈 updated to array
  status: HouseKeepingStatus;
  staffIds: Staff[];
  title: string;
}

// Define the HouseKeepingState type
export interface HouseKeepingState {
  houseKeepings: HouseKeeping[];
  fetchedData: boolean;
}

// Initial state
const initialState: HouseKeepingState = {
  houseKeepings: [],
  fetchedData: false,
};

const houseKeepingSlice = createSlice({
  name: "housekeeping",
  initialState,
  reducers: {
    // Set all housekeeping records
    setHouseKeepings: (state, action: PayloadAction<HouseKeeping[]>) => {
      state.fetchedData = true;
      console.log("action.payloadaction.payload", action.payload)
      state.houseKeepings = action.payload;
    },

    // Add a new housekeeping record
    addHouseKeeping: (state, action: PayloadAction<HouseKeeping>) => {
      state.houseKeepings.unshift(action.payload); // add to start
    },

    // Update an existing housekeeping record
    updateHouseKeeping: (state, action: PayloadAction<HouseKeeping>) => {
      const updated = action.payload;
      state.houseKeepings = state.houseKeepings.map((hk) =>
        hk._id === updated._id ? { ...hk, ...updated } : hk
      );
    },

    // Delete a housekeeping record by ID
    deleteHouseKeeping: (state, action: PayloadAction<string>) => {
      state.houseKeepings = state.houseKeepings.filter(
        (hk) => hk._id !== action.payload
      );
    },
  },
});

export const houseKeepingActions = houseKeepingSlice.actions;
export default houseKeepingSlice;

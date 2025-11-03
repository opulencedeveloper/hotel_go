import { HouseKeepingStatus, StaffRole } from "@/utils/enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userRole: StaffRole;
}

// 🏨 Room Type
export interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
}

// 🏗️ Facility Type
export interface Facility {
  _id: string;
  facilityName: string;
  category: string;
  location: string;
  floor: number;
  capacity: number;
  status: string;
}

// 🧹 HouseKeeping Type
export interface HouseKeeping {
  _id: string;
  createdAt: string;
  title: string;
  description?: string;
  status: HouseKeepingStatus;
  roomIds: Room[]; // optional but always array
  facilityIds: Facility[]; // ✅ new field added
  staffIds: Staff[];
}

// 🗂️ HouseKeeping State
export interface HouseKeepingState {
  houseKeepings: HouseKeeping[];
  fetchedData: boolean;
}

// 🏁 Initial State
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

    reset: () => initialState,
  },
});

export const houseKeepingActions = houseKeepingSlice.actions;
export default houseKeepingSlice;

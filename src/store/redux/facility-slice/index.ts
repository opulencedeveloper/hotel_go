import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Facility type
export interface Facility {
  _id: string;
  facilityName: string;
  description: string;
  category: string;
  location: string;
  capacity: number;
  floor: number;
  status: string;
  hotelId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the FacilityState type
export interface FacilityState {
  facilities: Facility[];
  fetchedData: boolean;
}

const initialState: FacilityState = {
  facilities: [],
  fetchedData: false,
};

const facilitySlice = createSlice({
  name: "facility",
  initialState,
  reducers: {
    // Set all facilities
    setFacilities: (state, action: PayloadAction<Facility[]>) => {
      state.fetchedData = true;
      state.facilities = action.payload;
    },

    // Add a new facility
    addFacility: (state, action: PayloadAction<Facility>) => {
      state.facilities.push(action.payload);
    },

    // Update an existing facility
    updateFacility: (state, action: PayloadAction<Facility>) => {
      const updated = action.payload;
      state.facilities = state.facilities.map((facility) =>
        facility._id === updated._id ? { ...facility, ...updated } : facility
      );
    },

    // Delete a facility by ID
    deleteFacility: (state, action: PayloadAction<string>) => {
      state.facilities = state.facilities.filter(
        (facility) => facility._id !== action.payload
      );
    },

    reset: () => initialState,
  },
});

export const facilityActions = facilitySlice.actions;
export default facilitySlice;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Hotel Service interface
export interface HotelService {
  _id: string;
  name: string;
  category: string;
  location: string;
  capacity: number;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Define slice state
export interface HotelServicesState {
  allHotelServices: HotelService[];
  fetchedData: boolean;
}

const initialState: HotelServicesState = {
  allHotelServices: [],
  fetchedData: false,
};

const hotelServicesSlice = createSlice({
  name: "hotelServices",
  initialState,
  reducers: {
    // Set all hotel services (bulk fetch)
    setHotelServices: (state, action: PayloadAction<HotelService[]>) => {
      state.allHotelServices = action.payload;
      state.fetchedData = true;
    },

    // Add a new service
    addHotelService: (state, action: PayloadAction<HotelService>) => {
      state.allHotelServices.push(action.payload);
    },

    // Update existing service
    updateHotelService: (state, action: PayloadAction<HotelService>) => {
      const updated = action.payload;
      state.allHotelServices = state.allHotelServices.map((s) =>
        s._id === updated._id ? { ...s, ...updated } : s
      );
    },

    // Delete a service by ID
    deleteHotelService: (state, action: PayloadAction<string>) => {
      state.allHotelServices = state.allHotelServices.filter((s) => s._id !== action.payload);
    },
    reset: () => initialState,
  },
});

export const hotelServicesActions = hotelServicesSlice.actions;
export default hotelServicesSlice;

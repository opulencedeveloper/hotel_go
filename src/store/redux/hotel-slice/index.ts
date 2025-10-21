import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HotelSliceParams, HotelState } from "@/types/hotel";

const initialState: HotelState = {
  hotels: [],
  selectedHotelId: null,
};

const hotelSlice = createSlice({
  name: "Hotel",
  initialState,
  reducers: {
    setHotels: (state, action: PayloadAction<HotelSliceParams[]>) => {
      state.hotels = action.payload;

      if (action.payload.length > 0) {
        state.selectedHotelId = action.payload[0]._id;
      }
    },

    selectHotel: (state, action: PayloadAction<string>) => {
      state.selectedHotelId = action.payload;
    },

    updateAmenities: (state, action: PayloadAction<string[]>) => {
      if (!state.selectedHotelId) return;

      const selectedHotel = state.hotels.find(
        (hotel) => hotel._id === state.selectedHotelId
      );

      if (selectedHotel) {
        selectedHotel.amenities = action.payload;
      }
    },
  },
});

export const hotelActions = hotelSlice.actions;
export default hotelSlice;

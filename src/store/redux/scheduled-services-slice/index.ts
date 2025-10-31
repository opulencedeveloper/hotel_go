import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HotelService } from "../hotel-services-slice";
import { PaymentMethod, PaymentStatus } from "@/utils/enum";

// Define Scheduled Service interface
export interface ScheduledService {
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  _id: string;
  hotelId: string;
  hotelServiceId: HotelService; // Populated service object
  note: string;
  scheduledAt: string; // e.g. "2025-10-23T14:55:00.000Z"
  createdAt: string;
}

// Define slice state
export interface ScheduledServicesState {
  allScheduledServices: ScheduledService[];
  fetchedData: boolean;
}

const initialState: ScheduledServicesState = {
  allScheduledServices: [],
  fetchedData: false,
};

const scheduledServicesSlice = createSlice({
  name: "scheduledServices",
  initialState,
  reducers: {
    // Set all scheduled services (bulk fetch)
    setScheduledServices: (
      state,
      action: PayloadAction<ScheduledService[]>
    ) => {
      state.allScheduledServices = action.payload;
      state.fetchedData = true;
    },

    // Add a new scheduled service
    addScheduledService: (state, action: PayloadAction<ScheduledService>) => {
      state.allScheduledServices.push(action.payload);
    },

    // Update existing scheduled service
    updateScheduledService: (
      state,
      action: PayloadAction<ScheduledService>
    ) => {
      const updated = action.payload;
      state.allScheduledServices = state.allScheduledServices.map((s) =>
        s._id === updated._id ? { ...s, ...updated } : s
      );
    },

    // Delete a scheduled service by ID
    deleteScheduledService: (state, action: PayloadAction<string>) => {
      state.allScheduledServices = state.allScheduledServices.filter(
        (s) => s._id !== action.payload
      );
    },
  },
});

export const scheduledServicesActions = scheduledServicesSlice.actions;
export default scheduledServicesSlice;

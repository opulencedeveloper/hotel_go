import { StaffRole, StaffStatus } from "@/utils/enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Staff type
export interface Staff {
  _id: string;
  firstName: string;
  hasPassword?: boolean;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userRole: StaffRole;
  salary: number;
  shift: string;
  country: string;
  stateOrProvince: string;
  city: string;
  postalCode?: string;
  address: string;
  status: StaffStatus;
  createdAt: string;
}

// Define the StaffState type
export interface StaffState {
  staffs: Staff[];
  fetchedData: boolean;
}

const initialState: StaffState = {
  staffs: [],
  fetchedData: false,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    // ✅ Set all staff records
    setStaffs: (state, action: PayloadAction<Staff[]>) => {
      state.fetchedData = true;
      state.staffs = action.payload;
    },

    // ✅ Add a new staff record
    addStaff: (state, action: PayloadAction<Staff>) => {
      state.staffs.push(action.payload);
    },

    // ✅ Update an existing staff record
    updateStaff: (state, action: PayloadAction<Staff>) => {
      const updated = action.payload;
      state.staffs = state.staffs.map((s) =>
        s._id === updated._id ? { ...s, ...updated } : s
      );
    },

    // ✅ Delete a staff record by ID
    deleteStaff: (state, action: PayloadAction<string>) => {
      state.staffs = state.staffs.filter((s) => s._id !== action.payload);
    },
  },
});

export const staffActions = staffSlice.actions;
export default staffSlice;

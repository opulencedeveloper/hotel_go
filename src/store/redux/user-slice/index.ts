import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAccountSliceParams } from "@/types/user";

export const userAccountInitialState: UserAccountSliceParams = {
  _id: null,
  firstName: null,
  lastName: null,
  userRole: null,
};

const userAccountSlice = createSlice({
  name: "User",
  initialState: userAccountInitialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserAccountSliceParams>) => {
      console.log("action.payload", action.payload);
      return action.payload;
    },
  },
});

export const userAccountActions = userAccountSlice.actions;

export default userAccountSlice;

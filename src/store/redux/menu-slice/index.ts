import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Menu type
export interface Menu {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  prepTime: number;
  status: string;
  ingredients: string;
  hotelId: string;
}

// Define the MenuState type
export interface MenuState {
  menus: Menu[];
  fetchedData: boolean;
}

const initialState: MenuState = {
  menus: [],
  fetchedData: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // Set all menu items
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      state.fetchedData = true;
      state.menus = action.payload;
    },

    // Add a new menu item
    addMenu: (state, action: PayloadAction<Menu>) => {
      state.menus.push(action.payload);
    },

    // Update an existing menu item
    updateMenu: (state, action: PayloadAction<Menu>) => {
      const updated = action.payload;
      state.menus = state.menus.map((menu) =>
        menu._id === updated._id ? { ...menu, ...updated } : menu
      );
    },

    // Delete a menu item by ID
    deleteMenu: (state, action: PayloadAction<string>) => {
      state.menus = state.menus.filter((menu) => menu._id !== action.payload);
    },
  },
});

export const menuActions = menuSlice.actions;
export default menuSlice;

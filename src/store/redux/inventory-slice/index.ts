import { InventoryDestination } from "@/utils/enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InventoryItem {
  _id: string;
  itemName: string;
  category: string;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  storageLocation?: string;
  currentStock: number;
  description?: string;
  createdAt: string;
}

// Define the InventoryState type
export interface InventoryState {
  inventories: InventoryItem[];
  fetchedData: boolean;
}

// --------------------
// INVENTORY LOG TYPES
// --------------------
export interface InventoryLog {
  _id: string;
  destination: InventoryDestination;
  notes?: string;
  createdAt: string;
  staff: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userRole: string;
  };
  room?: {
    roomNumber: string;
    floor: number;
  };
  roomType?: {
    name: string;
    price: number;
    capacity: number;
  };
  inventories: {
    inventoryId: string;
    quantity: number;
    inventoryInfo: {
      itemName: string;
      category: string;
      unit: string;
      currentStock: number;
      costPerUnit: number;
      supplier?: string;
      storageLocation?: string;
    };
  }[];
}

// --------------------
// REDUX STATE
// --------------------
export interface InventoryState {
  inventories: InventoryItem[];
  inventoryLogs: InventoryLog[];
  fetchedData: boolean;
}

// --------------------
// INITIAL STATE
// --------------------
const initialState: InventoryState = {
  inventories: [],
  inventoryLogs: [],
  fetchedData: false,
};

// --------------------
// SLICE
// --------------------
const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    // Set all inventories
    setInventory: (state, action: PayloadAction<InventoryItem[]>) => {
      state.fetchedData = true;
      state.inventories = action.payload;
    },

    // Add new inventory items
    addInventoryItem: (state, action: PayloadAction<InventoryItem[]>) => {
      state.inventories.unshift(...action.payload);
    },

    // Update inventory
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const updated = action.payload;
      state.inventories = state.inventories.map((item) =>
        item._id === updated._id ? { ...item, ...updated } : item
      );
    },

    reduceInventoryQuantity: (
      state,
      action: PayloadAction<{ inventoryId: string; quantity: number }[]>
    ) => {
      const updates = action.payload;

      updates.forEach(({ inventoryId, quantity }) => {
        const inventory = state.inventories.find(
          (inv) => inv._id === inventoryId
        );

        if (inventory) {
          // Prevent negative stock
          inventory.currentStock = Math.max(
            inventory.currentStock - quantity,
            0
          );
        }
      });
    },

    // Delete inventory
    deleteInventoryItem: (state, action: PayloadAction<string>) => {
      state.inventories = state.inventories.filter(
        (item) => item._id !== action.payload
      );
    },

    // --------------------
    // INVENTORY LOG ACTIONS
    // --------------------

    // Set all inventory logs (e.g., from backend)
    setInventoryLogs: (state, action: PayloadAction<InventoryLog[]>) => {
      state.inventoryLogs = action.payload;
    },

    // Add a single new inventory log
    addInventoryLog: (state, action: PayloadAction<InventoryLog>) => {
      state.inventoryLogs.unshift(action.payload);
    },

    // Clear all inventory logs (optional)
    clearInventoryLogs: (state) => {
      state.inventoryLogs = [];
    },

    reset: () => initialState,
  },
});

// --------------------
// EXPORTS
// --------------------
export const inventoryActions = inventorySlice.actions;
export default inventorySlice;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface InventoryItem {
//   _id: string;
//   itemName: string;
//   category: string;
//   unit: string;
//   costPerUnit: number;
//   supplier?: string;
//   storageLocation?: string;
//   currentStock: number;
//   description?: string;
//   createdAt: string;
// }

// // Define the InventoryState type
// export interface InventoryState {
//   inventories: InventoryItem[];
//   fetchedData: boolean;
// }

// // Initial State
// const initialState: InventoryState = {
//   inventories: [],
//   fetchedData: false,
// };

// const inventorySlice = createSlice({
//   name: "inventory",
//   initialState,
//   reducers: {
//     // Set all inventory inventories
//     setInventory: (state, action: PayloadAction<InventoryItem[]>) => {
//       state.fetchedData = true;
//       state.inventories = action.payload;
//     },

//     // Add a new inventory item
// addInventoryItem: (state, action: PayloadAction<InventoryItem[]>) => {
//   state.inventories.unshift(...action.payload);
// },

//     // Update an existing inventory item
//     updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
//       const updated = action.payload;
//       state.inventories = state.inventories.map((item) =>
//         item._id === updated._id ? { ...item, ...updated } : item
//       );
//     },

//     // Delete an inventory item by ID
//     deleteInventoryItem: (state, action: PayloadAction<string>) => {
//       state.inventories = state.inventories.filter((item) => item._id !== action.payload);
//     },
//   },
// });

// export const inventoryActions = inventorySlice.actions;
// export default inventorySlice;

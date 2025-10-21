import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Room {
  room_id: string;
  property_id: string;
  room_number: string;
  room_type_id: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out-of-order';
  floor: number;
  last_cleaned?: string;
  amenities: string[];
  rate: number;
  created_at: string;
  updated_at?: string;
  room_type?: {
    name: string;
    description: string;
    capacity: number;
    base_rate: number;
  };
  current_guest?: {
    id: string;
    name: string;
    check_in: string;
    check_out: string;
  };
}

interface RoomsState {
  rooms: Room[];
  currentRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    floor?: number;
    roomType?: string;
    propertyId?: string;
  };
}

const initialState: RoomsState = {
  rooms: [],
  currentRoom: null,
  isLoading: false,
  error: null,
  filters: {}
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // CRUD operations
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    
    addRoom: (state, action: PayloadAction<Room>) => {
      state.rooms.push(action.payload);
    },
    
    updateRoom: (state, action: PayloadAction<{ id: string; updates: Partial<Room> }>) => {
      const index = state.rooms.findIndex(room => room.room_id === action.payload.id);
      if (index !== -1) {
        state.rooms[index] = { 
          ...state.rooms[index], 
          ...action.payload.updates,
          updated_at: new Date().toISOString()
        };
      }
    },
    
    deleteRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(room => room.room_id !== action.payload);
    },
    
    // Current room
    setCurrentRoom: (state, action: PayloadAction<Room | null>) => {
      state.currentRoom = action.payload;
    },
    
    // Filters
    setFilters: (state, action: PayloadAction<Partial<RoomsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    // Status updates
    updateRoomStatus: (state, action: PayloadAction<{ id: string; status: Room['status'] }>) => {
      const index = state.rooms.findIndex(room => room.room_id === action.payload.id);
      if (index !== -1) {
        state.rooms[index].status = action.payload.status;
        state.rooms[index].updated_at = new Date().toISOString();
      }
    },
    
    // Housekeeping operations
    markRoomCleaned: (state, action: PayloadAction<string>) => {
      const index = state.rooms.findIndex(room => room.room_id === action.payload);
      if (index !== -1) {
        state.rooms[index].last_cleaned = new Date().toISOString();
        state.rooms[index].status = 'available';
        state.rooms[index].updated_at = new Date().toISOString();
      }
    },
    
    // Maintenance operations
    markRoomForMaintenance: (state, action: PayloadAction<{ id: string; reason?: string }>) => {
      const index = state.rooms.findIndex(room => room.room_id === action.payload.id);
      if (index !== -1) {
        state.rooms[index].status = 'maintenance';
        state.rooms[index].updated_at = new Date().toISOString();
      }
    },
    
    // Room assignment
    assignRoomToGuest: (state, action: PayloadAction<{ roomId: string; guest: Room['current_guest'] }>) => {
      const index = state.rooms.findIndex(room => room.room_id === action.payload.roomId);
      if (index !== -1) {
        state.rooms[index].current_guest = action.payload.guest;
        state.rooms[index].status = 'occupied';
        state.rooms[index].updated_at = new Date().toISOString();
      }
    },
    
    // Room checkout
    checkoutRoom: (state, action: PayloadAction<string>) => {
      const index = state.rooms.findIndex(room => room.room_id === action.payload);
      if (index !== -1) {
        state.rooms[index].current_guest = undefined;
        state.rooms[index].status = 'cleaning';
        state.rooms[index].updated_at = new Date().toISOString();
      }
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  setCurrentRoom,
  setFilters,
  clearFilters,
  updateRoomStatus,
  markRoomCleaned,
  markRoomForMaintenance,
  assignRoomToGuest,
  checkoutRoom
} = roomsSlice.actions;

// Selectors
export const selectRooms = (state: { rooms: RoomsState }) => state.rooms.rooms;
export const selectCurrentRoom = (state: { rooms: RoomsState }) => state.rooms.currentRoom;
export const selectRoomsLoading = (state: { rooms: RoomsState }) => state.rooms.isLoading;
export const selectRoomsError = (state: { rooms: RoomsState }) => state.rooms.error;
export const selectRoomsFilters = (state: { rooms: RoomsState }) => state.rooms.filters;

// Filtered rooms selector
export const selectFilteredRooms = (state: { rooms: RoomsState }) => {
  const { rooms, filters } = state.rooms;
  
  return rooms.filter(room => {
    if (filters.status && room.status !== filters.status) return false;
    if (filters.floor && room.floor !== filters.floor) return false;
    if (filters.roomType && room.room_type_id !== filters.roomType) return false;
    if (filters.propertyId && room.property_id !== filters.propertyId) return false;
    return true;
  });
};

// Room status counts selector
export const selectRoomStatusCounts = (state: { rooms: RoomsState }) => {
  const rooms = state.rooms.rooms;
  return {
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    outOfOrder: rooms.filter(r => r.status === 'out-of-order').length,
    total: rooms.length
  };
};

export default roomsSlice.reducer;


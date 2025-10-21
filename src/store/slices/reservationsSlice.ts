import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  totalAmount: number;
  paidAmount: number;
  adults: number;
  children: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
  guest?: any;
  room?: any;
}

interface ReservationsState {
  reservations: Reservation[];
  currentReservation: Reservation | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    guestId?: string;
    roomId?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

const initialState: ReservationsState = {
  reservations: [],
  currentReservation: null,
  isLoading: false,
  error: null,
  filters: {}
};

const reservationsSlice = createSlice({
  name: 'reservations',
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
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload;
    },
    
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
    
    updateReservation: (state, action: PayloadAction<{ id: string; updates: Partial<Reservation> }>) => {
      const index = state.reservations.findIndex(res => res.id === action.payload.id);
      if (index !== -1) {
        state.reservations[index] = { 
          ...state.reservations[index], 
          ...action.payload.updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    
    deleteReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter(res => res.id !== action.payload);
    },
    
    // Current reservation
    setCurrentReservation: (state, action: PayloadAction<Reservation | null>) => {
      state.currentReservation = action.payload;
    },
    
    // Filters
    setFilters: (state, action: PayloadAction<Partial<ReservationsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    // Status updates
    updateReservationStatus: (state, action: PayloadAction<{ id: string; status: Reservation['status'] }>) => {
      const index = state.reservations.findIndex(res => res.id === action.payload.id);
      if (index !== -1) {
        state.reservations[index].status = action.payload.status;
        state.reservations[index].updatedAt = new Date().toISOString();
      }
    },
    
    // Check-in/Check-out operations
    checkInReservation: (state, action: PayloadAction<string>) => {
      const index = state.reservations.findIndex(res => res.id === action.payload);
      if (index !== -1) {
        state.reservations[index].status = 'checked-in';
        state.reservations[index].updatedAt = new Date().toISOString();
      }
    },
    
    checkOutReservation: (state, action: PayloadAction<string>) => {
      const index = state.reservations.findIndex(res => res.id === action.payload);
      if (index !== -1) {
        state.reservations[index].status = 'checked-out';
        state.reservations[index].updatedAt = new Date().toISOString();
      }
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  setCurrentReservation,
  setFilters,
  clearFilters,
  updateReservationStatus,
  checkInReservation,
  checkOutReservation
} = reservationsSlice.actions;

// Selectors
export const selectReservations = (state: { reservations: ReservationsState }) => state.reservations.reservations;
export const selectCurrentReservation = (state: { reservations: ReservationsState }) => state.reservations.currentReservation;
export const selectReservationsLoading = (state: { reservations: ReservationsState }) => state.reservations.isLoading;
export const selectReservationsError = (state: { reservations: ReservationsState }) => state.reservations.error;
export const selectReservationsFilters = (state: { reservations: ReservationsState }) => state.reservations.filters;

// Filtered reservations selector
export const selectFilteredReservations = (state: { reservations: ReservationsState }) => {
  const { reservations, filters } = state.reservations;
  
  return reservations.filter(reservation => {
    if (filters.status && reservation.status !== filters.status) return false;
    if (filters.guestId && reservation.guestId !== filters.guestId) return false;
    if (filters.roomId && reservation.roomId !== filters.roomId) return false;
    if (filters.dateRange) {
      const checkIn = new Date(reservation.checkIn);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      if (checkIn < start || checkIn > end) return false;
    }
    return true;
  });
};

export default reservationsSlice.reducer;


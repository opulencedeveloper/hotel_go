import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  idNumber: string;
  preferences: string[];
  loyaltyPoints: number;
  createdAt: string;
  updatedAt?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface GuestsState {
  guests: Guest[];
  currentGuest: Guest | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search?: string;
    nationality?: string;
    loyaltyTier?: string;
  };
}

const initialState: GuestsState = {
  guests: [],
  currentGuest: null,
  isLoading: false,
  error: null,
  filters: {}
};

const guestsSlice = createSlice({
  name: 'guests',
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
    setGuests: (state, action: PayloadAction<Guest[]>) => {
      state.guests = action.payload;
    },
    
    addGuest: (state, action: PayloadAction<Guest>) => {
      state.guests.push(action.payload);
    },
    
    updateGuest: (state, action: PayloadAction<{ id: string; updates: Partial<Guest> }>) => {
      const index = state.guests.findIndex(guest => guest.id === action.payload.id);
      if (index !== -1) {
        state.guests[index] = { 
          ...state.guests[index], 
          ...action.payload.updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    
    deleteGuest: (state, action: PayloadAction<string>) => {
      state.guests = state.guests.filter(guest => guest.id !== action.payload);
    },
    
    // Current guest
    setCurrentGuest: (state, action: PayloadAction<Guest | null>) => {
      state.currentGuest = action.payload;
    },
    
    // Filters
    setFilters: (state, action: PayloadAction<Partial<GuestsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    // Loyalty points management
    updateLoyaltyPoints: (state, action: PayloadAction<{ id: string; points: number; operation: 'add' | 'subtract' | 'set' }>) => {
      const index = state.guests.findIndex(guest => guest.id === action.payload.id);
      if (index !== -1) {
        const { points, operation } = action.payload;
        switch (operation) {
          case 'add':
            state.guests[index].loyaltyPoints += points;
            break;
          case 'subtract':
            state.guests[index].loyaltyPoints = Math.max(0, state.guests[index].loyaltyPoints - points);
            break;
          case 'set':
            state.guests[index].loyaltyPoints = points;
            break;
        }
        state.guests[index].updatedAt = new Date().toISOString();
      }
    },
    
    // Preferences management
    updatePreferences: (state, action: PayloadAction<{ id: string; preferences: string[] }>) => {
      const index = state.guests.findIndex(guest => guest.id === action.payload.id);
      if (index !== -1) {
        state.guests[index].preferences = action.payload.preferences;
        state.guests[index].updatedAt = new Date().toISOString();
      }
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  setCurrentGuest,
  setFilters,
  clearFilters,
  updateLoyaltyPoints,
  updatePreferences
} = guestsSlice.actions;

// Selectors
export const selectGuests = (state: { guests: GuestsState }) => state.guests.guests;
export const selectCurrentGuest = (state: { guests: GuestsState }) => state.guests.currentGuest;
export const selectGuestsLoading = (state: { guests: GuestsState }) => state.guests.isLoading;
export const selectGuestsError = (state: { guests: GuestsState }) => state.guests.error;
export const selectGuestsFilters = (state: { guests: GuestsState }) => state.guests.filters;

// Filtered guests selector
export const selectFilteredGuests = (state: { guests: GuestsState }) => {
  const { guests, filters } = state.guests;
  
  return guests.filter(guest => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        guest.firstName.toLowerCase().includes(searchLower) ||
        guest.lastName.toLowerCase().includes(searchLower) ||
        guest.email.toLowerCase().includes(searchLower) ||
        guest.phone.includes(filters.search);
      if (!matchesSearch) return false;
    }
    if (filters.nationality && guest.nationality !== filters.nationality) return false;
    if (filters.loyaltyTier) {
      const points = guest.loyaltyPoints;
      switch (filters.loyaltyTier) {
        case 'bronze':
          if (points >= 1000) return false;
          break;
        case 'silver':
          if (points < 1000 || points >= 2500) return false;
          break;
        case 'gold':
          if (points < 2500 || points >= 5000) return false;
          break;
        case 'platinum':
          if (points < 5000) return false;
          break;
      }
    }
    return true;
  });
};

export default guestsSlice.reducer;


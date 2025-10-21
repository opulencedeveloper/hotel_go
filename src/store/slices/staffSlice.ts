import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'manager' | 'receptionist' | 'housekeeping' | 'kitchen' | 'maintenance' | 'accounting' | 'security' | 'guest_services';
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  shift: 'morning' | 'afternoon' | 'night';
  createdAt: string;
  updatedAt?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills?: string[];
  certifications?: string[];
  performanceRating?: number;
}

interface StaffState {
  staff: Staff[];
  currentStaff: Staff | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    role?: string;
    department?: string;
    status?: string;
    search?: string;
  };
}

const initialState: StaffState = {
  staff: [],
  currentStaff: null,
  isLoading: false,
  error: null,
  filters: {}
};

const staffSlice = createSlice({
  name: 'staff',
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
    setStaff: (state, action: PayloadAction<Staff[]>) => {
      state.staff = action.payload;
    },
    
    addStaff: (state, action: PayloadAction<Staff>) => {
      state.staff.push(action.payload);
    },
    
    updateStaff: (state, action: PayloadAction<{ id: string; updates: Partial<Staff> }>) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = { 
          ...state.staff[index], 
          ...action.payload.updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    
    deleteStaff: (state, action: PayloadAction<string>) => {
      state.staff = state.staff.filter(staff => staff.id !== action.payload);
    },
    
    // Current staff
    setCurrentStaff: (state, action: PayloadAction<Staff | null>) => {
      state.currentStaff = action.payload;
    },
    
    // Filters
    setFilters: (state, action: PayloadAction<Partial<StaffState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    // Status updates
    updateStaffStatus: (state, action: PayloadAction<{ id: string; status: Staff['status'] }>) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index].status = action.payload.status;
        state.staff[index].updatedAt = new Date().toISOString();
      }
    },
    
    // Role updates
    updateStaffRole: (state, action: PayloadAction<{ id: string; role: Staff['role']; department: string }>) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index].role = action.payload.role;
        state.staff[index].department = action.payload.department;
        state.staff[index].updatedAt = new Date().toISOString();
      }
    },
    
    // Salary updates
    updateSalary: (state, action: PayloadAction<{ id: string; salary: number }>) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index].salary = action.payload.salary;
        state.staff[index].updatedAt = new Date().toISOString();
      }
    },
    
    // Performance rating
    updatePerformanceRating: (state, action: PayloadAction<{ id: string; rating: number }>) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index].performanceRating = action.payload.rating;
        state.staff[index].updatedAt = new Date().toISOString();
      }
    },
    
    // Skills management
    updateSkills: (state, action: PayloadAction<{ id: string; skills: string[] }>) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index].skills = action.payload.skills;
        state.staff[index].updatedAt = new Date().toISOString();
      }
    },
    
    // Certifications management
    updateCertifications: (state, action: PayloadAction<{ id: string; certifications: string[] }>) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index].certifications = action.payload.certifications;
        state.staff[index].updatedAt = new Date().toISOString();
      }
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  setCurrentStaff,
  setFilters,
  clearFilters,
  updateStaffStatus,
  updateStaffRole,
  updateSalary,
  updatePerformanceRating,
  updateSkills,
  updateCertifications
} = staffSlice.actions;

// Selectors
export const selectStaff = (state: { staff: StaffState }) => state.staff.staff;
export const selectCurrentStaff = (state: { staff: StaffState }) => state.staff.currentStaff;
export const selectStaffLoading = (state: { staff: StaffState }) => state.staff.isLoading;
export const selectStaffError = (state: { staff: StaffState }) => state.staff.error;
export const selectStaffFilters = (state: { staff: StaffState }) => state.staff.filters;

// Filtered staff selector
export const selectFilteredStaff = (state: { staff: StaffState }) => {
  const { staff, filters } = state.staff;
  
  return staff.filter(staffMember => {
    if (filters.role && staffMember.role !== filters.role) return false;
    if (filters.department && staffMember.department !== filters.department) return false;
    if (filters.status && staffMember.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        staffMember.firstName.toLowerCase().includes(searchLower) ||
        staffMember.lastName.toLowerCase().includes(searchLower) ||
        staffMember.email.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    return true;
  });
};

// Staff statistics selector
export const selectStaffStats = (state: { staff: StaffState }) => {
  const staff = state.staff.staff;
  return {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
    terminated: staff.filter(s => s.status === 'terminated').length,
    byDepartment: staff.reduce((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byRole: staff.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    averageSalary: staff.length > 0 ? staff.reduce((sum, member) => sum + member.salary, 0) / staff.length : 0
  };
};

export default staffSlice.reducer;


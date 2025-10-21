import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DashboardStats {
  // KPI Tiles
  occupancy: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  adr: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  revpar: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  arr: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  
  // Arrivals & Departures
  arrivals_today: number;
  arrivals_next_48h: number;
  departures_today: number;
  departures_next_48h: number;
  
  // Active Tasks
  housekeeping_tasks: number;
  maintenance_tasks: number;
  guest_requests: number;
  
  // Revenue by Outlet
  revenue_by_outlet: {
    rooms: number;
    f_and_b: number;
    other: number;
  };
  
  // Alerts
  overbook_risk: number;
  low_inventory_alerts: number;
  sync_errors: number;
  pending_payments: number;
  
  // System Status
  last_sync: string;
  online_status: boolean;
  pending_sync_items: number;
  
  // Legacy fields for backward compatibility
  totalRevenue: number;
  occupancyRate: number;
  totalGuests: number;
  availableRooms: number;
  pendingReservations: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  monthlyRevenue: number;
  monthlyOccupancy: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  realTimeUpdates: boolean;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  realTimeUpdates: false
};

const dashboardSlice = createSlice({
  name: 'dashboard',
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
    
    // Stats management
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    // Real-time updates
    enableRealTimeUpdates: (state) => {
      state.realTimeUpdates = true;
    },
    
    disableRealTimeUpdates: (state) => {
      state.realTimeUpdates = false;
    },
    
    // Incremental updates for real-time data
    updateArrivalsToday: (state, action: PayloadAction<number>) => {
      if (state.stats) {
        state.stats.arrivals_today = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateDeparturesToday: (state, action: PayloadAction<number>) => {
      if (state.stats) {
        state.stats.departures_today = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateOccupancy: (state, action: PayloadAction<{ today: number; mtd: number; ytd: number }>) => {
      if (state.stats) {
        state.stats.occupancy = { ...state.stats.occupancy, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateRevenue: (state, action: PayloadAction<{ rooms: number; f_and_b: number; other: number }>) => {
      if (state.stats) {
        state.stats.revenue_by_outlet = { ...state.stats.revenue_by_outlet, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateTasks: (state, action: PayloadAction<{ housekeeping: number; maintenance: number; guest_requests: number }>) => {
      if (state.stats) {
        state.stats.housekeeping_tasks = action.payload.housekeeping;
        state.stats.maintenance_tasks = action.payload.maintenance;
        state.stats.guest_requests = action.payload.guest_requests;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateAlerts: (state, action: PayloadAction<{ overbook_risk: number; low_inventory: number; sync_errors: number; pending_payments: number }>) => {
      if (state.stats) {
        state.stats.overbook_risk = action.payload.overbook_risk;
        state.stats.low_inventory_alerts = action.payload.low_inventory;
        state.stats.sync_errors = action.payload.sync_errors;
        state.stats.pending_payments = action.payload.pending_payments;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    // System status updates
    updateSystemStatus: (state, action: PayloadAction<{ online: boolean; last_sync: string; pending_items: number }>) => {
      if (state.stats) {
        state.stats.online_status = action.payload.online;
        state.stats.last_sync = action.payload.last_sync;
        state.stats.pending_sync_items = action.payload.pending_items;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    // Reset dashboard
    resetDashboard: (state) => {
      state.stats = null;
      state.error = null;
      state.lastUpdated = null;
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setStats,
  updateStats,
  enableRealTimeUpdates,
  disableRealTimeUpdates,
  updateArrivalsToday,
  updateDeparturesToday,
  updateOccupancy,
  updateRevenue,
  updateTasks,
  updateAlerts,
  updateSystemStatus,
  resetDashboard
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.stats;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;
export const selectDashboardLastUpdated = (state: { dashboard: DashboardState }) => state.dashboard.lastUpdated;
export const selectRealTimeUpdates = (state: { dashboard: DashboardState }) => state.dashboard.realTimeUpdates;

// Computed selectors
export const selectOccupancyRate = (state: { dashboard: DashboardState }) => {
  const stats = state.dashboard.stats;
  if (!stats) return 0;
  
  // Handle API response structure
  if (stats.occupancyRate !== undefined) {
    return stats.occupancyRate;
  }
  
  // Handle mock data structure
  if (stats.occupancy?.today !== undefined) {
    return stats.occupancy.today;
  }
  
  return 0;
};

export const selectTotalRevenue = (state: { dashboard: DashboardState }) => {
  const stats = state.dashboard.stats;
  if (!stats) return 0;
  
  // Handle both API response structure and mock data structure
  if (stats.totalRevenue !== undefined) {
    return stats.totalRevenue;
  }
  
  // Handle mock data structure with revenue_by_outlet
  if (stats.revenue_by_outlet) {
    return stats.revenue_by_outlet.rooms + stats.revenue_by_outlet.f_and_b + stats.revenue_by_outlet.other;
  }
  
  return 0;
};

export const selectActiveAlerts = (state: { dashboard: DashboardState }) => {
  const stats = state.dashboard.stats;
  if (!stats) return 0;
  
  // Handle API response structure (no alerts in current API response)
  if (stats.totalRevenue !== undefined) {
    return 0; // No alerts in API response for now
  }
  
  // Handle mock data structure
  if (stats.overbook_risk !== undefined) {
    return stats.overbook_risk + stats.low_inventory_alerts + stats.sync_errors + stats.pending_payments;
  }
  
  return 0;
};

export const selectSystemHealth = (state: { dashboard: DashboardState }) => {
  const stats = state.dashboard.stats;
  if (!stats) return 'unknown';
  
  // Handle API response structure (assume healthy for now)
  if (stats.totalRevenue !== undefined) {
    return 'healthy';
  }
  
  // Handle mock data structure
  if (stats.online_status !== undefined) {
    if (!stats.online_status) return 'offline';
    if (stats.sync_errors > 0) return 'warning';
    if (stats.pending_sync_items > 10) return 'warning';
    return 'healthy';
  }
  
  return 'unknown';
};

export default dashboardSlice.reducer;

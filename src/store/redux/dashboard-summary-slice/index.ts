import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DashboardSummary {
  housekeeping: Record<string, any>;
  inventory: Record<string, any>;
  metadata: Record<string, any>;
  orders: Record<string, any>;
  revenue: Record<string, any>;
  rooms: Record<string, any>;
  staff: Record<string, any>;
  stays: Record<string, any>;
}

export interface QuickSummary {
  activeStaff: number;
  completedTasks: number;
  currentGuests: number;
  lastUpdated: string;
  lowStockItems: number;
  metadata: Record<string, any>;
  occupancyRate: number;
  pendingOrders: number;
  pendingTasks: number;
  todayArrivals: number;
  todayDepartures: number;
  todayRevenue: number;
}

export interface DashboardState {
  dashboardSummary: DashboardSummary | null;
  quickSummary: QuickSummary | null;
  fetchedQuickSummary: boolean;
  fetchedDashboardSummary: boolean;
}

const initialState: DashboardState = {
  dashboardSummary: null,
  quickSummary: null,
  fetchedQuickSummary: false,
  fetchedDashboardSummary: false,
};

const dashboardSummarySlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // ✅ Set dashboard summary
    setDashboardSummary: (state, action: PayloadAction<DashboardSummary>) => {
      state.dashboardSummary = action.payload;
      state.fetchedDashboardSummary = true;
    },

    // ✅ Set quick summary
    setQuickSummary: (state, action: PayloadAction<QuickSummary>) => {
      state.quickSummary = action.payload;
      state.fetchedQuickSummary = true;
    },

    // ✅ Reset dashboard data
    resetDashboardData: (state) => initialState,
  },
});

export const dashboardSummaryActions = dashboardSummarySlice.actions;
export default dashboardSummarySlice;

// export const { setDashboardSummary, setQuickSummary, resetDashboardData } =
//   dashboardSummarySlice.actions;

// export default dashboardSummarySlice;

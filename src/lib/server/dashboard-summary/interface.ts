import { Types } from "mongoose";

export interface IDashboardSummaryParams {
  hotelId: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  period?: 'today' | 'week' | 'month' | 'year' | 'all';
}

export interface IRoomSummary {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  cleaning: number;
  outOfOrder: number;
  occupancyRate: number;
  revenue: number;
}

export interface IStaffSummary {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  terminated: number;
  pending: number;
  byDepartment: {
    frontDesk: number;
    housekeeping: number;
    kitchen: number;
    maintenance: number;
    security: number;
    management: number;
  };
}

export interface IStaySummary {
  total: number;
  confirmed: number;
  checkedIn: number;
  checkedOut: number;
  cancelled: number;
  noShow: number;
  todayArrivals: number;
  todayDepartures: number;
  currentGuests: number;
  averageStayDuration: number;
  revenue: number;
}

export interface IHousekeepingSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byRoomType: {
    standard: number;
    deluxe: number;
    suite: number;
  };
}

export interface IOrderSummary {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  delivered: number;
  cancelled: number;
  revenue: number;
  averageOrderValue: number;
}

export interface IInventorySummary {
  total: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
  byCategory: {
    food: number;
    beverage: number;
    cleaning: number;
    maintenance: number;
    amenities: number;
  };
}

export interface IRevenueSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  bySource: {
    roomRevenue: number;
    foodRevenue: number;
    serviceRevenue: number;
    otherRevenue: number;
  };
  averageDailyRate: number;
  revenuePerAvailableRoom: number;
}

export interface IDashboardSummaryResponse {
  rooms: IRoomSummary;
  staff: IStaffSummary;
  stays: IStaySummary;
  housekeeping: IHousekeepingSummary;
  orders: IOrderSummary;
  inventory: IInventorySummary;
  revenue: IRevenueSummary;
  metadata: {
    hotelId: string;
    period: string;
    generatedAt: Date;
    version: string;
  };
}

export interface IQuickSummaryResponse {
  occupancyRate: number;
  todayArrivals: number;
  todayDepartures: number;
  currentGuests: number;
  activeStaff: number;
  pendingTasks: number;
  completedTasks: number;
  todayRevenue: number;
  lowStockItems: number;
  pendingOrders: number;
  lastUpdated: string;
}

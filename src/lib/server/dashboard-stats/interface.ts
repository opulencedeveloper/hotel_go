import { Types } from "mongoose";

export interface IDashboardStatsParams {
  hotelId: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  period?: 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
  offset?: number;
}

export interface IDashboardStatsResponse {
  rooms: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    cleaning: number;
    outOfOrder: number;
    occupancyRate: number;
  };
  staff: {
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
  };
  stays: {
    total: number;
    confirmed: number;
    checkedIn: number;
    checkedOut: number;
    cancelled: number;
    arrivals: number;
    departures: number;
  };
  housekeeping: {
    total: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  revenue?: {
    total: number;
    today: number;
    thisMonth: number;
    thisYear: number;
  };
  metadata: {
    period: string;
    startDate?: Date;
    endDate?: Date;
    generatedAt: Date;
    hotelId: string;
  };
}

export interface IDashboardStatsFilters {
  startDate?: Date;
  endDate?: Date;
  period?: 'day' | 'week' | 'month' | 'year' | 'all';
  roomStatus?: string[];
  staffStatus?: string[];
  stayStatus?: string[];
  housekeepingStatus?: string[];
}

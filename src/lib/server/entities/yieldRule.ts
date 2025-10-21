import mongoose, { Schema } from "mongoose";

export interface IYieldRule {
  _id: string;
  ruleId: string;
  name: string;
  description: string;
  priority: number; // Higher number = higher priority
  conditions: {
    daysAhead: {
      min: number;
      max: number;
    };
    occupancyThreshold: {
      min: number;
      max: number;
    };
    dayOfWeek: number[]; // 0-6 (Sunday-Saturday)
    season: string[]; // e.g., ['summer', 'winter', 'holiday']
    roomTypes: string[];
    ratePlans: string[];
    guestTypes: string[]; // e.g., ['leisure', 'business', 'group']
    events: string[]; // Special events or holidays
    weather?: {
      condition: string; // 'sunny', 'rainy', 'snowy'
      impact: 'positive' | 'negative' | 'neutral';
    };
    competitorRates?: {
      operator: 'above' | 'below' | 'equal';
      percentage: number;
    };
  };
  actions: {
    rateAdjustment: {
      type: 'percentage' | 'fixed' | 'multiplier';
      value: number;
      direction: 'increase' | 'decrease';
    };
    minLengthOfStay: number;
    maxLengthOfStay?: number;
    closeToArrival: boolean;
    closeToDeparture: boolean;
    restrictAdvanceBooking: boolean;
    advanceBookingDays?: number;
    blackoutDates: Date[];
    roomTypeRestrictions: string[];
    ratePlanRestrictions: string[];
    guestTypeRestrictions: string[];
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    timeOfDay?: {
      start: string; // HH:MM format
      end: string; // HH:MM format
    };
    daysOfWeek: number[]; // 0-6
    isRecurring: boolean;
    recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  };
  performance: {
    timesTriggered: number;
    lastTriggered?: Date;
    revenueImpact: number;
    occupancyImpact: number;
    averageRateImpact: number;
    successRate: number; // 0-100
  };
  status: 'active' | 'inactive' | 'testing' | 'archived';
  isAutomatic: boolean; // Auto-apply vs manual review
  requiresApproval: boolean;
  approvalThreshold?: number; // Rate change percentage requiring approval
  createdBy: mongoose.Types.ObjectId;
  lastModifiedBy?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  notes?: string;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const yieldRuleSchema: Schema = new Schema(
  {
    ruleId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Number, required: true, default: 1 },
    conditions: {
      daysAhead: {
        min: { type: Number, required: true, min: 0 },
        max: { type: Number, required: true, min: 0 }
      },
      occupancyThreshold: {
        min: { type: Number, required: true, min: 0, max: 100 },
        max: { type: Number, required: true, min: 0, max: 100 }
      },
      dayOfWeek: [{ type: Number, min: 0, max: 6 }],
      season: [{ type: String }],
      roomTypes: [{ type: String }],
      ratePlans: [{ type: String }],
      guestTypes: [{ type: String }],
      events: [{ type: String }],
      weather: {
        condition: { type: String },
        impact: { 
          type: String, 
          enum: ['positive', 'negative', 'neutral']
        }
      },
      competitorRates: {
        operator: { 
          type: String, 
          enum: ['above', 'below', 'equal']
        },
        percentage: { type: Number, min: 0, max: 100 }
      }
    },
    actions: {
      rateAdjustment: {
        type: { 
          type: String, 
          enum: ['percentage', 'fixed', 'multiplier'],
          required: true 
        },
        value: { type: Number, required: true },
        direction: { 
          type: String, 
          enum: ['increase', 'decrease'],
          required: true 
        }
      },
      minLengthOfStay: { type: Number, required: true, min: 1 },
      maxLengthOfStay: { type: Number, min: 1 },
      closeToArrival: { type: Boolean, default: false },
      closeToDeparture: { type: Boolean, default: false },
      restrictAdvanceBooking: { type: Boolean, default: false },
      advanceBookingDays: { type: Number, min: 0 },
      blackoutDates: [{ type: Date }],
      roomTypeRestrictions: [{ type: String }],
      ratePlanRestrictions: [{ type: String }],
      guestTypeRestrictions: [{ type: String }]
    },
    schedule: {
      startDate: { type: Date, required: true, default: Date.now },
      endDate: { type: Date },
      timeOfDay: {
        start: { type: String }, // HH:MM format
        end: { type: String } // HH:MM format
      },
      daysOfWeek: [{ type: Number, min: 0, max: 6 }],
      isRecurring: { type: Boolean, default: false },
      recurrencePattern: { 
        type: String, 
        enum: ['daily', 'weekly', 'monthly']
      }
    },
    performance: {
      timesTriggered: { type: Number, default: 0, min: 0 },
      lastTriggered: { type: Date },
      revenueImpact: { type: Number, default: 0 },
      occupancyImpact: { type: Number, default: 0 },
      averageRateImpact: { type: Number, default: 0 },
      successRate: { type: Number, default: 0, min: 0, max: 100 }
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'testing', 'archived'],
      default: 'active'
    },
    isAutomatic: { type: Boolean, default: true },
    requiresApproval: { type: Boolean, default: false },
    approvalThreshold: { type: Number, min: 0, max: 100 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: { type: Date },
    notes: { type: String },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
yieldRuleSchema.index({ hotelId: 1, ruleId: 1 }, { unique: true });
yieldRuleSchema.index({ hotelId: 1, status: 1 });
yieldRuleSchema.index({ hotelId: 1, priority: 1 });
yieldRuleSchema.index({ hotelId: 1, 'schedule.startDate': 1, 'schedule.endDate': 1 });
yieldRuleSchema.index({ hotelId: 1, isAutomatic: 1 });
yieldRuleSchema.index({ hotelId: 1, 'conditions.roomTypes': 1 });
yieldRuleSchema.index({ hotelId: 1, 'conditions.ratePlans': 1 });

const YieldRule =
  (mongoose.models.YieldRule as mongoose.Model<IYieldRule>) ||
  mongoose.model<IYieldRule>("YieldRule", yieldRuleSchema);

export default YieldRule;






import mongoose, { Schema } from "mongoose";

export interface IReport {
  _id: string;
  reportCode: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'guest' | 'staff' | 'inventory' | 'revenue' | 'occupancy' | 'custom';
  type: 'standard' | 'custom' | 'scheduled';
  template: {
    name: string;
    description: string;
    query: string; // Database query or aggregation pipeline
    parameters: {
      name: string;
      type: 'date' | 'string' | 'number' | 'boolean' | 'list' | 'range';
      required: boolean;
      defaultValue?: any;
      options?: any[];
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
      };
    }[];
    outputFormat: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
    chartType?: 'line' | 'bar' | 'pie' | 'table' | 'dashboard';
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    time: string; // HH:MM format
    timezone: string;
    recipients: string[]; // Email addresses
    enabled: boolean;
    lastRun?: Date;
    nextRun?: Date;
  };
  parameters: Record<string, any>; // Current parameter values
  filters: {
    dateRange?: {
      start: Date;
      end: Date;
    };
    departments?: string[];
    outlets?: string[];
    roomTypes?: string[];
    statuses?: string[];
    custom?: Record<string, any>;
  };
  status: 'draft' | 'active' | 'inactive' | 'archived';
  isPublic: boolean; // Can other users access this report
  createdBy: mongoose.Types.ObjectId;
  lastModifiedBy?: mongoose.Types.ObjectId;
  lastRunAt?: Date;
  lastRunBy?: mongoose.Types.ObjectId;
  runCount: number;
  averageRunTime: number; // in milliseconds
  tags: string[];
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema: Schema = new Schema(
  {
    reportCode: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['financial', 'operational', 'guest', 'staff', 'inventory', 'revenue', 'occupancy', 'custom']
    },
    type: { 
      type: String, 
      required: true,
      enum: ['standard', 'custom', 'scheduled'],
      default: 'custom'
    },
    template: {
      name: { type: String, required: true },
      description: { type: String, required: true },
      query: { type: String, required: true },
      parameters: [{
        name: { type: String, required: true },
        type: { 
          type: String, 
          enum: ['date', 'string', 'number', 'boolean', 'list', 'range'],
          required: true 
        },
        required: { type: Boolean, default: false },
        defaultValue: { type: Schema.Types.Mixed },
        options: [{ type: Schema.Types.Mixed }],
        validation: {
          min: { type: Number },
          max: { type: Number },
          pattern: { type: String }
        }
      }],
      outputFormat: { 
        type: String, 
        enum: ['pdf', 'excel', 'csv', 'json', 'html'],
        default: 'pdf'
      },
      chartType: { 
        type: String, 
        enum: ['line', 'bar', 'pie', 'table', 'dashboard']
      }
    },
    schedule: {
      frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']
      },
      dayOfWeek: { type: Number, min: 0, max: 6 },
      dayOfMonth: { type: Number, min: 1, max: 31 },
      time: { type: String }, // HH:MM format
      timezone: { type: String, default: 'UTC' },
      recipients: [{ type: String }],
      enabled: { type: Boolean, default: false },
      lastRun: { type: Date },
      nextRun: { type: Date }
    },
    parameters: { type: Schema.Types.Mixed },
    filters: {
      dateRange: {
        start: { type: Date },
        end: { type: Date }
      },
      departments: [{ type: String }],
      outlets: [{ type: String }],
      roomTypes: [{ type: String }],
      statuses: [{ type: String }],
      custom: { type: Schema.Types.Mixed }
    },
    status: { 
      type: String, 
      enum: ['draft', 'active', 'inactive', 'archived'],
      default: 'draft'
    },
    isPublic: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    lastRunAt: { type: Date },
    lastRunBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    runCount: { type: Number, default: 0 },
    averageRunTime: { type: Number, default: 0 },
    tags: [{ type: String }],
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
reportSchema.index({ hotelId: 1, reportCode: 1 }, { unique: true });
reportSchema.index({ hotelId: 1, category: 1 });
reportSchema.index({ hotelId: 1, type: 1 });
reportSchema.index({ hotelId: 1, status: 1 });
reportSchema.index({ hotelId: 1, createdBy: 1 });
reportSchema.index({ hotelId: 1, isPublic: 1 });
reportSchema.index({ hotelId: 1, tags: 1 });
reportSchema.index({ hotelId: 1, 'schedule.nextRun': 1 });

const Report =
  (mongoose.models.Report as mongoose.Model<IReport>) ||
  mongoose.model<IReport>("Report", reportSchema);

export default Report;







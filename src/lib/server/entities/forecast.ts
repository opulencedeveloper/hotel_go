import mongoose, { Schema } from "mongoose";

export interface IForecast {
  _id: string;
  forecastId: string;
  forecastType: 'occupancy' | 'revenue' | 'demand' | 'staffing' | 'inventory' | 'pricing';
  name: string;
  description: string;
  forecastDate: Date;
  periodStart: Date;
  periodEnd: Date;
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  predictedValue: number;
  confidenceLevel: number; // 0-100 percentage
  actualValue?: number; // For accuracy tracking
  accuracy?: number; // Calculated accuracy percentage
  factors: {
    factorName: string;
    impact: number; // -100 to 100 percentage impact
    weight: number; // 0-1 weight in calculation
    description: string;
    source: 'historical' | 'market' | 'seasonal' | 'event' | 'economic' | 'weather';
    dataPoints: {
      date: Date;
      value: number;
      source?: string;
    }[];
  }[];
  methodology: {
    algorithm: 'linear_regression' | 'time_series' | 'machine_learning' | 'exponential_smoothing' | 'arima' | 'custom';
    parameters: Record<string, any>;
    trainingDataPeriod: {
      start: Date;
      end: Date;
    };
    validationScore?: number;
  };
  assumptions: {
    assumption: string;
    impact: 'high' | 'medium' | 'low';
    probability: number; // 0-1
  }[];
  scenarios: {
    scenarioName: string;
    probability: number; // 0-1
    predictedValue: number;
    description: string;
    conditions: Record<string, any>;
  }[];
  alerts: {
    type: 'threshold_exceeded' | 'trend_change' | 'accuracy_low' | 'data_quality';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    triggeredAt: Date;
    resolvedAt?: Date;
  }[];
  metadata: {
    dataQuality: number; // 0-100
    lastDataUpdate: Date;
    modelVersion: string;
    createdBy: mongoose.Types.ObjectId;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    notes?: string;
  };
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const forecastSchema: Schema = new Schema(
  {
    forecastId: { type: String, required: true },
    forecastType: { 
      type: String, 
      required: true,
      enum: ['occupancy', 'revenue', 'demand', 'staffing', 'inventory', 'pricing']
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    forecastDate: { type: Date, required: true, default: Date.now },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    granularity: { 
      type: String, 
      required: true,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    predictedValue: { type: Number, required: true },
    confidenceLevel: { type: Number, required: true, min: 0, max: 100 },
    actualValue: { type: Number },
    accuracy: { type: Number, min: 0, max: 100 },
    factors: [{
      factorName: { type: String, required: true },
      impact: { type: Number, required: true, min: -100, max: 100 },
      weight: { type: Number, required: true, min: 0, max: 1 },
      description: { type: String, required: true },
      source: { 
        type: String, 
        enum: ['historical', 'market', 'seasonal', 'event', 'economic', 'weather'],
        required: true 
      },
      dataPoints: [{
        date: { type: Date, required: true },
        value: { type: Number, required: true },
        source: { type: String }
      }]
    }],
    methodology: {
      algorithm: { 
        type: String, 
        enum: ['linear_regression', 'time_series', 'machine_learning', 'exponential_smoothing', 'arima', 'custom'],
        required: true 
      },
      parameters: { type: Schema.Types.Mixed },
      trainingDataPeriod: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
      },
      validationScore: { type: Number, min: 0, max: 1 }
    },
    assumptions: [{
      assumption: { type: String, required: true },
      impact: { 
        type: String, 
        enum: ['high', 'medium', 'low'],
        required: true 
      },
      probability: { type: Number, required: true, min: 0, max: 1 }
    }],
    scenarios: [{
      scenarioName: { type: String, required: true },
      probability: { type: Number, required: true, min: 0, max: 1 },
      predictedValue: { type: Number, required: true },
      description: { type: String, required: true },
      conditions: { type: Schema.Types.Mixed }
    }],
    alerts: [{
      type: { 
        type: String, 
        enum: ['threshold_exceeded', 'trend_change', 'accuracy_low', 'data_quality'],
        required: true 
      },
      message: { type: String, required: true },
      severity: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'critical'],
        required: true 
      },
      triggeredAt: { type: Date, required: true, default: Date.now },
      resolvedAt: { type: Date }
    }],
    metadata: {
      dataQuality: { type: Number, min: 0, max: 100 },
      lastDataUpdate: { type: Date, required: true, default: Date.now },
      modelVersion: { type: String, required: true },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      reviewedAt: { type: Date },
      notes: { type: String }
    },
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
forecastSchema.index({ hotelId: 1, forecastId: 1 }, { unique: true });
forecastSchema.index({ hotelId: 1, forecastType: 1 });
forecastSchema.index({ hotelId: 1, periodStart: 1, periodEnd: 1 });
forecastSchema.index({ hotelId: 1, forecastDate: 1 });
forecastSchema.index({ hotelId: 1, granularity: 1 });
forecastSchema.index({ hotelId: 1, confidenceLevel: 1 });

const Forecast =
  (mongoose.models.Forecast as mongoose.Model<IForecast>) ||
  mongoose.model<IForecast>("Forecast", forecastSchema);

export default Forecast;












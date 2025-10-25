import mongoose, { Schema } from "mongoose";

export interface IAuditEvent {
  _id: string;
  eventId: string;
  userId?: mongoose.Types.ObjectId; // User who performed the action
  sessionId?: string;
  action: string; // e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
  entityType: string; // e.g., 'User', 'Reservation', 'Room'
  entityId: string; // ID of the affected entity
  beforeData?: Record<string, any>; // Data before the change
  afterData?: Record<string, any>; // Data after the change
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress: string;
  userAgent: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security' | 'business';
  description: string;
  metadata?: Record<string, any>; // Additional context
  clientTxnId?: string; // For offline sync
  serverTxnId?: string; // Server transaction ID
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const auditEventSchema: Schema = new Schema(
  {
    eventId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    sessionId: { type: String },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    beforeData: { type: Schema.Types.Mixed },
    afterData: { type: Schema.Types.Mixed },
    changes: [{
      field: { type: String, required: true },
      oldValue: { type: Schema.Types.Mixed },
      newValue: { type: Schema.Types.Mixed }
    }],
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    location: {
      country: { type: String },
      region: { type: String },
      city: { type: String },
      latitude: { type: Number },
      longitude: { type: Number }
    },
    severity: { 
      type: String, 
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    category: { 
      type: String, 
      required: true,
      enum: ['authentication', 'authorization', 'data_access', 'data_modification', 'system', 'security', 'business']
    },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    clientTxnId: { type: String },
    serverTxnId: { type: String },
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
auditEventSchema.index({ hotelId: 1, eventId: 1 }, { unique: true });
auditEventSchema.index({ hotelId: 1, userId: 1 });
auditEventSchema.index({ hotelId: 1, action: 1 });
auditEventSchema.index({ hotelId: 1, entityType: 1 });
auditEventSchema.index({ hotelId: 1, entityId: 1 });
auditEventSchema.index({ hotelId: 1, severity: 1 });
auditEventSchema.index({ hotelId: 1, category: 1 });
auditEventSchema.index({ hotelId: 1, createdAt: 1 });
auditEventSchema.index({ hotelId: 1, ipAddress: 1 });
auditEventSchema.index({ hotelId: 1, sessionId: 1 });

const AuditEvent =
  (mongoose.models.AuditEvent as mongoose.Model<IAuditEvent>) ||
  mongoose.model<IAuditEvent>("AuditEvent", auditEventSchema);

export default AuditEvent;














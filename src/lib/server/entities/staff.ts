import mongoose, { Schema } from "mongoose";

export interface IStaff {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: 'front_desk' | 'housekeeping' | 'kitchen' | 'maintenance' | 'security' | 'management' | 'accounting' | 'guest_services';
  role: 'admin' | 'manager' | 'supervisor' | 'employee' | 'trainee';
  hireDate: Date;
  salary?: number;
  shift: 'morning' | 'afternoon' | 'night' | 'flexible';
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
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
  skills: string[];
  certifications: string[];
  performanceRating?: number;
  notes?: string;
  userId?: mongoose.Types.ObjectId; // Link to User model if they have login access
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    department: { 
      type: String, 
      required: true,
      enum: ['front_desk', 'housekeeping', 'kitchen', 'maintenance', 'security', 'management', 'accounting', 'guest_services']
    },
    role: { 
      type: String, 
      required: true,
      enum: ['admin', 'manager', 'supervisor', 'employee', 'trainee']
    },
    hireDate: { type: Date, required: true },
    salary: { type: Number },
    shift: { 
      type: String, 
      required: true,
      enum: ['morning', 'afternoon', 'night', 'flexible']
    },
    status: { 
      type: String, 
      required: true,
      enum: ['active', 'inactive', 'terminated', 'on-leave'],
      default: 'active'
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String }
    },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }
    },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    performanceRating: { type: Number, min: 1, max: 5 },
    notes: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
staffSchema.index({ hotelId: 1, employeeId: 1 }, { unique: true });
staffSchema.index({ hotelId: 1, email: 1 }, { unique: true });
staffSchema.index({ hotelId: 1, department: 1 });
staffSchema.index({ hotelId: 1, status: 1 });
staffSchema.index({ hotelId: 1, role: 1 });

const Staff =
  (mongoose.models.Staff as mongoose.Model<IStaff>) ||
  mongoose.model<IStaff>("Staff", staffSchema);

export default Staff;














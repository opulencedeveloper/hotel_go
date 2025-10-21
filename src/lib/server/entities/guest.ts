import mongoose, { Schema } from "mongoose";

export interface IGuest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  idNumber: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
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
  preferences: string[];
  loyaltyPoints: number;
  totalStays: number;
  lastStayDate?: Date;
  isVip: boolean;
  notes?: string;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const guestSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: { type: String, required: true },
    idNumber: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other']
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
    preferences: [{ type: String }],
    loyaltyPoints: { type: Number, default: 0 },
    totalStays: { type: Number, default: 0 },
    lastStayDate: { type: Date },
    isVip: { type: Boolean, default: false },
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
guestSchema.index({ hotelId: 1, email: 1 }, { unique: true });
guestSchema.index({ hotelId: 1, phone: 1 });
guestSchema.index({ hotelId: 1, idNumber: 1 });
guestSchema.index({ hotelId: 1, isVip: 1 });

const Guest =
  (mongoose.models.Guest as mongoose.Model<IGuest>) ||
  mongoose.model<IGuest>("Guest", guestSchema);

export default Guest;







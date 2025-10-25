import mongoose, { Schema } from "mongoose";

export interface IRoom {
  _id: string;
  roomNumber: string;
  roomType: 'single' | 'double' | 'suite' | 'deluxe' | 'presidential';
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out-of-order';
  pricePerNight: number;
  maxOccupancy: number;
  amenities: string[];
  description?: string;
  images?: string[];
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema: Schema = new Schema(
  {
    roomNumber: { type: String, required: true },
    roomType: { 
      type: String, 
      required: true,
      enum: ['single', 'double', 'suite', 'deluxe', 'presidential']
    },
    floor: { type: Number, required: true },
    status: { 
      type: String, 
      required: true,
      enum: ['available', 'occupied', 'maintenance', 'cleaning', 'out-of-order'],
      default: 'available'
    },
    pricePerNight: { type: Number, required: true },
    maxOccupancy: { type: Number, required: true },
    amenities: [{ type: String }],
    description: { type: String },
    images: [{ type: String }],
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
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hotelId: 1, status: 1 });
roomSchema.index({ hotelId: 1, roomType: 1 });

const Room =
  (mongoose.models.Room as mongoose.Model<IRoom>) ||
  mongoose.model<IRoom>("Room", roomSchema);

export default Room;












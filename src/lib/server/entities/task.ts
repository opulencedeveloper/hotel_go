import mongoose, { Schema } from "mongoose";

export interface ITask {
  _id: string;
  taskNumber: string;
  title: string;
  description: string;
  type: 'housekeeping' | 'maintenance' | 'guest_request' | 'security' | 'administrative' | 'inspection';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  assignedTo?: mongoose.Types.ObjectId; // Staff member
  assignedBy: mongoose.Types.ObjectId; // User who created the task
  roomId?: mongoose.Types.ObjectId; // If room-related
  guestId?: mongoose.Types.ObjectId; // If guest-related
  dueDate: Date;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  attachments: string[]; // File URLs
  checklist: {
    item: string;
    completed: boolean;
    completedAt?: Date;
    completedBy?: mongoose.Types.ObjectId;
  }[];
  followUpRequired: boolean;
  followUpDate?: Date;
  parentTaskId?: mongoose.Types.ObjectId; // For sub-tasks
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema = new Schema(
  {
    taskNumber: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['housekeeping', 'maintenance', 'guest_request', 'security', 'administrative', 'inspection']
    },
    priority: { 
      type: String, 
      required: true,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: { 
      type: String, 
      required: true,
      enum: ['pending', 'in_progress', 'completed', 'cancelled', 'on_hold'],
      default: 'pending'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest"
    },
    dueDate: { type: Date, required: true },
    estimatedDuration: { type: Number, required: true, min: 1 },
    actualDuration: { type: Number, min: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String },
    attachments: [{ type: String }],
    checklist: [{
      item: { type: String, required: true },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
      }
    }],
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
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
taskSchema.index({ hotelId: 1, taskNumber: 1 }, { unique: true });
taskSchema.index({ hotelId: 1, status: 1 });
taskSchema.index({ hotelId: 1, type: 1 });
taskSchema.index({ hotelId: 1, priority: 1 });
taskSchema.index({ hotelId: 1, assignedTo: 1 });
taskSchema.index({ hotelId: 1, dueDate: 1 });
taskSchema.index({ hotelId: 1, roomId: 1 });

const Task =
  (mongoose.models.Task as mongoose.Model<ITask>) ||
  mongoose.model<ITask>("Task", taskSchema);

export default Task;







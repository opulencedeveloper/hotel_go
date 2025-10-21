import mongoose, { Schema } from "mongoose";

export interface IGuestProfile {
  _id: string;
  profileId: string;
  guestId: mongoose.Types.ObjectId; // Link to Guest entity
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  nationality: string;
  idType: 'passport' | 'drivers_license' | 'national_id' | 'other';
  idNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  preferences: {
    category: 'room' | 'dining' | 'service' | 'communication' | 'amenities';
    preference: string;
    priority: 'high' | 'medium' | 'low';
    notes?: string;
  }[];
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  loyaltyPoints: number;
  totalStays: number;
  totalNights: number;
  totalSpent: number;
  averageSpending: number;
  lastStayDate?: Date;
  lastStayHotel?: mongoose.Types.ObjectId;
  preferredRoomType?: string;
  preferredFloor?: number;
  preferredView?: string;
  dietaryRestrictions: string[];
  allergies: string[];
  specialNeeds: string[];
  communicationPreferences: {
    language: string;
    preferredContactMethod: 'email' | 'phone' | 'sms' | 'whatsapp';
    marketingOptIn: boolean;
    newsletterOptIn: boolean;
    smsOptIn: boolean;
  };
  socialMedia: {
    platform: string;
    handle: string;
    verified: boolean;
  }[];
  documents: {
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    expiresAt?: Date;
  }[];
  notes: string;
  tags: string[]; // e.g., 'VIP', 'Corporate', 'Frequent Guest'
  isVip: boolean;
  vipLevel?: 'standard' | 'premium' | 'executive' | 'presidential';
  vipBenefits: string[];
  blacklisted: boolean;
  blacklistReason?: string;
  blacklistedAt?: Date;
  blacklistedBy?: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const guestProfileSchema: Schema = new Schema(
  {
    profileId: { type: String, required: true },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date },
    nationality: { type: String, required: true },
    idType: { 
      type: String, 
      enum: ['passport', 'drivers_license', 'national_id', 'other'],
      required: true 
    },
    idNumber: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true }
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String }
    },
    preferences: [{
      category: { 
        type: String, 
        enum: ['room', 'dining', 'service', 'communication', 'amenities'],
        required: true 
      },
      preference: { type: String, required: true },
      priority: { 
        type: String, 
        enum: ['high', 'medium', 'low'],
        default: 'medium'
      },
      notes: { type: String }
    }],
    loyaltyTier: { 
      type: String, 
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze'
    },
    loyaltyPoints: { type: Number, default: 0, min: 0 },
    totalStays: { type: Number, default: 0, min: 0 },
    totalNights: { type: Number, default: 0, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    averageSpending: { type: Number, default: 0, min: 0 },
    lastStayDate: { type: Date },
    lastStayHotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel"
    },
    preferredRoomType: { type: String },
    preferredFloor: { type: Number, min: 1 },
    preferredView: { type: String },
    dietaryRestrictions: [{ type: String }],
    allergies: [{ type: String }],
    specialNeeds: [{ type: String }],
    communicationPreferences: {
      language: { type: String, default: 'en' },
      preferredContactMethod: { 
        type: String, 
        enum: ['email', 'phone', 'sms', 'whatsapp'],
        default: 'email'
      },
      marketingOptIn: { type: Boolean, default: false },
      newsletterOptIn: { type: Boolean, default: false },
      smsOptIn: { type: Boolean, default: false }
    },
    socialMedia: [{
      platform: { type: String, required: true },
      handle: { type: String, required: true },
      verified: { type: Boolean, default: false }
    }],
    documents: [{
      name: { type: String, required: true },
      type: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      expiresAt: { type: Date }
    }],
    notes: { type: String },
    tags: [{ type: String }],
    isVip: { type: Boolean, default: false },
    vipLevel: { 
      type: String, 
      enum: ['standard', 'premium', 'executive', 'presidential']
    },
    vipBenefits: [{ type: String }],
    blacklisted: { type: Boolean, default: false },
    blacklistReason: { type: String },
    blacklistedAt: { type: Date },
    blacklistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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
guestProfileSchema.index({ hotelId: 1, profileId: 1 }, { unique: true });
guestProfileSchema.index({ hotelId: 1, guestId: 1 }, { unique: true });
guestProfileSchema.index({ hotelId: 1, email: 1 });
guestProfileSchema.index({ hotelId: 1, phone: 1 });
guestProfileSchema.index({ hotelId: 1, loyaltyTier: 1 });
guestProfileSchema.index({ hotelId: 1, isVip: 1 });
guestProfileSchema.index({ hotelId: 1, blacklisted: 1 });
guestProfileSchema.index({ hotelId: 1, totalStays: 1 });
guestProfileSchema.index({ hotelId: 1, totalSpent: 1 });

const GuestProfile =
  (mongoose.models.GuestProfile as mongoose.Model<IGuestProfile>) ||
  mongoose.model<IGuestProfile>("GuestProfile", guestProfileSchema);

export default GuestProfile;







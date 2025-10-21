import mongoose, { Schema } from "mongoose";

export interface ILoyaltyProgram {
  _id: string;
  programCode: string;
  name: string;
  description: string;
  tiers: {
    tierId: string;
    name: string;
    minPoints: number;
    maxPoints?: number;
    benefits: string[];
    discountPercentage: number;
    bonusMultiplier: number; // Points multiplier for this tier
    color: string; // For UI display
    icon?: string;
  }[];
  pointRules: {
    ruleId: string;
    action: 'earn' | 'redeem' | 'bonus';
    description: string;
    pointsPerDollar: number;
    minAmount?: number;
    maxPoints?: number;
    validFrom: Date;
    validTo?: Date;
    conditions?: {
      roomType?: string[];
      outletType?: string[];
      dayOfWeek?: number[];
      season?: string[];
    };
    isActive: boolean;
  }[];
  redemptionRules: {
    ruleId: string;
    itemType: 'room_upgrade' | 'amenity' | 'discount' | 'free_night' | 'service';
    itemName: string;
    pointsRequired: number;
    maxRedemptions?: number;
    validFrom: Date;
    validTo?: Date;
    conditions?: {
      minStay?: number;
      advanceBooking?: number;
      blackoutDates?: Date[];
    };
    isActive: boolean;
  }[];
  settings: {
    pointsExpiryMonths: number;
    allowPointTransfer: boolean;
    allowPointGift: boolean;
    maxGiftPoints: number;
    requireEmailVerification: boolean;
    autoTierUpgrade: boolean;
    birthdayBonus: number;
    anniversaryBonus: number;
  };
  status: 'active' | 'inactive' | 'suspended';
  startDate: Date;
  endDate?: Date;
  totalMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalRedemptions: number;
  hotelId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const loyaltyProgramSchema: Schema = new Schema(
  {
    programCode: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    tiers: [{
      tierId: { type: String, required: true },
      name: { type: String, required: true },
      minPoints: { type: Number, required: true, min: 0 },
      maxPoints: { type: Number, min: 0 },
      benefits: [{ type: String }],
      discountPercentage: { type: Number, required: true, min: 0, max: 100 },
      bonusMultiplier: { type: Number, required: true, min: 1, default: 1 },
      color: { type: String, required: true },
      icon: { type: String }
    }],
    pointRules: [{
      ruleId: { type: String, required: true },
      action: { 
        type: String, 
        enum: ['earn', 'redeem', 'bonus'],
        required: true 
      },
      description: { type: String, required: true },
      pointsPerDollar: { type: Number, required: true, min: 0 },
      minAmount: { type: Number, min: 0 },
      maxPoints: { type: Number, min: 0 },
      validFrom: { type: Date, required: true },
      validTo: { type: Date },
      conditions: {
        roomType: [{ type: String }],
        outletType: [{ type: String }],
        dayOfWeek: [{ type: Number, min: 0, max: 6 }],
        season: [{ type: String }]
      },
      isActive: { type: Boolean, default: true }
    }],
    redemptionRules: [{
      ruleId: { type: String, required: true },
      itemType: { 
        type: String, 
        enum: ['room_upgrade', 'amenity', 'discount', 'free_night', 'service'],
        required: true 
      },
      itemName: { type: String, required: true },
      pointsRequired: { type: Number, required: true, min: 1 },
      maxRedemptions: { type: Number, min: 1 },
      validFrom: { type: Date, required: true },
      validTo: { type: Date },
      conditions: {
        minStay: { type: Number, min: 1 },
        advanceBooking: { type: Number, min: 0 },
        blackoutDates: [{ type: Date }]
      },
      isActive: { type: Boolean, default: true }
    }],
    settings: {
      pointsExpiryMonths: { type: Number, default: 24, min: 1 },
      allowPointTransfer: { type: Boolean, default: false },
      allowPointGift: { type: Boolean, default: false },
      maxGiftPoints: { type: Number, default: 1000, min: 0 },
      requireEmailVerification: { type: Boolean, default: true },
      autoTierUpgrade: { type: Boolean, default: true },
      birthdayBonus: { type: Number, default: 100, min: 0 },
      anniversaryBonus: { type: Number, default: 200, min: 0 }
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    totalMembers: { type: Number, default: 0, min: 0 },
    totalPointsIssued: { type: Number, default: 0, min: 0 },
    totalPointsRedeemed: { type: Number, default: 0, min: 0 },
    totalRedemptions: { type: Number, default: 0, min: 0 },
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
loyaltyProgramSchema.index({ hotelId: 1, programCode: 1 }, { unique: true });
loyaltyProgramSchema.index({ hotelId: 1, status: 1 });
loyaltyProgramSchema.index({ hotelId: 1, startDate: 1 });
loyaltyProgramSchema.index({ hotelId: 1, endDate: 1 });

const LoyaltyProgram =
  (mongoose.models.LoyaltyProgram as mongoose.Model<ILoyaltyProgram>) ||
  mongoose.model<ILoyaltyProgram>("LoyaltyProgram", loyaltyProgramSchema);

export default LoyaltyProgram;






import { Types } from "mongoose";
import Stay from "./entity";
import { IAddStayInput, IEditStayUserInput } from "./interface";
import { StayStatus, StayType, PaymentStatus } from "./enum";
// Import models to ensure they're registered with Mongoose
import "../room/model";
import "../roomType/model";

class StayService {
  public async createStay(input: IAddStayInput) {
      const stay = new Stay({
        ...input,
      });
      
      await stay.save();

    return stay;
  }


 public async findConflictingReservations(
  roomId: Types.ObjectId,
  checkInDate: Date,
  checkOutDate: Date
) {
  return await Stay.findOne({
    roomId,
    type: { $in: [StayType.RESERVED, StayType.BOOKED] },
    status: { $in: [StayStatus.CONFIRMED, StayStatus.CHECKED_IN] },

    // Only consider reservations that are still valid (not expired)
    $or: [
      // For RESERVED: payment date hasn't expired yet OR payment is already made
      {
        type: StayType.RESERVED,
        $or: [
          { paymentDate: { $gte: new Date() } }, // Payment date is in the future
          { paymentStatus: PaymentStatus.PAID }  // Payment already made
        ]
      },
      // For BOOKED: always valid (they're already paid)
      {
        type: StayType.BOOKED
      }
    ],

    // overlapping reservation logic
    $and: [
      {
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate },
          },
        ],
      }
    ]
  });
}


public async findStaysByHotelId(hotelId: Types.ObjectId) {
  const stays = await Stay.find({ hotelId })
    .populate({
      path: "roomId",        
      select: "roomNumber roomTypeId",
      populate: {
        path: "roomTypeId",  
        select: "name price",      
      },
    });

  return stays;
}

public async findStayById(id: string) {
  const stay = await Stay.findById(id);

  return stay;
}

 public async editStay(input: IEditStayUserInput, hotelId: Types.ObjectId) {
    const { stayId, status, paymentStatus, ...updateData } = input;

    // Step 1: Find existing stay
    const existingStay = await Stay.findOne({ _id: stayId, hotelId });

    if (!existingStay) {
      return;
    }

    // ✅ Step 2: StayStatus forward-only logic
    if (status) {
      const statusOrder = [
        StayStatus.CONFIRMED,
        StayStatus.CHECKED_IN,
        StayStatus.CHECKED_OUT,
        StayStatus.CANCELLED,
      ];

      const currentIndex = statusOrder.indexOf(existingStay.status);
      const newIndex = statusOrder.indexOf(status);

      if (newIndex < currentIndex) {
      
         return `Invalid stay status update. Cannot change from '${existingStay.status}' to '${status}'.`
        
      }
    }

    // ✅ Step 3: PaymentStatus transition map logic
    if (paymentStatus && existingStay.paymentStatus) {
      const validPaymentTransitions: Record<PaymentStatus, PaymentStatus[]> = {
        [PaymentStatus.PENDING]: [PaymentStatus.PAID, PaymentStatus.CANCELLED],
        [PaymentStatus.PAID]: [PaymentStatus.REFUNDED, PaymentStatus.CANCELLED],
        [PaymentStatus.REFUNDED]: [PaymentStatus.PAID], // correction allowed
        [PaymentStatus.CANCELLED]: [PaymentStatus.PAID], // manual override allowed
      };

      const allowedNext =
        validPaymentTransitions[existingStay.paymentStatus] || [];

      if (
        !allowedNext.includes(paymentStatus) &&
        paymentStatus !== existingStay.paymentStatus
      ) {
     
         return `Invalid payment status transition: '${existingStay.paymentStatus}' → '${paymentStatus}'.`
        
      }
    }

    // ✅ Step 4: Update stay
    const updatedStay = await Stay.findOneAndUpdate(
      { _id: stayId, hotelId },
      { $set: { ...updateData, status, paymentStatus } },
      { new: true, runValidators: true }
    ).populate({
      path: "roomId",
      select: "roomNumber roomTypeId",
      populate: {
        path: "roomTypeId",
        select: "name",
      },
    });

    return updatedStay;
  }
   
}

export const stayService = new StayService();
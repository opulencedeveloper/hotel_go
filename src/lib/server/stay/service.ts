import { Types } from "mongoose";
import Stay from "./entity";
import { IAddStayInput, IEditStayUserInput } from "./interface";
import { StayStatus, StayType, PaymentStatus } from "./enum";
import { roomService } from "../room/service";
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
    type: { $in: [StayType.RESERVED, StayType.BOOKED, StayType.WALK_IN] },
    status: { $in: [StayStatus.CONFIRMED, StayStatus.CHECKED_IN] },

    // Only consider valid, non-expired stays
    $or: [
      // For RESERVED: still valid if payment date hasn't expired or it's already paid
      {
        type: StayType.RESERVED,
        $or: [
          { paymentDate: { $gte: new Date() } },
          { paymentStatus: PaymentStatus.PAID },
        ],
      },
      // For BOOKED: always valid (already paid)
      {
        type: StayType.BOOKED,
      },
      // For WALK_IN: valid if still checked in (not checked out yet)
      {
        type: StayType.WALK_IN,
        status: StayStatus.CHECKED_IN,
      },
    ],

    // Overlapping reservation logic
    $and: [
      {
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate },
          },
        ],
      },
    ],
  });
}



public async findStaysByHotelId(hotelId: Types.ObjectId) {
  const stays = await Stay.find({ hotelId })
    .populate({
      path: "roomId",        
      select: "roomNumber roomTypeId",
      // populate: {
      //   path: "roomTypeId",  
      //   select: "name price",      
      // },
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
     
         return `Invalid payment status transition: '${existingStay.paymentStatus}' to '${paymentStatus}'.`
        
      }
    }

  if (paymentStatus === PaymentStatus.PAID && existingStay.type === StayType.RESERVED) {
      const checkInTime = new Date(existingStay.checkInDate).getTime();
      const checkOutTime = new Date(existingStay.checkOutDate).getTime();
      const msPerNight = 1000 * 60 * 60 * 24;
      const nights = Math.max(1, Math.ceil((checkOutTime - checkInTime) / msPerNight));

      const room = await roomService.findRoomByRoomIdAndHotellId(
        existingStay.roomId.toString(),
        hotelId.toString()
      );
      const price = (room as any)?.roomTypeId?.price;
      if (price !== undefined && price !== null) {
        (updateData as any).totalAmount = price * nights;
        (updateData as any).paidAmount = price * nights;
        (updateData as any).roomRateAtPayment = price
      }
  }

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
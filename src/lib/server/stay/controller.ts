import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { hotelService } from "../hotel/service";
import { roomTypeService } from "../roomType/service";
import { IAddStayUserInput, IEditStayUserInput } from "./interface";
import { roomService } from "../room/service";
import { RoomStatus } from "../room/enum";
import { stayService } from "./service";
import { PaymentStatus, StayStatus, StayType } from "./enum";

class StayController {
  public async addStay(body: IAddStayUserInput, customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    const roomNoExist = await roomService.findRoomByRoomIdAndHotellId(
      body.roomId!.toString(),
      hotelId!.toString()
    );

    if (!roomNoExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room does not exist!",
        data: null,
      });
    }

    if (roomNoExist.roomStatus !== RoomStatus.Available) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room is not avaialable!",
        data: null,
      });
    }

    const conflictingReservations =
      await stayService.findConflictingReservations(
        body.roomId,
        body.checkInDate,
        body.checkOutDate
      );

    console.log("conflictingReservations", conflictingReservations);
    if (conflictingReservations) {
      const { checkInDate, checkOutDate, type, paymentStatus } =
        conflictingReservations;

      // Block conflicts for both PAID and PENDING reservations/bookings
      if (
        paymentStatus === PaymentStatus.PAID ||
        paymentStatus === PaymentStatus.PENDING
      ) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: `Sorry, this room is already ${type} from ${new Date(
            checkInDate
          ).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })} to ${new Date(checkOutDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}. Please choose a different date.`,
          data: null,
        });
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const stay = await stayService.createStay({
      ...body,
      hotelId: hotelId!,
      ...(body.type === StayType.WALK_IN && {
        totalAmount: (roomNoExist.roomTypeId as any)?.price,
        paidAmount: (roomNoExist.roomTypeId as any)?.price,
      }),
      paymentDate: body.type !== StayType.RESERVED ? today : body.paymentDate,
      paymentStatus:
        body.type === StayType.RESERVED
          ? PaymentStatus.PENDING
          : PaymentStatus.PAID,
      status:
        body.type === StayType.WALK_IN
          ? StayStatus.CHECKED_IN
          : StayStatus.CONFIRMED,
    });

    if (body.type === StayType.WALK_IN) {
      await roomService.updateRoomStatusByIdAndHotelId(
        body.roomId,
        hotelId!,
        RoomStatus.Occupied
      );
    }

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Stay registered successfully!",
      data: { stay },
    });
  }

  public async fetchAllStays(req: CustomRequest) {
    const { hotelId } = req;

    const stays = await stayService.findStaysByHotelId(hotelId!);

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Stays fetched successfully!",
      data: {
        stays,
      },
    });
  }

  public async editStay(body: IEditStayUserInput, customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    const stayExits = await stayService.findStayById(body.stayId);

    if (!stayExits) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Stay not found!",
        data: null,
      });
    }
    const editedStay = await stayService.editStay(
      {
        ...body,
        ...(stayExits.type !== StayType.WALK_IN && {
          paymentStatus: body.paymentStatus,
        }),
      },
      hotelId!
    );

    if (!editedStay) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Stay not found!",
        data: null,
      });
    }

    if (typeof editedStay === "string") {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: editedStay,
        data: null,
      });
    }

    if (editedStay.status === StayStatus.CHECKED_OUT) {
      await roomService.updateRoomStatusByIdAndHotelId(
        editedStay.roomId,
        hotelId!,
        RoomStatus.MarkForCleaning
      );
    }

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Stay edited successfully!",
      data: { editedStay },
    });
  }
}

export const stayController = new StayController();

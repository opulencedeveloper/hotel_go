import { MessageResponse } from "../utils/enum";
import {
  IAddHotelAmenities,
  IAddRoomUserInput,
  IEditRoomUserInput,
} from "./interface";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { hotelService } from "../hotel/service";
import { roomService } from "./service";
import { roomTypeService } from "../roomType/service";
import { userService } from "../user/service";
import { licenseKeyService } from "../license-key/service";
import { planService } from "../plan/service";

class RoomController {
  public async addRoom(body: IAddRoomUserInput, customReq: CustomRequest) {
    const {hotelId, ownerId} = customReq;

    // Find user by ownerId
    const user = await userService.findUserById(ownerId!);

    if (!user) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    // Check if user has a license key
    if (!user.licenseKeyId) {
      return utils.customResponse({
        status: 403,
        message: MessageResponse.Error,
        description: "No license key associated with this user. Please activate a license key first.",
        data: null,
      });
    }

    // Find license by licenseKeyId
    const license = await licenseKeyService.findLicenseById(
      user.licenseKeyId.toString()
    );

    if (!license) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "License key not found!",
        data: null,
      });
    }

    // Get planId from license
    if (!license.planId) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Plan not found for this license!",
        data: null,
      });
    }

    // Find plan by planId
    const plan = await planService.findPlanById(license.planId.toString());

    if (!plan) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Plan not found!",
        data: null,
      });
    }

    // Check if maxRoom is set (null means unlimited)
    if (plan.maxRoom !== null) {
      // Count existing rooms for this hotel - optimized query
      const currentRoomCount = await roomService.countRoomsByHotelId(hotelId!);

      // Check if adding this room would exceed the limit
      if (currentRoomCount >= plan.maxRoom) {
        return utils.customResponse({
          status: 403,
          message: MessageResponse.Error,
          description: `You have reached the maximum number of rooms (${plan.maxRoom}) allowed by your current plan. Please upgrade your plan to add more rooms.`,
          data: null,
        });
      }
    }

    // Check if room number already exists
    const roomNoExist = await roomService.findRoomByRoomNoAndHotelId(
      body.roomNumber,
      hotelId!.toString()
    );

    if (roomNoExist) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Room number exist!",
        data: null,
      });
    }

    // Check if room type exists
    const roomTypeExist = await roomTypeService.findHotelRoomTypeById(
      body.roomTypeId
    );

    if (!roomTypeExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room type not found or deleted!",
        data: null,
      });
    }

    // Proceed with room creation
    const addedRoom = await roomService.createRoom({
      ...body,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Room added successfully!",
      data: addedRoom,
    });
  }

  public async fetchRoomDetails(req: CustomRequest) {
    const { hotelId } = req;

    const hotelRoomTypes = await roomTypeService.findHotelRoomTypeByHotelId(
      hotelId!
    );

    const hotelRooms = await roomService.findRoomsByHotelId(hotelId!);

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Hotel Details successfully!",
      data: {
        hotelRoomTypes,
        hotelRooms,
      },
    });
  }

  public async editRoom(body: IEditRoomUserInput, customReq: CustomRequest) {
    const hotelId = customReq.hotelId;

    const room = await roomService.findRoomByRoomIdAndHotellId(
      body.roomId,
      hotelId!.toString()
    );

    if (!room) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room not found or deleted!",
        data: null,
      });
    }

    if (room.roomNumber.trim().toLowerCase() !== body.roomNumber.trim().toLowerCase()) {
      const roomNoExist = await roomService.findRoomByRoomNoAndHotelId(
        body.roomNumber,
        hotelId!.toString()
      );

      if (roomNoExist) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Room number exist!",
          data: null,
        });
      }
    }

    const updatedRoom = await roomService.editRoomByIdAndHotelId(
      body,
      hotelId!
    );

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Room edited successfully!",
      data: { updatedRoom },
    });
  }

    public async markRoomForCleaning(roomId: string) {

    const updatedRoom= await roomService.findRoomByIdAndMarkForCleaning(
   roomId
    );

    if (!updatedRoom) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room not found or deleted!",
        data: null,
      });
    }

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Room marked for cleaning successfully!",
      data: { updatedRoom },
    });
  }
}

export const roomController = new RoomController();

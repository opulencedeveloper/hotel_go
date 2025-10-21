import { MessageResponse } from "../utils/enum";
import { IAddRoomTypeUserInput, IEditRoomTypeUserInput } from "./interface";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { roomTypeService } from "./service";
import { Types } from "mongoose";

class RoomTypeController {
  public async addRoomType(
    body: IAddRoomTypeUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const roomTypeExist = await roomTypeService.findRoomTypeByNameAndHotelId(
      body.name,
      hotelId!.toString()
    );

    if (roomTypeExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room type exist!",
        data: null,
      });
    }

    const addedRoomType = await roomTypeService.addRoomType({
      ...body,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.VerifyEmail,
      description: "Room type added successfully!",
      data: { addedRoomType },
    });
  }

  public async editRoomType(
    body: IEditRoomTypeUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const updatedRoomType = await roomTypeService.editRoomType(body, hotelId!);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.VerifyEmail,
      description: "Room type added successfully!",
      data: { updatedRoomType },
    });
  }


  public async deleteRoomType(
    roomTypeId: string,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const deletedRoomType = await roomTypeService.deleteRoomTypeByIdAndHotelId(roomTypeId, hotelId!);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.VerifyEmail,
      description: "Room type deleted successfully!",
      data: { deletedRoomType },
    });
  }
}

export const roomTypeController = new RoomTypeController();

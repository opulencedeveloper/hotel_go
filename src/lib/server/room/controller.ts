import { MessageResponse } from "../utils/enum";
import { IAddHotelAmenities, IAddRoomUserInput, IEditRoomUserInput } from "./interface";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { hotelService } from "../hotel/service";
import { roomService } from "./service";
import { roomTypeService } from "../roomType/service";

class RoomController {
  public async addRoom(body: IAddRoomUserInput, customReq: CustomRequest) {
   
    const hotelId = customReq.hotelId;

    const roomNoExist = await roomService.findRoomByRoomNoAndHotelId(
      body.roomNumber,
      hotelId!.toString()
    );

    if (roomNoExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Room number exist!",
        data: null,
      });
    }
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

  const addedRoom =  await roomService.createRoom({
      ...body,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.VerifyEmail,
      description: "Room added successfully!",
      data: addedRoom,
    });
  }

  public async fetchRoomDetails(req: CustomRequest) {
    const { hotelId } = req;

    const hotelRoomTypes = await roomTypeService.findHotelRoomTypeByHotelId(
      hotelId!
    );

     const hotelRooms = await roomService.findRoomsByHotelId(
      hotelId!
    );

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Hotel Details successfully!",
      data: {
        hotelRoomTypes,
        hotelRooms
      },
    });
  }

    public async editRoom(
      body: IEditRoomUserInput,
      customReq: CustomRequest
    ) {
      const hotelId = customReq.hotelId;
  
      const updatedRoom = await roomService.editRoomByIdAndHotelId(body, hotelId!);
  
      return utils.customResponse({
        status: 201,
        message: MessageResponse.VerifyEmail,
        description: "Room edited successfully!",
        data: { updatedRoom },
      });
    }
}

export const roomController = new RoomController();

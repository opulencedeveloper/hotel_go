import { MessageResponse } from "../utils/enum";
import {
  ICreateHotelServiceUserInput,
  IEditHotelServiceUserInput,
} from "./interface";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { hoteServiceService } from "./service";
import HotelService from "./entity";
import { roomService } from "../room/service";

class HotelServiceController {
  public async createHotelService(
    body: ICreateHotelServiceUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const hotelServiceExist =
      await hoteServiceService.findHotelServiceByNameAndHotelId(
        body.name,
        hotelId!
      );

    if (hotelServiceExist) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Service name exists!",
        data: null,
      });
    }

    const createdHotelService = await hoteServiceService.createHotelService({
      ...body,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Hotel service created successfully!",
      data: { createdHotelService },
    });
  }

  public async fetchAllHotelServices(req: CustomRequest) {
    const { hotelId } = req;

    const hotelServices = await hoteServiceService.findHotelServicesByHotelId(
      hotelId!
    );

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Hotel services fetched successfully!",
      data: {
        hotelServices,
      },
    });
  }

  public async editHotelService(
    body: IEditHotelServiceUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const hotelServiceExist =
      await hoteServiceService.findHotelServiceByHotelServiceIdAndHotellId(
        body.hotelServiceId,
        hotelId!
      );

    if (!hotelServiceExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Service not found or deleted!",
        data: null,
      });
    }

    if (
      hotelServiceExist.name.trim().toLowerCase() !==
      body.name.trim().toLowerCase()
    ) {
      const roomNoExist = await hoteServiceService.findHotelServiceByIdAndName(
        body.hotelServiceId,
        body.name
      );

      if (roomNoExist) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Service name exist!",
          data: null,
        });
      }
    }

    const updatedHotelService =
      await hoteServiceService.editHotelServiceByIdAndHotelId(body, hotelId!);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Service edited successfully!",
      data: { updatedHotelService },
    });
  }
}

export const hotelServiceController = new HotelServiceController();

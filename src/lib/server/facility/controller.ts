import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import { ICreateFacilityUserInput, IEditFacilityUserInput } from "./interface";
import { facilityService } from "./service";
import { roomService } from "../room/service";

class FacilityController {
  public async createFacility(
    body: ICreateFacilityUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const facilityExist = await facilityService.findFacilityByNameAndHotelId(
      body.facilityName,
      hotelId!.toString()
    );

    if (facilityExist) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Facility name exist!",
        data: null,
      });
    }

    const facility = await facilityService.createFacility({
      ...body,
      hotelId: hotelId!,
    });

    console.log(facility);
    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Facility created successfully!",
      data: { facility },
    });
  }

  public async fetchAllFacilities(req: CustomRequest) {
    const { hotelId } = req;

    const facilities = await facilityService.findFacilityByHotelId(hotelId!);

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Hotel services fetched successfully!",
      data: {
        facilities,
      },
    });
  }

  public async editFacility(
    body: IEditFacilityUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const facility = await facilityService.findFacilityById(body.facilityId);

    if (!facility) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Facility not found or deleted!",
        data: null,
      });
    }

    if (
      facility.facilityName.trim().toLowerCase() !==
      body.facilityName.trim().toLowerCase()
    ) {
      const facilityExist = await facilityService.findFacilityByNameAndHotelId(
        body.facilityName,
        hotelId!.toString()
      );

      if (facilityExist) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Facility name exist!",
          data: null,
        });
      }
    }

    const updatedFacility = await facilityService.editFacilityByIdAndHotelId(
      body,
      hotelId!
    );

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Facility edited successfully!",
      data: { updatedFacility },
    });
  }
}

export const facilityController = new FacilityController();

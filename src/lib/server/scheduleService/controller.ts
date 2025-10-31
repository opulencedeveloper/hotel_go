import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";

import { CustomRequest } from "../utils/interface";
import {
  ICreateScheduledServiceUserInput,
  IEditScheduledServiceUserInput,
} from "./interface";
import { hoteServiceService } from "../hotelService/service";
import { scheduledServiceService } from "./service";
import { HotelServiceStatus } from "../hotelService/enum";
import { PaymentStatus } from "../stay/enum";

class ScheduleServiceController {
  public async createScheduleService(
    body: ICreateScheduledServiceUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const hotelServiceExist = await hoteServiceService.findHotelServiceById(
      body.hotelServiceId!.toString()
    );

    if (!hotelServiceExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Hotel Service does not exist!",
        data: null,
      });
    }

    if (hotelServiceExist.status !== HotelServiceStatus.ACTIVE) {
      if (!hotelServiceExist) {
        return utils.customResponse({
          status: 404,
          message: MessageResponse.Error,
          description: "Hotel Service is not available !",
          data: null,
        });
      }
    }

    console.log("newScheduledService", body);

    const hasServiceBeenScheduled =
      await scheduledServiceService.fetchScheduledServiceBySchedule(
        body.scheduledAt
      );

    if (hasServiceBeenScheduled) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Success,
        description:
          "A service has already been scheduled for the selected date and time.",
        data: null,
      });
    }

    const newScheduledService =
      await scheduledServiceService.creatScheduledServiceService({
        totalAmount: hotelServiceExist.price,
        paymentStatus: PaymentStatus.PAID,
        ...body,
        hotelId: hotelId!,
      });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Service scheduled successfully!",
      data: { newScheduledService },
    });
  }

  public async fetchAllScheduledServices(req: CustomRequest) {
    const { hotelId } = req;

    const scheduledServices =
      await scheduledServiceService.fetchScheduledServiceByHotelId(hotelId!);

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Scheduled services fetched successfully!",
      data: {
        scheduledServices,
      },
    });
  }

  public async editScheduledService(
    body: IEditScheduledServiceUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const hotelServiceExist =
      await hoteServiceService.findHotelServiceByHotelServiceIdAndHotellId(
        body.hotelServiceId!.toString(),
        hotelId!
      );

    if (!hotelServiceExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Hotel service not found or deleted!",
        data: null,
      });
    }

    const scheduledServiceExist =
      await scheduledServiceService.findScheduledServiceByIdAndHotellId(
        body.scheduledServiceId.toString(),
        hotelId!
      );

    if (!scheduledServiceExist) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Schedule service not found or deleted!",
        data: null,
      });
    }

    const updatedScheduledService =
      await scheduledServiceService.editHotelScheduledServiceByIdAndHotelId(
        body,
        hotelId!
      );

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Schedule service edited successfully!",
      data: { updatedScheduledService },
    });
  }
}

export const scheduleServiceController = new ScheduleServiceController();

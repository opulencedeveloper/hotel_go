import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import {
  ICreateStaffPasswordUserInput,
  ICreateStaffUserInput,
  IEditStaffUserInput,
} from "./interface";
import { staffService } from "./service";

class StaffController {
  public async createStaff(
    body: ICreateStaffUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const emailExist = await staffService.findStaffEmailAndHotelId(body.email, hotelId!);

    if (emailExist) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Email already exist!",
        data: null,
      });
    }

    const newStaff = await staffService.createStaff({
      ...body,
      hotelId: hotelId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Staff created successfully!",
      data: { newStaff },
    });
  }

  public async fetchAlStaffs(req: CustomRequest) {
    const { hotelId } = req;

    const staffs = await staffService.findStaffsByHotelId(hotelId!);

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Staffs fetched successfully!",
      data: {
        staffs,
      },
    });
  }

  public async updateStaff(
    body: IEditStaffUserInput,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const staff = await staffService.findStaffById(body.staffId!);

    if (!staff) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Staff not found!",
        data: null,
      });
    }

    const updatedStaff = await staffService.editStaffById(body);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Staff updated successfully!",
      data: { updatedStaff },
    });
  }

  public async createStaffPassword(body: ICreateStaffPasswordUserInput) {
    const staff = await staffService.findStaffById(body.staffId!);

    if (!staff) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Staff not found!",
        data: null,
      });
    }

    await staffService.createStaffPassword(body);

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Staff password created successfuly!",
      data: null,
    });
  }
}

export const staffController = new StaffController();

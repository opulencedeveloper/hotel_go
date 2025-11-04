import { MessageResponse } from "../utils/enum";
import {
  IAddHotelRegistrationUserInput,
  IHotelRegistrationInput,
  IHotelRegistrationUserInput,
} from "./interface";
import { utils } from "../utils";

import { userService } from "../user/service";
import { hotelService } from "./service";
import { licenseKeyService } from "../license-key/service";
import { planService } from "../plan/service";
import { sendEmailVerificationMail } from "../utils/email";
import { IAddHotelAmenities } from "../room/interface";
import { CustomRequest } from "../utils/interface";

const jwtSecret = process.env.JWT_SECRET || "";
const tokenExpiry = process.env.TOKEN_EXPIRY || "";

class HotelController {
  public async registerHotel(body: IHotelRegistrationUserInput) {
    const emailExists = await userService.findUserByEmail(body.email);

    if (emailExists) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Email already exists!",
        data: null,
      });
    }

    const createdUser = await userService.createSuperAdmin(body);

    const createdHotel = await hotelService.registerHotel({
      ownerId: createdUser.savedUser._id,
      ...body,
    });

    console.log(createdUser.savedUser._id, createdHotel._id);

    const updatedUser = await userService.findUserByIdAndUpdateHotelId(
      createdUser.savedUser._id,
      createdHotel._id
    );

    if (!updatedUser) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Could not complete!",
        data: null,
      });
    }

   await sendEmailVerificationMail({
      email: body.email,
      otp: createdUser.otp,
      expiryTime: createdUser.expiryTime,
      firstName: createdUser.savedUser.firstName,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Hotel created successfully, please verify email!",
      data: null,
    });
  }

  public async addHotel(
    req: CustomRequest,
    body: IAddHotelRegistrationUserInput
  ) {
    const { ownerId } = req;

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

    // Check if multiProperty is true
    if (!plan.multiProperty) {
      return utils.customResponse({
        status: 403,
        message: MessageResponse.Error,
        description: "Your current plan does not support multiple properties. Please upgrade your plan to add multiple properties.",
        data: null,
      });
    }

    // Proceed with hotel creation
    const newHotel = await hotelService.registerHotel({
      ...body,
      ownerId: ownerId!,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Hotel added successfully!",
      data: { newHotel },
    });
  }

  public async addHotelAmenities(
    body: IAddHotelAmenities,
    customReq: CustomRequest
  ) {
    const hotelId = customReq.hotelId;

    const updatedHotel = await hotelService.findHotelIdAndUpdateAmenities(
      body.amenities,
      hotelId!
    );

    if (!updatedHotel) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "An error occured!",
        data: null,
      });
    }

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "Amenities added successfully!",
      data: { amenities: updatedHotel.amenities },
    });
  }
}

export const hotelController = new HotelController();

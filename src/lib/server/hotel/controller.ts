import { MessageResponse } from "../utils/enum";
import { IHotelRegistrationUserInput } from "./interface";
import { utils } from "../utils";

import { userService } from "../user/service";
import { hotelService } from "./service";
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

    console.log(createdUser.savedUser._id,
      createdHotel._id)

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

  await  sendEmailVerificationMail({
      email: body.email,
      otp: createdUser.otp,
      expiryTime: createdUser.expiryTime,
      firstName: createdUser.savedUser.firstName,
    });

    return utils.customResponse({
      status: 201,
      message: MessageResponse.VerifyEmail,
      description: "Hotel created successfully, please verify email!",
      data: null,
    });
  }



   public async addHotelAmenities(body: IAddHotelAmenities, customReq: CustomRequest) {
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
      data: {amenities: updatedHotel.amenities},
    });
  }
}

export const hotelController = new HotelController();

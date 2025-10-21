import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { utils } from "../utils";
import { IUser } from "./interface";
import { hotelService } from "../hotel/service";

class UserController {
  public async fetchUserDetails(req: CustomRequest, user: IUser) {
    const { userId } = req;

    const hotel = await hotelService.findHotelByOwnerId(userId!);

    if (!hotel) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Hotel not found!",
        data: null,
      });
    }

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Details fetched successfully!",
      data: {
        user,
        hotel,
      },
    });
  }
}

export const userController = new UserController();

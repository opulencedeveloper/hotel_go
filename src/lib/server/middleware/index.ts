import { utils } from "../utils";
import { CustomRequest } from "../utils/interface";
import { userService } from "../user/service";
import { Types } from "mongoose";
import { UserRole } from "../user/enum";
import { MessageResponse } from "../utils/enum";
import { hotelService } from "../hotel/service";
import { UserType } from "@/utils/enum";
import { staffService } from "../staff/service";

export default class GeneralMiddleware {
  static async hotelExist(hotelId: Types.ObjectId) {
    const hotel = await hotelService.findHotelById(hotelId!);

    if (!hotel) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 404,
          message: MessageResponse.Error,
          description: "Hotel not found!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isSuperAdmin(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.SuperAdmin) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isManager(req: CustomRequest) {
    const { userRole } = req as CustomRequest;

    if (userRole !== UserRole.Manager) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isFrontDesk(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.FrontDesk) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isHouseKeeping(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.HouseKeeping) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isKitchen(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.Kitchen) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isMaintance(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.Maintenance) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isAccounting(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.Accounting) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isSecurity(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.Security) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async isGuestService(req: CustomRequest) {
    const { userRole, userId } = req as CustomRequest;

    if (userRole !== UserRole.GuestServices) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "You are not authorized to make this request!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  static async doesUserExist(userId: Types.ObjectId, userRole: UserType) {
    let user = null;

    if (userRole === UserType.Owner) {
      user = await userService.findUserByIdWithoutPassword(userId!);
    }

    if (userRole === UserType.Staff) {
      user = await staffService.findStaffById(userId!.toString());
    }
    
    if (!user) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 404,
          message: MessageResponse.Error,
          description: "User does not exist!",
          data: null,
        }),
      };
    }

    return {
      valid: true,
      user,
    };
  }
}

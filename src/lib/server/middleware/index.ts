import { utils } from "../utils";
import { CustomRequest } from "../utils/interface";
import { userService } from "../user/service";
import { Types } from "mongoose";
import { UserRole } from "../user/enum";
import { MessageResponse } from "../utils/enum";
import { hotelService } from "../hotel/service";
import { UserType } from "@/utils/enum";
import { staffService } from "../staff/service";
import { licenseKeyService } from "../license-key/service";

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


  static async hasLicenseKey(ownerId: Types.ObjectId) {
    const user = await userService.findUserByIdWithoutPassword(ownerId);
    
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

    // Check if user has a license key ID
    if (!user.licenseKeyId) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 403,
          message: MessageResponse.InvaldLicenseId,
          description: "No license key associated with this user!",
          data: null,
        }),
      };
    }

    // Find the license by ID
    const license = await licenseKeyService.findLicenseById(user.licenseKeyId.toString());
    
    if (!license) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 404,
          message: MessageResponse.InvaldLicenseId,
          description: "License key not found!",
          data: null,
        }),
      };
    }

    // Check if license is activated
    if (!license.activated) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 403,
          message: MessageResponse.InvaldLicenseId,
          description: "License key has not been activated. Please submit your license key to activate your account.",
          data: null,
        }),
      };
    }

    // Check if license has expired
    if (license.expiresAt) {
      const now = new Date();
      const expirationDate = new Date(license.expiresAt);
      
      if (expirationDate < now) {
        return {
          valid: false,
          response: utils.customResponse({
            status: 403,
            message: MessageResponse.ExpiredLicenseId,
            description: `License key has expired on ${expirationDate.toLocaleDateString()}. Please renew your subscription.`,
            data: null,
          }),
        };
      }
    }

    // License is valid and not expired
    return {
      valid: true,
      user,
      license,
    };
  }
}

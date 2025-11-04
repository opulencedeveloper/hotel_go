import { MessageResponse } from "../utils/enum";
import { MessageResponse as ClientMessageResponse } from "@/utils/enum";
import {
    IActivateLicenceKey,
} from "./interface";
import { utils } from "../utils";

import { userService } from "../user/service";
import { licenseKeyService } from "./service";
import { sendEmailVerificationMail } from "../utils/email";
import { IAddHotelAmenities } from "../room/interface";
import { CustomRequest } from "../utils/interface";

const jwtSecret = process.env.JWT_SECRET || "";
const tokenExpiry = process.env.TOKEN_EXPIRY || "";

class LicenceKeyController {
  public async activateLicenceKey(body: IActivateLicenceKey, customReq: CustomRequest) {
    const { ownerId } = customReq;
   
    // First, check if the license key exists
    const existingLicense = await licenseKeyService.findLicenseByKey(body.licenceKey);

    if (!existingLicense) {
      return utils.customResponse({
        status: 404,
        message: ClientMessageResponse.InvaldLicenseId,
        description: "License key not found. Please check your license key and try again.",
        data: null,
      });
    }

    // Check if license is already activated (has a userId)
    if (existingLicense.userId) {
      return utils.customResponse({
        status: 409,
        message: ClientMessageResponse.InvaldLicenseId,
        description: "This license key has already been activated by another user. Each license key can only be used once.",
        data: null,
      });
    }

    // Check if license is already activated (activated flag is true)
    if (existingLicense.activated) {
      return utils.customResponse({
        status: 409,
        message: ClientMessageResponse.InvaldLicenseId,
        description: "This license key has already been activated. Each license key can only be used once.",
        data: null,
      });
    }

    // Try to activate the license
    const licence = await licenseKeyService.activateLicenceKey(body.licenceKey, ownerId!);

    if (!licence) {
      return utils.customResponse({
        status: 409,
        message: ClientMessageResponse.InvaldLicenseId,
        description: "This license key has already been activated. Each license key can only be used once.",
        data: null,
      });
    }

    // Check if license has expired
    if (licence.expiresAt) {
      const now = new Date();
      const expirationDate = new Date(licence.expiresAt);
      
      if (expirationDate < now) {
        return utils.customResponse({
          status: 403,
          message: ClientMessageResponse.ExpiredLicenseId,
          description: `License key has expired on ${expirationDate.toLocaleDateString()}. Please renew your subscription to continue using HotelGo.`,
          data: null,
        });
      }
    }

    // Find user by ownerId and update their licenseKeyId
    const user = await userService.findUserByIdAndUpdateLicenseKeyId(
      ownerId!,
      licence._id
    );

    if (!user) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "User not found. Please try again.",
        data: null,
      });
    }

    return utils.customResponse({
      status: 201,
      message: MessageResponse.Success,
      description: "License key activated successfully!",
      data: null,
    });
  }
}

export const licenceKeyController = new LicenceKeyController();

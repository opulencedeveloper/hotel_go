import jwt from "jsonwebtoken";

import { cookies } from "next/headers";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { comparePassCode } from "../utils/auth";
import { IAdminLogin, ICreateAdmin } from "./interface";
import { adminService } from "./service";

const adminJwtSecret = process.env.ADMIN_JWT_SECRET || "";

class AdminController {
  public async logIn(body: IAdminLogin) {
    const { password, email } = body;

    const userExists = await adminService.findAdminByEmail(email);

    if (!userExists) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const match = await comparePassCode(password, userExists.password);

    console.log("Values:", password, userExists);

    if (!match) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        adminId: userExists._id,
        ownerId: userExists._id,
        // userRole: userExists.userRole,
        // userType: UserType.Owner,
        // email: userExists.email,
      },
      adminJwtSecret,
      {
        expiresIn: "30d",
      }
    );

    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Create response with user data
    const response = utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Logged in successfully",
      data: null,
    });

    // Set httpOnly cookies for security
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    };

    // Add cookies to response headers
    response.headers.set(
      "Set-Cookie",
      [
        `auth-token=${token}; ${Object.entries(cookieOptions)
          .map(([key, value]) => `${key}=${value}`)
          .join("; ")}`,
        `refresh-token=${token}; ${Object.entries({
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60,
        })
          .map(([key, value]) => `${key}=${value}`)
          .join("; ")}`,
      ].join(", ")
    );

    return response;
  }

  public async createAdmin(body: ICreateAdmin) {
    //await adminService.createSuperAdmin(body);

    return utils.customResponse({
      status: 400,
      message: MessageResponse.Success,
      description: "Admin created successfully!",
      data: null,
    });
  }


  public async fetchAdminDetails(body: IAdminLogin) {

  }
}

export const adminController = new AdminController();

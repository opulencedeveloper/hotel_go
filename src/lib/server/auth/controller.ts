import jwt from "jsonwebtoken";

import { cookies } from "next/headers";

import { MessageResponse } from "../utils/enum";
import {  IValidateEmail, IVerifyEmail } from "../utils/interface";
import { authService } from "./service";
import { utils } from "../utils";
import { userService } from "../user/service";
import { sendEmailVerificationMail, sendForgotPasswordEmail } from "../utils/email";
import { UserRole } from "../user/enum";
import { IForgotPasswordUserInput, ILogin } from "./interface";
import { comparePassCode } from "../utils/auth";
const jwtSecret = process.env.JWT_SECRET || "";
const tokenExpiry = process.env.TOKEN_EXPIRY || "";

// Helper function to get permissions for a role
const getPermissionsForRole = (userRole: string): string[] => {
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    manager: ['reservations.*', 'guests.*', 'rooms.*', 'staff.*', 'dashboard.*', 'reports.*'],
    front_desk: ['reservations.*', 'guests.*', 'rooms.view', 'dashboard.view'],
    housekeeping: ['rooms.view', 'rooms.update', 'dashboard.view'],
    kitchen: ['kitchen.*', 'dashboard.view'],
    maintenance: ['rooms.view', 'rooms.update', 'maintenance.*', 'dashboard.view'],
    accounting: ['reservations.view', 'guests.view', 'reports.*', 'dashboard.view'],
    security: ['security.*', 'dashboard.view'],
    guest_services: ['guests.*', 'reservations.view', 'dashboard.view']
  };
  
  return rolePermissions[userRole] || [];
};

class AuthController {
  public async emailVerifyOtp(body: IVerifyEmail) {
    const email = body.email;
    const otp = body.otp;

    const userOtpValidity = await authService.validateOtp(email, otp);

    if (!userOtpValidity) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Invalid otp",
        data: null,
      });
    }

      if(userOtpValidity.emailVerified) {
       return utils.customResponse({
      status: 400,
      message: MessageResponse.Error,
      description: "Email already verified!",
      data: null,
    });
    }

    if (userOtpValidity.emailVerificationOtpExpiration !== undefined) {
      const currentDate = new Date();

      const expirationDate = new Date(
        userOtpValidity.emailVerificationOtpExpiration
      );

      if (expirationDate < currentDate) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Email verification OTP has expired!",
          data: null,
        });
      }

      const userExists = await authService.verifyEmail(email);

      if (!userExists) {
        return utils.customResponse({
          status: 404,
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Verification successful",
        data: null
      });
    } else {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Email verification OTP expired",
        data: null,
      });
    }
  }


    public async changePasswordWithForgotPasswordOtp(body: IForgotPasswordUserInput) {
    const email = body.email;
    const otp = body.otp;
    const password = body.password;

    const userOtpValidity = await authService.validateOtp(email, otp);

    if (!userOtpValidity) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Invalid otp",
        data: null,
      });
    }


    if (userOtpValidity.emailVerificationOtpExpiration !== undefined) {
      const currentDate = new Date();

      const expirationDate = new Date(
        userOtpValidity.emailVerificationOtpExpiration
      );

      if (expirationDate < currentDate) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Email verification OTP has expired!",
          data: null,
        });
      }

      const userExists = await authService.changePasswordWithForgotpasswordRequest({email, password});

      if (!userExists) {
        return utils.customResponse({
          status: 404,
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Password changed successfully",
        data: null
      });
    } else {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "OTP expired",
        data: null,
      });
    }
  }

  public async resendEmailVerificationOtp(body: IValidateEmail) {
    const user = await userService.findUserByEmail(body.email);

    if (!user) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    if(user.emailVerified) {
       return utils.customResponse({
      status: 400,
      message: MessageResponse.Error,
      description: "Email already verified!",
      data: null,
    });
    }

    const email = user.email;
    const firstName = user.firstName;

    const otp = utils.generateOtp();

    await authService.saveOtp({ email, otp });

    sendEmailVerificationMail({ email, otp, firstName, expiryTime: "2 minutes" });

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Verification OTP resent!",
      data: null,
    });
  }



    public async forgotPassword(body: IValidateEmail) {
    const user = await userService.findUserByEmail(body.email);

    if (!user) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

     if(user.userRole !== UserRole.SuperAdmin) {
       return utils.customResponse({
      status: 400,
      message: MessageResponse.Error,
      description: "Please notify admin to chnage password!",
      data: null,
    });
    }

    const email = user.email;
    const firstName = user.firstName;

    const otp = utils.generateOtp();

    await authService.saveOtp({ email, otp });

    sendForgotPasswordEmail({ email, otp, firstName, expiryTime: "2 minutes" });

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Verification OTP resent!",
      data: null,
    });
  }

  public async logIn(body: ILogin) {
    const { password, email } = body;

    const userExists = await userService.findUserByEmail(email);

    if (!userExists) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const isEmailVerified = await authService.checkEmailVerificationStatus(
      email
    );

    if (!isEmailVerified) {
      const otp = utils.generateOtp();

      const email = userExists.email;

      const firstName = userExists.firstName;

      await authService.saveOtp({ email, otp });

      sendEmailVerificationMail({ email, otp, firstName, expiryTime: "2 minutes" });

      return utils.customResponse({
        status: 200,
        message: MessageResponse.VerifyEmail,
        description: `A  verication otp  has been sent to ${email}!`,
        data: null,
      });
    }

    const match = await comparePassCode(password, userExists.password);

    console.log(password, userExists.password);

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
        userId: userExists._id, 
        userRole: userExists.userRole,
        email: userExists.email,
        hotelId: userExists.hotelId?.toString() || null
      },
      jwtSecret,
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
      data: {
        user: {
          id: userExists._id.toString(),
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          email: userExists.email,
          role: userExists.userRole,
          permissions: getPermissionsForRole(userExists.userRole),
          hotelId: userExists.hotelId?.toString() || null,
        },
      },
    });

    // Set httpOnly cookies for security
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    };

    // Add cookies to response headers
    response.headers.set('Set-Cookie', [
      `auth-token=${token}; ${Object.entries(cookieOptions).map(([key, value]) => `${key}=${value}`).join('; ')}`,
      `refresh-token=${token}; ${Object.entries({...cookieOptions, maxAge: 30 * 24 * 60 * 60}).map(([key, value]) => `${key}=${value}`).join('; ')}`
    ].join(', '));

    return response;
  }
}

export const authController = new AuthController();

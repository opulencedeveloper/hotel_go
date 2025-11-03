import Joi from "joi";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IVerifyEmail } from "../utils/interface";
import { IForgotPasswordUserInput, ILogin } from "./interface";
import { Types } from "mongoose";

class AuthValidator {
  public emailVerifyOtp(body: IVerifyEmail) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      otp: Joi.string().required().messages({
        "any.required": "OTP is required.",
      }),
    });
    const { error } = schema.validate(body);

    if (error) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: error.details[0].message,
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }
  public validateEmail(email: string) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
    });

    const { error } = schema.validate({ email });

    if (error) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: error.details[0].message,
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  public resetPasswordWithForgotPasswordOtp(body: IForgotPasswordUserInput) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      otp: Joi.string().required().messages({
        "any.required": "OTP is required.",
      }),
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
          "any.required": "Password is required.",
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),

      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.required": "Confirm Password is required.",
          "any.only": "Passwords do not match",
        }),
    });
    const { error } = schema.validate(body);

    if (error) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: error.details[0].message,
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

  public logIn(body: ILogin) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required.",
      }),
    });

    console.log(body);
    const { error } = schema.validate(body);

    if (!error) {
      return {
        valid: true,
      };
    } else {
      console.log(error);
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: error.details[0].message,
          data: null,
        }),
      };
    }
  }

  public switchHotel(req: Request) {
    const schema = Joi.object({
      hotelId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Facility ID is required.",
          "any.invalid": "Facility ID must be a valid ObjectId.",
        }),
    });

    // Extract facilityId from query params if not in body
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");

    const { error, value } = schema.validate({ hotelId }, { convert: true });

    if (!error) {
      return { valid: true, value, hotelId };
    }

    return {
      valid: false,
      response: utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      }),
    };
  }
}

export const authValidator = new AuthValidator();

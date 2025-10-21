import Joi from "joi";
import { Types } from "mongoose";
import { PaymentMethod, PaymentStatus, StayStatus, StayType } from "./enum";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IAddStayUserInput, IEditStayUserInput } from "./interface";

class StayValidator {
  public addStay(body: IAddStayUserInput) {
    const paymentMethodValues = Object.values(PaymentMethod);

    const schema = Joi.object({
      roomId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Room ID is required.",
          "any.invalid": "Room ID must be a valid ObjectId.",
        }),

      guestName: Joi.string().trim().required().messages({
        "string.base": "Guest name must be text.",
        "any.required": "Guest name is required.",
      }),

      phoneNumber: Joi.string().trim().required().messages({
        "string.base": "Phone number must be text.",
        "any.required": "Phone number is required.",
      }),

      emailAddress: Joi.string().email().optional().allow("").messages({
        "string.email": "Please provide a valid email address.",
      }),

      address: Joi.string().trim().required().messages({
        "string.base": "Address must be text.",
        "any.required": "Address is required.",
      }),

      paymentMethod: Joi.string()
        .valid(...paymentMethodValues)
        .required()
        .messages({
          "any.required": "Payment method is required.",
          "any.only": `Payment method must be one of: ${paymentMethodValues.join(
            ", "
          )}.`,
        }),

      checkInDate: Joi.date()
        .required()
        .custom((value, helpers) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // reset time

          const checkIn = new Date(value);
          checkIn.setHours(0, 0, 0, 0); // reset time

          // Access the stay type from the parent object
          const stayType = helpers.state.ancestors[0]?.type;

          if (
            stayType === StayType.WALK_IN &&
            checkIn.getTime() !== today.getTime()
          ) {
            return helpers.error("any.invalid", {
              message: "Walk-in check-in date must be today.",
            });
          }

          if (checkIn < today) {
            return helpers.error("date.min", {
              message: "Check-in date cannot be in the past.",
            });
          }

          return value;
        })
        .messages({
          "date.base": "Check-in date must be a valid date.",
          "date.min": "Check-in date cannot be in the past.",
          "any.required": "Check-in date is required.",
          "any.invalid": "Walk-in check-in date must be today.",
        }),

      checkOutDate: Joi.date()
        .greater(Joi.ref("checkInDate"))
        .required()
        .messages({
          "date.base": "Check-out date must be a valid date.",
          "date.greater": "Check-out date must be after check-in date.",
          "any.required": "Check-out date is required.",
        }),

      type: Joi.string()
        .valid(...Object.values(StayType))
        .required()
        .messages({
          "any.only": "Type must be one of reserved, check_in, or walk_in.",
          "any.required": "Stay type is required.",
        }),

      paymentDate: Joi.when("type", {
        is: StayType.RESERVED,
        then: Joi.date().less(Joi.ref("checkInDate")).required().messages({
          "any.required": "Payment date is required for reserved stays.",
          "date.less": "Payment date must be before the check-in date.",
        }),
        otherwise: Joi.forbidden(),
      }),
      adults: Joi.number().integer().min(1).required().messages({
        "number.base": "Adults must be a number.",
        "number.min": "At least one adult is required.",
        "any.required": "Adults field is required.",
      }),

      children: Joi.number().integer().min(0).required().messages({
        "number.base": "Children must be a number.",
        "any.required": "Children field is required.",
      }),

      specialRequests: Joi.string()
        .trim()
        .optional()
        .allow("")
        .max(500)
        .messages({
          "string.base": "Special requests must be text.",
          "string.max": "Special requests cannot exceed 500 characters.",
        }),
    });

    const { error } = schema.validate(body, { abortEarly: true });

    if (!error) return { valid: true };

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

  public editStay(body: IEditStayUserInput, req: Request) {
    const schema = Joi.object({
      stayId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Room type ID id is required.",
          "any.invalid": "Room type ID id must be a valid ObjectId.",
        }),
      guestName: Joi.string().trim().required().messages({
        "string.base": "Guest name must be text.",
        "any.required": "Guest name is required.",
      }),

      phoneNumber: Joi.string().trim().required().messages({
        "string.base": "Phone number must be text.",
        "any.required": "Phone number is required.",
      }),

      emailAddress: Joi.string().email().optional().allow("").messages({
        "string.email": "Please provide a valid email address.",
      }),

      specialRequests: Joi.string()
        .trim()
        .optional()
        .allow("")
        .max(500)
        .messages({
          "string.base": "Special requests must be text.",
          "string.max": "Special requests cannot exceed 500 characters.",
        }),

        paymentStatus: Joi.string()
      .valid(...Object.values(PaymentStatus))
      .optional() // ✅ only validated if provided
      .messages({
        "any.only": `Payment status must be one of: ${Object.values(
          PaymentStatus
        ).join(", ")}.`,
      }),
      status: Joi.string()
        .valid(...Object.values(StayStatus))
        .required()
        .messages({
          "any.only": `Status must be one of: ${Object.values(StayStatus).join(
            ", "
          )}.`,
          "any.required": "Status is required.",
        }),
    });

    const { searchParams } = new URL(req.url);
    const stayId = searchParams.get("stayId");

    const { error } = schema.validate(
      { ...body, stayId },
      { abortEarly: true }
    );

    if (!error) return { valid: true, stayId };

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

export const stayValidator = new StayValidator();

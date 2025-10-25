import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import {
  ICreateScheduledServiceUserInput,
  IEditScheduledServiceUserInput,
} from "./interface";
import { Types } from "mongoose";

class ScheduleServiceValidator {
  public createScheduleService(body: ICreateScheduledServiceUserInput) {
    const schema = Joi.object({
      hotelServiceId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Hotel Service Id is required.",
          "any.invalid": "Hotel Service Id must be a valid ObjectId.",
        }),

      scheduledAt: Joi.date().required().min("now").messages({
        "date.base": "Scheduled date must be a valid date.",
        "date.min": "Scheduled date cannot be in the past.",
        "any.required": "Scheduled date is required.",
      }),

      note: Joi.string().trim().max(500).optional().allow("").messages({
        "string.base": "Note must be text if provided.",
        "string.max": "Note cannot exceed 500 characters.",
      }),
    });

    const { error } = schema.validate(body, { convert: true });

    if (!error) {
      return { valid: true };
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

  public ediScheduledService(
    body: IEditScheduledServiceUserInput,
    req: Request
  ) {
    const schema = Joi.object<IEditScheduledServiceUserInput>({
      scheduledServiceId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Scheduled ServiceId is required.",
          "any.invalid": "scheduled ServiceId must be a valid ObjectId.",
        }),

      hotelServiceId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Hotel ServiceId is required.",
          "any.invalid": "hotel ServiceId must be a valid ObjectId.",
        }),

      scheduledAt: Joi.date().required().min("now").messages({
        "date.base": "Scheduled date must be a valid date.",
        "date.min": "Scheduled date cannot be in the past.",
        "any.required": "Scheduled date is required.",
      }),

      notes: Joi.string().trim().max(500).optional().allow("").messages({
        "string.base": "Note must be text if provided.",
        "string.max": "Note cannot exceed 500 characters.",
      }),
    });

    const { searchParams } = new URL(req.url);
    const scheduledServiceId = searchParams.get("scheduledServiceId");

    // Validate and return clean result
    const { error, value } = schema.validate(
      { ...body, scheduledServiceId },
      { convert: true }
    );

    if (!error) {
      return { valid: true, value, scheduledServiceId };
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

export const scheduleSeviceValidator = new ScheduleServiceValidator();

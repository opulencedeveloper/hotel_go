import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { ICreateFacilityUserInput, IEditFacilityUserInput } from "./interface";
import { FacilityStatus } from "./enum";
import { Types } from "mongoose";

class FacilityValidator {
  public createFacility(body: ICreateFacilityUserInput) {
    const validStatuses = Object.values(FacilityStatus);

    const schema = Joi.object<ICreateFacilityUserInput>({
      facilityName: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Facility name must be text.",
        "string.empty": "Facility name is required.",
        "string.min": "Facility name must be at least 2 characters long.",
        "string.max": "Facility name cannot exceed 100 characters.",
      }),

      category: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Category must be text.",
        "string.empty": "Category is required.",
        "string.min": "Category must be at least 2 characters long.",
        "string.max": "Category cannot exceed 100 characters.",
      }),

      location: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Location must be text.",
        "string.empty": "Location is required.",
        "string.min": "Location must be at least 2 characters long.",
        "string.max": "Location cannot exceed 100 characters.",
      }),

      floor: Joi.number().integer().min(0).required().messages({
        "number.base": "Floor must be a number.",
        "number.min": "Floor cannot be negative.",
        "any.required": "Floor is required.",
      }),

      capacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Capacity must be a number.",
        "number.min": "Capacity must be at least 1.",
        "any.required": "Capacity is required.",
      }),

      status: Joi.string()
        .valid(...validStatuses)
        .required()
        .messages({
          "any.only": `Invalid status. Valid statuses are: ${validStatuses.join(
            ", "
          )}.`,
          "any.required": "Status is required.",
          "string.base": "Status must be a string.",
        }),

      description: Joi.string().trim().min(5).max(500).required().messages({
        "string.base": "Description must be text.",
        "string.empty": "Description is required.",
        "string.min": "Description must be at least 5 characters long.",
        "string.max": "Description cannot exceed 500 characters.",
      }),
    });

    const { error, value } = schema.validate(body, { convert: true });

    if (!error) {
      return { valid: true, value };
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

public editFacility(body: IEditFacilityUserInput, req: Request) {
  const validStatuses = Object.values(FacilityStatus);

  const schema = Joi.object<IEditFacilityUserInput>({
    facilityId: Joi.string()
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

    facilityName: Joi.string().trim().min(2).max(100).required().messages({
      "string.base": "Facility name must be text.",
      "string.empty": "Facility name is required.",
      "string.min": "Facility name must be at least 2 characters long.",
      "string.max": "Facility name cannot exceed 100 characters.",
    }),

   category: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Category must be text.",
        "string.empty": "Category is required.",
        "string.min": "Category must be at least 2 characters long.",
        "string.max": "Category cannot exceed 100 characters.",
      }),

    location: Joi.string().trim().min(2).max(100).required().messages({
      "string.base": "Location must be text.",
      "string.empty": "Location is required.",
      "string.min": "Location must be at least 2 characters long.",
      "string.max": "Location cannot exceed 100 characters.",
    }),

    floor: Joi.number().integer().min(0).required().messages({
      "number.base": "Floor must be a number.",
      "number.min": "Floor cannot be negative.",
      "any.required": "Floor is required.",
    }),

    capacity: Joi.number().integer().min(1).required().messages({
      "number.base": "Capacity must be a number.",
      "number.min": "Capacity must be at least 1.",
      "any.required": "Capacity is required.",
    }),

    status: Joi.string()
      .valid(...validStatuses)
      .required()
      .messages({
        "any.only": `Invalid status. Valid statuses are: ${validStatuses.join(
          ", "
        )}.`,
        "any.required": "Status is required.",
        "string.base": "Status must be a string.",
      }),

    description: Joi.string().trim().min(5).max(500).required().messages({
      "string.base": "Description must be text.",
      "string.empty": "Description is required.",
      "string.min": "Description must be at least 5 characters long.",
      "string.max": "Description cannot exceed 500 characters.",
    }),
  });

  // Extract facilityId from query params if not in body
  const { searchParams } = new URL(req.url);
  const facilityId = searchParams.get("facilityId");

  const { error, value } = schema.validate(
    { ...body, facilityId },
    { convert: true }
  );

  if (!error) {
    return { valid: true, value, facilityId};
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

export const facilityValidator = new FacilityValidator();

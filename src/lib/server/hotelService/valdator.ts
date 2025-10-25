import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import {
  ICreateHotelServiceUserInput,
  IEditHotelServiceUserInput,
} from "./interface";
import { HotelServiceCategory, HotelServiceStatus } from "./enum";
import { Types } from "mongoose";

class HotelServiceValidator {
  public createHotelService(body: ICreateHotelServiceUserInput) {
    const validCategories = Object.values(HotelServiceCategory);
    const validServices = Object.values(HotelServiceStatus);

    const schema = Joi.object<ICreateHotelServiceUserInput>({
      name: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Service name must be text.",
        "string.empty": "Service name is required.",
        "string.min": "Service name must be at least 2 characters long.",
        "string.max": "Service name cannot exceed 100 characters.",
      }),

      location: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Location must be text.",
        "string.empty": "Location is required.",
        "string.min": "Location must be at least 2 characters long.",
        "string.max": "Location cannot exceed 100 characters.",
      }),

      category: Joi.string()
        .valid(...validCategories)
        .required()
        .messages({
          "any.only": `Invalid service category. Valid categories are: ${validCategories.join(
            ", "
          )}.`,
          "any.required": "Service category is required.",
          "string.base": "Service category must be a string.",
        }),

      status: Joi.string()
        .valid(...validServices)
        .required()
        .messages({
          "any.only": `Invalid Status. Valid categories are: ${validServices.join(
            ", "
          )}.`,
          "any.required": "Status is required.",
          "string.base": "Status must be a string.",
        }),

      price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
        "any.required": "Price is required.",
      }),

      capacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Capacity must be a number.",
        "number.min": "Capacity must be at least 1.",
        "any.required": "Capacity is required.",
      }),

      description: Joi.string().trim().min(5).max(500).required().messages({
        "string.base": "Description must be text.",
        "string.empty": "Description is required.",
        "string.min": "Description must be at least 5 characters long.",
        "string.max": "Description cannot exceed 500 characters.",
      }),
    });

    // Validate and return clean result
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

  public editHotelService(body: IEditHotelServiceUserInput, req: Request) {
    const validCategories = Object.values(HotelServiceCategory);
    const validServices = Object.values(HotelServiceStatus);

    const schema = Joi.object<IEditHotelServiceUserInput>({
      hotelServiceId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Hotel service ID id is required.",
          "any.invalid": "Hotel service ID id must be a valid ObjectId.",
        }),
      name: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Service name must be text.",
        "string.empty": "Service name is required.",
        "string.min": "Service name must be at least 2 characters long.",
        "string.max": "Service name cannot exceed 100 characters.",
      }),

      location: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Location must be text.",
        "string.empty": "Location is required.",
        "string.min": "Location must be at least 2 characters long.",
        "string.max": "Location cannot exceed 100 characters.",
      }),

      category: Joi.string()
        .valid(...validCategories)
        .required()
        .messages({
          "any.only": `Invalid service category. Valid categories are: ${validCategories.join(
            ", "
          )}.`,
          "any.required": "Service category is required.",
          "string.base": "Service category must be a string.",
        }),

      status: Joi.string()
        .valid(...validServices)
        .required()
        .messages({
          "any.only": `Invalid Status. Valid categories are: ${validServices.join(
            ", "
          )}.`,
          "any.required": "Status is required.",
          "string.base": "Status must be a string.",
        }),

      price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
        "any.required": "Price is required.",
      }),

      capacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Capacity must be a number.",
        "number.min": "Capacity must be at least 1.",
        "any.required": "Capacity is required.",
      }),

      description: Joi.string().trim().min(5).max(500).required().messages({
        "string.base": "Description must be text.",
        "string.empty": "Description is required.",
        "string.min": "Description must be at least 5 characters long.",
        "string.max": "Description cannot exceed 500 characters.",
      }),
    });


    const { searchParams } = new URL(req.url);
    const hotelServiceId = searchParams.get("hotelServiceId");

    // Validate and return clean result
    const { error, value } = schema.validate({...body, hotelServiceId}, { convert: true });

    if (!error) {
      return { valid: true, value, hotelServiceId };
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

export const hotelServiceValidator = new HotelServiceValidator();

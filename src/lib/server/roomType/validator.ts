import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IAddRoomTypeUserInput, IEditRoomTypeUserInput } from "./interface";
import { Types } from "mongoose";

class RoomTypeValidator {
  public addRoomType(body: IAddRoomTypeUserInput) {
    const schema = Joi.object<IAddRoomTypeUserInput>({
      name: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Room type name must be text.",
        "string.empty": "Room type name is required.",
        "string.min": "Room type name must be at least 2 characters long.",
      }),

      capacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Capacity must be a number.",
        "number.min": "Capacity must be at least 1.",
        "any.required": "Capacity is required.",
      }),

      price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
        "any.required": "Price is required.",
      }),

      description: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .optional()
        .allow("") // allows empty string safely
        .messages({
          "string.base": "Description must be text.",
          "string.min": "Description must be at least 5 characters long.",
          "string.max": "Description cannot exceed 500 characters.",
        }),

      amenities: Joi.array()
        .items(
          Joi.string().trim().min(1).messages({
            "string.base": "Each amenity must be text.",
            "string.empty": "Amenity cannot be empty.",
          })
        )
        .custom((values: string[], helpers) => {
          if (!values || values.length === 0) return [];

          // Convert all to sentence case
          const formatted = values.map(utils.toSentenceCase);

          // Check for duplicates (case-insensitive)
          const lower = formatted.map((v) => v.toLowerCase());
          const hasDuplicates = new Set(lower).size !== lower.length;

          if (hasDuplicates) {
            return helpers.error("array.unique");
          }

          return formatted;
        })
        .messages({
          "array.base": "Amenities must be an array of strings.",
          "array.unique": "Amenities must not contain duplicates (case-insensitive).",
        })
        .optional(),
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

  public editAddRoomType(body: IEditRoomTypeUserInput, req: Request) {
    const schema = Joi.object<IEditRoomTypeUserInput>({
      roomTypeId: Joi.string()
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
      name: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Room type name must be text.",
        "string.empty": "Room type name is required.",
        "string.min": "Room type name must be at least 2 characters long.",
      }),

      capacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Capacity must be a number.",
        "number.min": "Capacity must be at least 1.",
        "any.required": "Capacity is required.",
      }),

      price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
        "any.required": "Price is required.",
      }),

      description: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .optional()
        .allow("") // allows empty string safely
        .messages({
          "string.base": "Description must be text.",
          "string.min": "Description must be at least 5 characters long.",
          "string.max": "Description cannot exceed 500 characters.",
        }),

      amenities: Joi.array()
        .items(
          Joi.string().trim().min(1).messages({
            "string.base": "Each amenity must be text.",
            "string.empty": "Amenity cannot be empty.",
          })
        )
        .custom((values: string[], helpers) => {
          if (!values || values.length === 0) return [];

          // Convert all to sentence case
          const formatted = values.map(utils.toSentenceCase);

          // Check for duplicates (case-insensitive)
          const lower = formatted.map((v) => v.toLowerCase());
          const hasDuplicates = new Set(lower).size !== lower.length;

          if (hasDuplicates) {
            return helpers.error("array.unique");
          }

          return formatted;
        })
        .messages({
          "array.base": "Amenities must be an array of strings.",
          "array.unique": "Amenities must not contain duplicates (case-insensitive).",
        })
        .optional(),
    });

     const { searchParams } = new URL(req.url);
    const roomTypeId = searchParams.get("roomTypeId");


    // Validate and return clean result
    const { error, value } = schema.validate({...body, roomTypeId}, { convert: true });

    if (!error) {
      return { valid: true, value, roomTypeId };
    }

    return {
      valid: false,
      roomTypeId,
      response: utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      }),
    };
  }



   public deleteRoomType(req: Request) {
    const schema = Joi.object<IEditRoomTypeUserInput>({
      roomTypeId: Joi.string()
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
        })
    });

     const { searchParams } = new URL(req.url);
    const roomTypeId = searchParams.get("roomTypeId");


    // Validate and return clean result
    const { error, value } = schema.validate({roomTypeId}, { convert: true });

    if (!error) {
      return { valid: true, value, roomTypeId };
    }

    return {
      valid: false,
      roomTypeId,
      response: utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      }),
    };
  }
}

export const roomTypeValidator = new RoomTypeValidator();

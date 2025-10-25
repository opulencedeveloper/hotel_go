import Joi from "joi";
import { Types } from "mongoose";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import {
  ICreateHouseKeepingUserInput,
  IMarkHouseKeepingUserInputAsCancelled,
  IMarkHouseKeepingUserInputAsComplete,
} from "./interface";

class HouseKeepingValidator {
  public createHouseKeeping(body: ICreateHouseKeepingUserInput) {
    const schema = Joi.object<ICreateHouseKeepingUserInput>({
      staffIds: Joi.array()
        .items(
          Joi.string()
            .required()
            .custom((value, helpers) => {
              if (!Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
              }
              return value;
            })
            .messages({
              "any.invalid": "Each staff ID must be a valid ObjectId.",
              "any.required": "Each staff ID is required.",
            })
        )
        .min(1)
        .required()
        .messages({
          "array.base": "Staff IDs must be an array of ObjectIds.",
          "array.min": "At least one staff ID is required.",
          "any.required": "Staff IDs field is required.",
        }),

      roomIds: Joi.array()
        .items(
          Joi.string()
            .required()
            .custom((value, helpers) => {
              if (!Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
              }
              return value;
            })
            .messages({
              "any.invalid": "Each room ID must be a valid ObjectId.",
              "any.required": "Each room ID is required.",
            })
        )
        .min(1)
        .required()
        .messages({
          "array.base": "Room IDs must be an array of ObjectIds.",
          "array.min": "At least one room ID is required.",
          "any.required": "Room IDs field is required.",
        }),

      title: Joi.string().trim().required().messages({
        "string.base": "Title must be a string.",
        "any.required": "Title is required.",
      }),

      description: Joi.string().trim().optional().messages({
        "string.base": "Description must be a string.",
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

  public markAsCompleted(
    body: IMarkHouseKeepingUserInputAsComplete,
    req: Request
  ) {
    const schema = Joi.object<IMarkHouseKeepingUserInputAsComplete>({
      houseKeepingId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "House keeping ID id is required.",
          "any.invalid": "House keeping ID id must be a valid ObjectId.",
        }),
      roomIds: Joi.array()
        .items(
          Joi.string()
            .required()
            .custom((value, helpers) => {
              if (!Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
              }
              return value;
            })
            .messages({
              "any.invalid": "Each room ID must be a valid ObjectId.",
              "any.required": "Each room ID is required.",
            })
        )
        .min(1)
        .required()
        .messages({
          "array.base": "Room IDs must be an array of ObjectIds.",
          "array.min": "At least one room ID is required.",
          "any.required": "Room IDs field is required.",
        }),
    });

    const { searchParams } = new URL(req.url);
    const houseKeepingId = searchParams.get("houseKeepingId");

    const { error } = schema.validate({...body, houseKeepingId}, { abortEarly: true });

    if (!error) return { valid: true, houseKeepingId };

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

  public markAsCancelled(
    req: Request
  ) {
    const schema = Joi.object<IMarkHouseKeepingUserInputAsCancelled>({
      houseKeepingId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "House keeping ID id is required.",
          "any.invalid": "House keeping ID id must be a valid ObjectId.",
        }),
    });

    const { searchParams } = new URL(req.url);
    const houseKeepingId = searchParams.get("houseKeepingId");
    console.log("------------aa-aa--a----")

    const { error } = schema.validate({ houseKeepingId}, { abortEarly: true });

    if (!error) return { valid: true, houseKeepingId };

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

export const houseKeepingValidator = new HouseKeepingValidator();

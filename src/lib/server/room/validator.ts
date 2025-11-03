import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { RoomStatus } from "./enum";
import {
  IAddHotelAmenities,
  IAddRoomUserInput,
  IEditRoomUserInput,
} from "./interface";
import { Types } from "mongoose";

class RoomValidator {
  public addRoom(body: IAddRoomUserInput) {
    const roomStatusValues = Object.values(RoomStatus);

    const schema = Joi.object({
      roomNumber: Joi.string().trim().required().messages({
        "string.base": "Room number must be a text value.",
        "any.required": "Room number is required.",
      }),

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

      roomStatus: Joi.string()
        .valid(...roomStatusValues)
        .required()
        .messages({
          "string.base": `Room status must be one of: ${roomStatusValues.join(
            ", "
          )}.`,
          "any.required": "Room status is required.",
          "any.only": `Room status must be one of: ${roomStatusValues.join(
            ", "
          )}.`,
        }),

      floor: Joi.number().positive().required().messages({
        "number.base": "Floor must be a number.",
        "number.positive": "Floor must be a positive number.",
        "any.required": "Floor is required.",
      }),

      note: Joi.string().trim().max(500).optional().allow("").messages({
        "string.base": "Note must be text if provided.",
        "string.max": "Note cannot exceed 500 characters.",
      }),
    });

    const { error } = schema.validate(body);

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

  public editRoom(body: IEditRoomUserInput, req: Request) {
    const roomStatusValues = Object.values(RoomStatus);

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
          "any.required": "Room type ID id is required.",
          "any.invalid": "Room type ID id must be a valid ObjectId.",
        }),
      roomNumber: Joi.string().trim().required().messages({
        "string.base": "Room number must be a text value.",
        "any.required": "Room number is required.",
      }),

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

      roomStatus: Joi.string()
        .valid(...roomStatusValues)
        .required()
        .messages({
          "string.base": `Room status must be one of: ${roomStatusValues.join(
            ", "
          )}.`,
          "any.required": "Room status is required.",
          "any.only": `Room status must be one of: ${roomStatusValues.join(
            ", "
          )}.`,
        }),

      floor: Joi.number().positive().required().messages({
        "number.base": "Floor must be a number.",
        "number.positive": "Floor must be a positive number.",
        "any.required": "Floor is required.",
      }),

      note: Joi.string().trim().max(500).optional().allow("").messages({
        "string.base": "Note must be text if provided.",
        "string.max": "Note cannot exceed 500 characters.",
      }),
    });

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const { error } = schema.validate({ ...body, roomId });

    if (!error) {
      return { valid: true, roomId };
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

    public markRoomForCleaning(req: Request) {
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
      });
  
      // Extract facilityId from query params if not in body
      const { searchParams } = new URL(req.url);
      const roomId = searchParams.get("roomId");
  
      const { error, value } = schema.validate({ roomId }, { convert: true });
  
      if (!error) {
        return { valid: true, value, roomId };
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

export const roomValidator = new RoomValidator();

import Joi from "joi";
import { Types } from "mongoose";
import { InventoryDestination } from "./enum";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { ICreateInventoryInventoryLogsUserInput } from "./interface";

class InventoryLogsValidator {
  public createInventoryLogs(body: ICreateInventoryInventoryLogsUserInput) {
    const destinationValues = Object.values(InventoryDestination);

    const schema = Joi.object<ICreateInventoryInventoryLogsUserInput>({
      staffId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Staff ID is required.",
          "any.invalid": "Staff ID must be a valid ObjectId.",
        }),

      destination: Joi.string()
        .valid(...destinationValues)
        .required()
        .messages({
          "any.only": `Destination must be one of: ${destinationValues.join(", ")}.`,
          "any.required": "Destination is required.",
        }),

      tableNumber: Joi.string()
        .when("destination", {
          is: InventoryDestination.RESTAURANT,
          then: Joi.string().required().messages({
            "any.required": "Table number is required when destination is restaurant.",
          }),
          otherwise: Joi.string().optional().allow(null, ""),
        }),

      roomNumber: Joi.string()
        .when("destination", {
          is: InventoryDestination.HOTEL_GUEST,
          then: Joi.string().trim().required().messages({
            "any.required": "Room number is required when destination is hotel_guest.",
            "string.base": "Room number must be a string.",
          }),
          otherwise: Joi.string().optional().allow(null, ""),
        }),

      guestName: Joi.string()
        .when("destination", {
          is: InventoryDestination.WALK_IN,
          then: Joi.string().trim().required().messages({
            "any.required": "Guest name is required when destination is walk_in.",
            "string.base": "Guest name must be a string.",
          }),
          otherwise: Joi.string().optional().allow(null, ""),
        }),

      inventories: Joi.array()
        .items(
          Joi.object({
            inventoryId: Joi.string()
              .required()
              .custom((value, helpers) => {
                if (!Types.ObjectId.isValid(value)) {
                  return helpers.error("any.invalid");
                }
                return value;
              })
              .messages({
                "any.required": "Inventory ID is required.",
                "any.invalid": "Inventory ID must be a valid ObjectId.",
              }),
            quantity: Joi.number()
              .integer()
              .min(1)
              .required()
              .messages({
                "number.base": "Quantity must be a number.",
                "number.min": "Quantity must be at least 1.",
                "any.required": "Quantity is required.",
              }),
          })
        )
        .min(1)
        .required()
        .messages({
          "array.base": "Inventories must be an array.",
          "array.min": "At least one inventory item is required.",
          "any.required": "Inventories are required.",
        }),

      notes: Joi.string().trim().optional().allow(""),
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
}

export const inventoryLogsValidator = new InventoryLogsValidator();

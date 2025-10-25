import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IAddInventoryItemUserInput } from "./inteface";
import { InventoryCategory } from "./enum";
import { InventoryUnit } from "@/utils/enum";


class InventoryValidator {
  public addInventory(body: IAddInventoryItemUserInput) {
    const categoryValues = Object.values(InventoryCategory);
    const unitValues = Object.values(InventoryUnit);

    const itemSchema = Joi.object({
      itemName: Joi.string().trim().required().messages({
        "string.base": "Item name must be a string.",
        "any.required": "Item name is required.",
      }),

      category: Joi.string()
        .valid(...categoryValues)
        .required()
        .messages({
          "any.only": `Category must be one of: ${categoryValues.join(", ")}.`,
          "any.required": "Category is required.",
        }),

      unit: Joi.string()
        .valid(...unitValues)
        .required()
        .messages({
          "any.only": `Unit must be one of: ${unitValues.join(", ")}.`,
          "any.required": "Unit is required.",
        }),

      costPerUnit: Joi.number().min(0).required().messages({
        "number.base": "Cost per unit must be a number.",
        "number.min": "Cost per unit cannot be negative.",
        "any.required": "Cost per unit is required.",
      }),

      supplier: Joi.string().trim().optional(),

      storageLocation: Joi.string().trim().optional(),

     currentStock: Joi.number().integer().min(1).required().messages({
        "number.base": "Current stock must be a number.",
        "number.min": "Current stock must be at least 1.",
        "any.required": "Current stock is required.",
      }),

      description: Joi.string().trim().optional(),
    });

    const schema = Joi.object<IAddInventoryItemUserInput>({
      items: Joi.array().items(itemSchema).min(1).required().messages({
        "array.base": "Items must be an array.",
        "array.min": "At least one inventory item is required.",
        "any.required": "Items field is required.",
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
}

export const inventoryValidator = new InventoryValidator();

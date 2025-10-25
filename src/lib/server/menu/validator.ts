import Joi from "joi";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { ICreateMenuUserInput, IEditMenuUserInput } from "./interface";
import { MenuStatus } from "./enum";
import { Types } from "mongoose";

class MenuValidator {
  public createMenu(body: ICreateMenuUserInput) {
    const menuStatusValues = Object.values(MenuStatus);

    const schema = Joi.object<ICreateMenuUserInput>({
      itemName: Joi.string().trim().required().messages({
        "string.base": "Item name must be a string.",
        "any.required": "Item name is required.",
      }),

      category: Joi.string().trim().required().messages({
        "string.base": "Category must be a string.",
        "any.required": "Category is required.",
      }),

      price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
        "any.required": "Price is required.",
      }),

      prepTime: Joi.number().integer().min(0).required().messages({
        "number.base": "Preparation time must be a number.",
        "number.min": "Preparation time cannot be negative.",
        "any.required": "Preparation time is required.",
      }),

      status: Joi.string()
        .valid(...menuStatusValues)
        .required()
        .messages({
          "any.only": `Status must be one of: ${menuStatusValues.join(", ")}.`,
          "any.required": "Status is required.",
        }),

      ingredients: Joi.string().trim().required().messages({
        "string.base": "Ingredients must be text.",
        "any.required": "Ingredients field is required.",
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

  public editMenu(body: IEditMenuUserInput, req: Request) {
    const menuStatusValues = Object.values(MenuStatus);

    const schema = Joi.object<IEditMenuUserInput>({
      menuId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .messages({
          "any.required": "Menu ID id is required.",
          "any.invalid": "Menu ID id must be a valid ObjectId.",
        }),
      itemName: Joi.string().trim().required().messages({
        "string.base": "Item name must be a string.",
        "any.required": "Item name is required.",
      }),

      category: Joi.string().trim().required().messages({
        "string.base": "Category must be a string.",
        "any.required": "Category is required.",
      }),

      price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
        "any.required": "Price is required.",
      }),

      prepTime: Joi.number().integer().min(0).required().messages({
        "number.base": "Preparation time must be a number.",
        "number.min": "Preparation time cannot be negative.",
        "any.required": "Preparation time is required.",
      }),

      status: Joi.string()
        .valid(...menuStatusValues)
        .required()
        .messages({
          "any.only": `Status must be one of: ${menuStatusValues.join(", ")}.`,
          "any.required": "Status is required.",
        }),

      ingredients: Joi.string().trim().required().messages({
        "string.base": "Ingredients must be text.",
        "any.required": "Ingredients field is required.",
      }),
    });

    const { searchParams } = new URL(req.url);
    const menuId = searchParams.get("menuId");

    const { error } = schema.validate(
      { ...body, menuId },
      { abortEarly: true }
    );

    if (!error) return { valid: true,  menuId };

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

export const menuValidator = new MenuValidator();

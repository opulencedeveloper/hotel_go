import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { ICreatePlan } from "./interface";
import { PlanName } from "./enum";

class PlanValidator {
  public createPlan(body: ICreatePlan) {
    const priceSchema = Joi.object({
      quarterly: Joi.number().min(0).required().messages({
        "number.base": "Quarterly price must be a number.",
        "any.required": "Quarterly price is required.",
      }),
      yearly: Joi.number().min(0).required().messages({
        "number.base": "Yearly price must be a number.",
        "any.required": "Yearly price is required.",
      }),
    });

    const schema = Joi.object<ICreatePlan>({
      name: Joi.string()
        .valid(...Object.values(PlanName))
        .required()
        .messages({
          "any.only": "Invalid plan name.",
          "any.required": "Plan name is required.",
        }),

      // ✅ Allow price to be either a valid object or null
      price: priceSchema
        .allow(null)
        .messages({
          "object.base": "Price must be an object with quarterly and yearly values or null.",
        }),

      rooms: Joi.string().required().messages({
        "string.base": "Rooms must be text.",
        "any.required": "Rooms field is required.",
      }),

      multiProperty: Joi.boolean().required().messages({
        "boolean.base": "Multi-property must be true or false.",
        "any.required": "Multi-property field is required.",
      }),

       maxRoom: Joi.number().min(1).allow(null).messages({
        "number.base": "Max room must be a number.",
        "number.min": "Max room must be at least 1.",
      }),

      description: Joi.string().required().messages({
        "string.base": "Description must be text.",
        "any.required": "Description is required.",
      }),

      features: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Features must be an array of strings.",
        "any.required": "Features field is required.",
      }),

      popular: Joi.boolean().required().messages({
        "boolean.base": "Popular must be true or false.",
        "any.required": "Popular field is required.",
      }),
    });

    const { error } = schema.validate(body);

    if (error) {
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

    return { valid: true };
  }
}

export const planValidator = new PlanValidator();

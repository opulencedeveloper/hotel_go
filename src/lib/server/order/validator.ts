import Joi from "joi";
import { Types } from "mongoose";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { ICreateOrderUserInput, IUpdateOrderStatus } from "./interface";
import { OrderStatus, OrderType } from "./enum";
import { PaymentMethod } from "../stay/enum";

class OrderValidator {
  public createOrder(body: ICreateOrderUserInput) {
    const schema = Joi.object<ICreateOrderUserInput>({
      roomNumber: Joi.when("orderType", {
        is: OrderType.HOTEL_GUEST,
        then: Joi.string().required().messages({
          "any.required": "Room number is required for hotel guest orders.",
          "string.base": "Room number must be a string.",
        }),
        otherwise: Joi.string().optional(),
      }),

      tableNumber: Joi.when("orderType", {
        is: OrderType.RESTAURANT,
        then: Joi.string().required().messages({
          "any.required": "Table number is required for restaurant orders.",
          "string.base": "Table number must be a string.",
        }),
        otherwise: Joi.string().optional(),
      }),

      orderType: Joi.string()
        .valid(...Object.values(OrderType))
        .required()
        .messages({
          "any.only": `Order type must be one of: ${Object.values(OrderType).join(", ")}.`,
          "any.required": "Order type is required.",
        }),

      items: Joi.array()
        .items(
          Joi.object({
            menuId: Joi.string()
              .required()
              .custom((value, helpers) => {
                if (!Types.ObjectId.isValid(value)) {
                  return helpers.error("any.invalid");
                }
                return value;
              })
              .messages({
                "any.required": "Menu ID is required.",
                "any.invalid": "Menu ID must be a valid ObjectId.",
              }),

            quantity: Joi.number().integer().min(1).required().messages({
              "number.base": "Quantity must be a number.",
              "number.min": "Quantity must be at least 1.",
              "any.required": "Quantity is required.",
            }),

          })
        )
        .min(1)
        .required()
        .messages({
          "array.base": "Items must be an array.",
          "array.min": "At least one item is required.",
          "any.required": "Items are required.",
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


   public updateOrderStatus(body: IUpdateOrderStatus, req: Request) {
     const paymentMethodValues = Object.values(PaymentMethod);
      const schema = Joi.object< IUpdateOrderStatus>({
        orderId: Joi.string()
          .required()
          .custom((value, helpers) => {
            if (!Types.ObjectId.isValid(value)) {
              return helpers.error("any.invalid");
            }
            return value;
          })
          .messages({
            "any.required": "Order ID id is required.",
            "any.invalid": "Order ID id must be a valid ObjectId.",
          }),
   
        status: Joi.string()
        .valid(...Object.values(OrderStatus))
        .optional() // ✅ only validated if provided
        .messages({
          "any.only": `Order status must be one of: ${Object.values(
            OrderStatus
          ).join(", ")}.`,
        }),

         paymentMethod: Joi.string()
        .valid(...paymentMethodValues)
        .when("status", {
          is: OrderStatus.PAID,
          then: Joi.required().messages({
            "any.required": "Payment method is required when status is PAID.",
            "any.only": `Payment method must be one of: ${paymentMethodValues.join(
              ", "
            )}.`,
          }),
          otherwise: Joi.optional(),
        }),
      });
  
      const { searchParams } = new URL(req.url);
      const orderId = searchParams.get("orderId");
  
      const { error } = schema.validate(
        { ...body, orderId },
        { abortEarly: true }
      );
  
      if (!error) return { valid: true, orderId };
  
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

export const orderValidator = new OrderValidator();

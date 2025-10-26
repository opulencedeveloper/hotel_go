import Joi from "joi";
import { IHotelRegistrationUserInput } from "./interface";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { countries, currencyOptions } from "@/resources/auth";
import { IAddHotelAmenities } from "../room/interface";

class HotelValidator {
  public registerHotel(body: IHotelRegistrationUserInput) {
    console.log(body);
    const validCountryNames = countries.map((c) => c.name);
    const validPhoneCodes = countries.map((c) => c.phoneCode);
    const validCurrencyValues = currencyOptions.map((c) => c.value);

    const schema = Joi.object({
      hotelName: Joi.string().required().messages({
        "string.base": "Hotel name must be text",
        "any.required": "Hotel name is required.",
      }),

      firstName: Joi.string().required().messages({
        "any.required": "First name is required",
      }),

      lastName: Joi.string().required().messages({
        "any.required": "Last name is required",
      }),

      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email address is required",
      }),

      address: Joi.string().required().messages({
        "any.required": "Address is required",
      }),

      city: Joi.string().required().messages({
        "any.required": "City is required",
      }),

      state: Joi.string().required().messages({
        "any.required": "State is required",
      }),

      postalCode: Joi.string().optional().allow("", null),

      country: Joi.string()
        .valid(...validCountryNames)
        .required()
        .messages({
          "any.only": "Please select a valid country from the list",
          "any.required": "Country is required",
        }),

      phone: Joi.string()
        .pattern(/^\+?[0-9\s\-()]{7,20}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Please enter a valid phone number (e.g., +2348012345678 or +1 234 567 8900)",
          "any.required": "Phone number is required",
        }),

      currency: Joi.string()
        .valid(...validCurrencyValues)
        .required()
        .messages({
          "any.only": "Please select a valid currency",
          "any.required": "Currency is required",
        }),

      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
          "any.required": "Password is required.",
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),

      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.required": "Confirm Password is required.",
          "any.only": "Passwords do not match",
        }),

      agreeToTerms: Joi.boolean().valid(true).required().messages({
        "any.only": "You must agree to the terms and conditions",
        "any.required": "Agreeing to terms is required",
      }),
    })
      .custom((value, helpers) => {
        const selectedCountry = countries.find((c) => c.name === value.country);

        if (!selectedCountry) {
          return helpers.error("any.custom", {
            customMessage: "Invalid country selection.",
          });
        }

        return value;
      })
      .messages({
        "any.custom": "{{#customMessage}}",
      });

    const { error } = schema.validate(body);

    if (error) {
      return {
        valid: false,
        response: utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description:
            error.details[0].context?.customMessage || error.details[0].message,
          data: null,
        }),
      };
    }

    return {
      valid: true,
    };
  }

public addHotelAmenities(body: IAddHotelAmenities) {
  const schema = Joi.object({
    amenities: Joi.array()
      .items(Joi.string().trim().required())
      .min(1)
      .required()
      .custom((value, helpers) => {
        const lowerCased = value.map((v: string) => v.toLowerCase());
        const unique = new Set(lowerCased);

        if (unique.size !== lowerCased.length) {
          return helpers.error("array.uniqueInsensitive");
        }

        return value;
      })
      .messages({
        "array.base": "Room amenities must be an array.",
        "array.includesRequiredUnknowns": "Each amenity must be a string.",
        "array.min": "At least one room amenity is required.",
        "any.required": "Room amenities are required.",
        "array.uniqueInsensitive": "Room amenities must not contain duplicates (case-insensitive).",
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


}

export const hotelValidator = new HotelValidator();

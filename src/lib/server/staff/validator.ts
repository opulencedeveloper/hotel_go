import Joi from "joi";
import {
  ICreateStaffPasswordUserInput,
  ICreateStaffUserInput,
  IEditStaffUserInput,
} from "./interface";
import { StaffRole, StaffShift, StaffStatus } from "./enum";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { countries } from "@/resources/auth";
import { Types } from "mongoose";
import StaffStats from "@/components/staff/StaffStats";

class StaffValidator {
  public createStaff(body: ICreateStaffUserInput) {
    console.log(body);
    const validCountryNames = countries.map((c) => c.name);
    const validRoles = Object.values(StaffRole);
    const validShifts = Object.values(StaffShift);

    const schema = Joi.object<ICreateStaffUserInput>({
      firstName: Joi.string().required().messages({
        "any.required": "First name is required",
      }),

      lastName: Joi.string().required().messages({
        "any.required": "Last name is required",
      }),

      middleName: Joi.string().optional().allow("", null),

      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email address is required",
      }),

      phoneNumber: Joi.string()
        .pattern(/^\+[1-9]\d{6,14}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Please enter a valid international phone number in E.164 format (e.g., +2348012345678)",
          "any.required": "Phone number is required",
        }),

      userRole: Joi.string()
        .valid(...validRoles)
        .required()
        .messages({
          "any.only": `Role must be one of: ${validRoles.join(", ")}`,
          "any.required": "Role is required",
        }),

      salary: Joi.number().min(0).required().messages({
        "number.base": "Salary must be a valid number",
        "number.min": "Salary cannot be negative",
        "any.required": "Salary is required",
      }),

      shift: Joi.string()
        .valid(...validShifts)
        .required()
        .messages({
          "any.only": `Shift must be one of: ${validShifts.join(", ")}`,
          "any.required": "Shift is required",
        }),

      country: Joi.string()
        .valid(...validCountryNames)
        .required()
        .messages({
          "any.only": "Please select a valid country from the list",
          "any.required": "Country is required",
        }),

      stateOrProvince: Joi.string().required().messages({
        "any.required": "State or province is required",
      }),

      city: Joi.string().required().messages({
        "any.required": "City is required",
      }),

      postalCode: Joi.string().optional().allow("", null),

      address: Joi.string().required().messages({
        "any.required": "Address is required",
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

    return { valid: true };
  }

  public editStaff(body: IEditStaffUserInput, req: Request) {
    const validCountryNames = countries.map((c) => c.name);
    const validRoles = Object.values(StaffRole);
    const validShifts = Object.values(StaffShift);
    const validStatus = Object.values(StaffStatus);

    console.log(body);

    const schema = Joi.object<IEditStaffUserInput>({
      staffId: Joi.string()
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
      firstName: Joi.string().required().messages({
        "any.required": "First name is required",
      }),

      lastName: Joi.string().required().messages({
        "any.required": "Last name is required",
      }),

      middleName: Joi.string().optional().allow("", null),

      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email address is required",
      }),

      phoneNumber: Joi.string()
        .pattern(/^\+[1-9]\d{6,14}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Please enter a valid international phone number in E.164 format (e.g., +2348012345678)",
          "any.required": "Phone number is required",
        }),

      userRole: Joi.string()
        .valid(...validRoles)
        .required()
        .messages({
          "any.only": `Role must be one of: ${validRoles.join(", ")}`,
          "any.required": "Role is required",
        }),

      status: Joi.string()
        .valid(...validStatus)
        .required()
        .messages({
          "any.only": `Status must be one of: ${validStatus.join(", ")}`,
          "any.required": "Status is required",
        }),

      salary: Joi.number().min(0).required().messages({
        "number.base": "Salary must be a valid number",
        "number.min": "Salary cannot be negative",
        "any.required": "Salary is required",
      }),

      shift: Joi.string()
        .valid(...validShifts)
        .required()
        .messages({
          "any.only": `Shift must be one of: ${validShifts.join(", ")}`,
          "any.required": "Shift is required",
        }),

      country: Joi.string()
        .valid(...validCountryNames)
        .required()
        .messages({
          "any.only": "Please select a valid country from the list",
          "any.required": "Country is required",
        }),

      stateOrProvince: Joi.string().required().messages({
        "any.required": "State or province is required",
      }),

      city: Joi.string().required().messages({
        "any.required": "City is required",
      }),

      postalCode: Joi.string().optional().allow("", null),

      address: Joi.string().required().messages({
        "any.required": "Address is required",
      }),
    });

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    const { error } = schema.validate(
      { ...body, staffId },
      { abortEarly: true }
    );

    if (!error) return { valid: true, staffId };

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

  public createStaffPassword(
    body: ICreateStaffPasswordUserInput,
    req: Request
  ) {
    const schema = Joi.object<ICreateStaffPasswordUserInput>({
      password: Joi.string().required().messages({
        "any.required": "Password is required",
      }),

      staffId: Joi.string()
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
    });

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    const { error } = schema.validate(
      { ...body, staffId },
      { abortEarly: true }
    );

    if (!error) return { valid: true, staffId };

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

    return { valid: true };
  }
}

export const staffValidator = new StaffValidator();

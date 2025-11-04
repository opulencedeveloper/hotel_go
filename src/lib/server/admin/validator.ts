import Joi from "joi";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IAdminLogin } from "./interface";

class AdminValidator {

  public adminLogIn(body: IAdminLogin) {
    const schema = Joi.object<IAdminLogin>({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required.",
      }),
    });

    const { error } = schema.validate(body);

    if (!error) {
      return {
        valid: true,
      };
    } else {
      console.log(error);
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
}

export const adminValidator = new AdminValidator();

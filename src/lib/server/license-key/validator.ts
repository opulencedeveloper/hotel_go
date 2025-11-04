import Joi from "joi";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IActivateLicenceKey } from "./interface";

class LicenceKeyValidator {
  public activateLicenceKey(body: IActivateLicenceKey) {
    const schema = Joi.object<IActivateLicenceKey>({
      licenceKey: Joi.string().trim().required().messages({
        "any.required": "Licence key is required.",
        "string.empty": "Licence key cannot be empty.",
        "string.base": "Licence key must be a valid string.",
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

export const licenceKeyValidator = new LicenceKeyValidator();

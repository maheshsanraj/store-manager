import Joi from "joi";

export const loginSchema = Joi.object({
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits",
      "any.required": "Mobile number is required"
    }),
  pin: Joi.string()
    .min(4)
    .max(6)
    .required()
    .messages({
      "string.empty": "PIN is required",
      "string.min": "PIN must be at least 4 characters",
      "string.max": "PIN must be at most 6 characters",
      "any.required": "PIN is required"

    }),
});
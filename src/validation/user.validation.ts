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
export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.pattern.base": "OTP must be a 6 digit number",
      "any.required": "OTP is required",
    }),
});
export const resetPasswordSchema = Joi.object({
  newPin: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "PIN is required",
      "string.pattern.base": "PIN must be a 6 digit number",
      "any.required": "PIN is required",
    }),
});
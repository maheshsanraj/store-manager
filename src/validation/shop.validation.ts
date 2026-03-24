import Joi from "joi";

export const createShopSchema = Joi.object({
  shopName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Shop name is required",
      "string.min": "Shop name must be at least 3 characters",
      "string.max": "Shop name cannot exceed 100 characters",
    }),

  username: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 50 characters",
    }),

  mobileNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be a valid 10 digit Indian number",
    }),
});

export const updateShopSchema = Joi.object({
  shopName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Shop name is required",
      "string.min": "Shop name must be at least 3 characters",
      "string.max": "Shop name cannot exceed 100 characters",
    }),
})
  .unknown(false)
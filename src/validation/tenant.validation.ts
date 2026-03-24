import Joi from "joi";

export const createTenantSchema = Joi.object({
  tenantName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Tenant name is required",
    "string.min": "Tenant name must be at least 3 characters",
    "any.required": "Tenant name is required",
  }),

  tenantEmail: Joi.string().email().required().messages({
    "string.email": "Invalid tenant email format",
    "string.empty": "Tenant email is required",
    "any.required": "Tenant email is required",
  }),

  username: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Admin name is required",
    "string.min": "Admin name must be at least 3 characters",
    "any.required": "Admin name is required",
  }),

  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
      "string.empty": "Mobile number is required",
      "any.required": "Mobile number is required",
    }),
});

export const updateTenantSchema = Joi.object({
  tenantName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "Tenant name must be a string",
    "string.empty": "Tenant name cannot be empty",
  }),
  tenantEmail: Joi.string().email().trim().optional().messages({
    "string.email": "Invalid email format",
  }),
  shopLimit: Joi.number().integer().min(1).optional().messages({
    "number.base": "Shop limit must be a number",
  }),
  userLimitPerShop: Joi.number().integer().min(1).optional().messages({
    "number.base": "User limit per shop must be a number",
  }),
  subscriptionStatus: Joi.string()
    .valid("TRIAL", "ACTIVE", "EXPIRED")
    .optional()
});
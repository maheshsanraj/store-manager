import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 2 characters",
      "string.max": "Product name cannot exceed 150 characters",
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
    }),

  category: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Category is required",
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": "Stock must be a number",
      "number.min": "Stock cannot be negative",
    }),
});
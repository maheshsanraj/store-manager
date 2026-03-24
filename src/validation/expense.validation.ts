import Joi from "joi";

export const bulkExpenseSchema = Joi.object({
    expenses: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().uuid().optional(),

                tenantId: Joi.string().uuid().required().messages({
                    "string.base": "Tenant ID must be a string",
                    "string.guid": "Tenant ID must be a valid UUID",
                    "any.required": "Tenant ID is required",
                }),
                shopId: Joi.string().uuid().required().messages({
                    "string.base": "Shop ID must be a string",
                    "string.guid": "Shop ID must be a valid UUID",
                    "any.required": "Shop ID is required",
                }),
                title: Joi.string().trim().min(1).required().messages({
                    "string.base": "Title must be a string",
                    "string.empty": "Title is required",
                    "string.min": "Title cannot be empty",
                    "any.required": "Title is required",
                }),
                amount: Joi.number().positive().required().messages({
                    "number.base": "Amount must be a number",
                    "number.positive": "Amount must be greater than 0",
                    "any.required": "Amount is required",
                }),
                date: Joi.string().required().messages({
                    "string.base": "Date must be a string",
                    "any.required": "Date is required",
                }),
                createdBy: Joi.string().uuid().required().messages({
                    "string.base": "CreatedBy must be a string",
                    "string.guid": "CreatedBy must be a valid UUID",
                    "any.required": "CreatedBy is required",
                }),
                createdAt: Joi.date().optional(),
                updatedAt: Joi.date().optional(),
            }))
        .min(1)
        .required()
        .messages({
            "array.base": "Expenses must be an array",
            "array.min": "At least one expense is required",
            "any.required": "Expense data is required",
        }),
});

export const bulkUpdateExpenseSchema = Joi.object({
  expenses: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required().messages({
          "string.base": "Expense ID must be a string",
          "string.guid": "Expense ID must be a valid UUID",
          "any.required": "Expense ID is required",
        }),
        title: Joi.string().trim().min(1).optional().messages({
          "string.base": "Title must be a string",
          "string.empty": "Title cannot be empty",
          "string.min": "Title must contain at least 1 character",
        }),
        amount: Joi.number().positive().optional().messages({
          "number.base": "Amount must be a number",
          "number.positive": "Amount must be greater than 0",
        }),
        date: Joi.string().optional().messages({
          "string.base": "Date must be a string",
        }),
        updatedAt: Joi.date().optional().messages({
          "date.base": "UpdatedAt must be a valid date",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Expenses must be an array",
      "array.min": "At least one expense is required for update",
      "any.required": "Expenses array is required",
    }),
});

export const bulkDeleteExpenseSchema = Joi.object({
  ids: Joi.array()
    .items(
      Joi.string().uuid().required().messages({
        "string.guid": "Expense ID must be a valid UUID",
        "any.required": "Expense ID is required",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "IDs must be an array",
      "array.min": "At least one ID is required",
      "any.required": "IDs array is required",
    }),
});
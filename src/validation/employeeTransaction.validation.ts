import Joi from "joi";

export const bulkEmployeeTransactionSchema = Joi.object({
    transactions: Joi.array()
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
                employeeId: Joi.string().uuid().required().messages({
                    "string.base": "Employee ID must be a string",
                    "string.guid": "Employee ID must be a valid UUID",
                    "any.required": "Employee ID is required",
                }),
                type: Joi.string().valid("advance", "bonus").required().messages({
                    "any.only": "Type must be either advance or bonus",
                    "any.required": "Transaction type is required",
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
                    "string.guid": "CreatedBy must be a valid UUID",
                    "any.required": "CreatedBy is required",
                }),
                description: Joi.string().allow("", null).messages({
                    "string.base": "Description must be a string",
                }),
                createdAt: Joi.date().optional(),
                updatedAt: Joi.date().optional(),
            }))
        .min(1)
        .required()
        .messages({
            "array.base": "Transactions must be an array",
            "array.min": "At least one transaction is required",
            "any.required": "Transactions array is required",
        }),
});
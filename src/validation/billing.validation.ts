import Joi from "joi";

export const createBillingSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Customer name is required",
            "any.required": "Customer name is required",
        }),

    price: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.positive": "Price must be greater than 0",
            "any.required": "Price is required",
        }),
    quantity: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.positive": "Quantity must be greater than 0",
            "any.required": "Quantity is required",
        }),
    date: Joi.date()
        .required()
        .messages({
            "date.base": "Date must be a valid date",
            "any.required": "Date is required",
        }),
});

export const bulkBillingSchema = Joi.object({
    billings: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().uuid().optional(),
                tenantId: Joi.string()
                    .uuid()
                    .required()
                    .messages({
                        "string.base": "Tenant ID must be a string",
                        "string.guid": "Tenant ID must be a valid UUID",
                        "any.required": "Tenant ID is required",
                    }),

                shopId: Joi.string()
                    .uuid()
                    .required()
                    .messages({
                        "string.base": "Shop ID must be a string",
                        "string.guid": "Shop ID must be a valid UUID",
                        "any.required": "Shop ID is required",
                    }),

                name: Joi.string()
                    .trim()
                    .required()
                    .messages({
                        "string.empty": "Customer name is required",
                        "any.required": "Customer name is required",
                    }),

                price: Joi.number()
                    .positive()
                    .required()
                    .messages({
                        "number.base": "Price must be a number",
                        "number.positive": "Price must be greater than 0",
                        "any.required": "Price is required",
                    }),

                quantity: Joi.number()
                    .integer()
                    .positive()
                    .required()
                    .messages({
                        "number.base": "Quantity must be a number",
                        "number.integer": "Quantity must be an integer",
                        "number.positive": "Quantity must be greater than 0",
                        "any.required": "Quantity is required",
                    }),
                totalAmount: Joi.number().positive().required().messages({
                    "number.base": "Total amount must be a number",
                    "number.positive": "Total amount must be greater than 0",
                    "any.required": "Total amount is required",
                }),
                date: Joi.date()
                    .required()
                    .messages({
                        "date.base": "Date must be a valid date",
                        "any.required": "Date is required",
                    }),
                createdAt: Joi.date().optional(),

                updatedAt: Joi.date().optional(),
            })
        )
        .min(1)
        .required()
        .messages({
            "array.base": "Billings must be an array",
            "array.min": "At least one billing record is required",
            "any.required": "Billings array is required",
        }),
});
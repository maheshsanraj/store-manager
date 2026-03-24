import Joi from "joi";

export const bulkAttendanceSchema = Joi.object({
  attendances: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        employeeId: Joi.string().uuid().required().messages({
          "string.base": "Employee ID must be a string",
          "string.guid": "Employee ID must be a valid UUID",
          "any.required": "Employee ID is required",
        }),
        markedBy: Joi.string().uuid().required().messages({
          "string.base": "MarkedBy must be a string",
          "string.guid": "MarkedBy must be a valid UUID",
          "any.required": "MarkedBy is required",
        }),
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
        date: Joi.string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .required()
          .messages({
            "string.pattern.base": "Date must be in YYYY-MM-DD format",
            "any.required": "Date is required",
          }),
        present: Joi.boolean().required().messages({
          "boolean.base": "Present must be a boolean",
          "any.required": "Present is required",
        }),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Attendance must be an array",
      "array.min": "Attendance array must have at least one item",
      "any.required": "Attendance data is required",
    }),
});
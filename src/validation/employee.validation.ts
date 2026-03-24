import Joi from "joi";

export const createEmployeeSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
    }),

  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
      "string.empty": "Mobile number is required",
    }),

  dailySalary: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Daily salary must be a number",
      "number.positive": "Daily salary must be greater than 0",
    }),

  joiningDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Joining date must be a valid date",
    }),
});

export const updateEmployeeSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters"
    }),

  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.base": "Mobile number must be a string",
      "string.pattern.base": "Mobile number must be exactly 10 digits"
    }),

  dailySalary: Joi.number()
    .positive()
    .messages({
      "number.base": "Daily salary must be a number",
      "number.positive": "Daily salary must be a positive number"
    }),

  joiningDate: Joi.date()
    .iso()
    .messages({
      "date.base": "Joining date must be a valid date",
      "date.format": "Joining date must be in ISO format (YYYY-MM-DD)"
    })

})
.min(1)
.messages({
  "object.min": "At least one field is required to update employee"
});
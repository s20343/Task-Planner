const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title cannot be empty!",
    "string.min": "Title is too short! Minimum 3 chars.",
    "string.max": "Title is too long! Maximum 100 chars.",
    "any.required": "Title is required!",
  }),
  description: Joi.string().max(500).allow("", null).messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category cannot be empty.",
    "any.required": "Category cannot be empty.",
  }),

  priority: Joi.number().required().messages({
    "number.base": "Priority must be a number.",
    "any.required": "Priority cannot be empty.",
  }),

  project: Joi.string().max(100).allow("", null).messages({
    "string.max": "Project name cannot exceed 100 characters.",
  }),
  deadline: Joi.date().optional().allow(null, "").min("now").messages({
    "date.base": "Deadline must be a valid date.",
    "date.min": "Deadline cannot be in the past.",
  }),
  completed: Joi.boolean().optional().messages({
    "boolean.base": "Completed must be true or false.",
  }),
});

module.exports = taskSchema;

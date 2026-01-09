const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': "Title cannot be empty!",
      'string.min': "Title is too short! Minimum 3 chars.",
      'string.max': "Title is too long! Maximum 100 chars.",
      'any.required': "Title is required!"
    }),
  description: Joi.string()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': "Description cannot exceed 500 characters."
    }),
  category: Joi.string()
    .valid('work', 'personal', 'study', 'other')
    .required()
    .messages({
      'any.only': "Category must be work, personal, study, or other.",
      'any.required': "Category cannot be empty."
    }),
  priority: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': "Priority must be a number!",
      'number.min': "Priority too low! Minimum 1.",
      'number.max': "Priority too high! Maximum 5.",
      'any.required': "Priority cannot be empty."
    }),
  project: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': "Project name cannot exceed 100 characters."
    }),
  deadline: Joi.date()
    .optional()
    .messages({
      'date.base': "Deadline must be a valid date."
    }),
  completed: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': "Completed must be true or false."
    })
});

module.exports = taskSchema;

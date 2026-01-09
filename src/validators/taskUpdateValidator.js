const Joi = require("joi");

const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.empty": "Title cannot be empty!",
      "string.min": "Title is too short! Minimum 3 characters.",
      "string.max": "Title is too long! Maximum 100 characters."
    }),

  description: Joi.string()
    .max(500)
    .allow("", null)
    .messages({
      "string.max": "Description cannot exceed 500 characters."
    }),

  category: Joi.string()
    .valid("work", "personal", "study", "other")
    .messages({
      "any.only": "Category must be work, personal, study, or other."
    }),

  priority: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      "number.base": "Priority must be a number!",
      "number.min": "Priority too low! Minimum 1.",
      "number.max": "Priority too high! Maximum 5."
    }),

  project: Joi.string()
    .max(100)
    .allow("", null)
    .messages({
      "string.max": "Project name cannot exceed 100 characters."
    }),

  deadline: Joi.date()
    .messages({
      "date.base": "Deadline must be a valid date."
    }),

  completed: Joi.boolean()
    .messages({
      "boolean.base": "Completed must be true or false."
    })
})
.min(1)
.messages({
  "object.min": "You must update at least one field."
});

module.exports = taskUpdateSchema;

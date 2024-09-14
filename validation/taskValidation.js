const Joi = require('joi');
const xss = require('xss');
const { ObjectId } = require('mongodb');

// Custom validation for MongoDB ObjectId
const objectIdValidation = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Helper function to sanitize inputs using the xss library
const sanitizeString = (value, helpers) => {
  const sanitizedValue = xss(value);  // Sanitize the input
  if (sanitizedValue !== value) {
    return helpers.error('any.invalid');  // If sanitization changes the input, consider it invalid
  }
  return sanitizedValue;  // Return sanitized value if no malicious content was detected
};

// Validation for creating a new task (POST)
const createTaskSchema = Joi.object({
  title: Joi.string().required().custom(sanitizeString).messages({
    'string.base': 'Title must be a string.',
    'string.empty': 'Title cannot be empty.',
    'any.required': 'Title is a required field.',
    'any.invalid': 'Invalid characters detected in title.'
  }),
  description: Joi.string().allow('').custom(sanitizeString).messages({
    'any.invalid': 'Invalid characters detected in description.'
  }),
  dueDate: Joi.date().required().messages({
    'date.base': 'Due Date must be a valid date.',
    'any.required': 'Due Date is a required field.',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').required().messages({
    'any.only': 'Priority must be one of [low, medium, high].',
    'any.required': 'Priority is a required field.',
  }),
  status: Joi.string().valid('pending', 'in progress', 'completed').required().messages({
    'any.only': 'Status must be one of [pending, in progress, completed].',
    'any.required': 'Status is a required field.',
  }),
  subtasks: Joi.array().items(Joi.string().custom(sanitizeString)).default([]).messages({
    'any.invalid': 'Invalid characters detected in subtask.'
  })  // Array of strings for subtasks, with sanitization
});

// Validation for updating a task (PATCH)
const updateTaskSchema = Joi.object({
  title: Joi.string().custom(sanitizeString).messages({
    'string.base': 'Title must be a string.',
    'string.empty': 'Title cannot be empty.',
    'any.invalid': 'Invalid characters detected in title.'
  }),
  description: Joi.string().allow('').custom(sanitizeString).messages({
    'any.invalid': 'Invalid characters detected in description.'
  }),
  dueDate: Joi.date().messages({
    'date.base': 'Due Date must be a valid date.',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').messages({
    'any.only': 'Priority must be one of [low, medium, high].',
  }),
  status: Joi.string().valid('pending', 'in progress', 'completed').messages({
    'any.only': 'Status must be one of [pending, in progress, completed].',
  }),
  subtasks: Joi.array().items(Joi.string().custom(sanitizeString)).messages({
    'any.invalid': 'Invalid characters detected in subtask.'
  })  // Array of strings for subtasks, with sanitization
});

// Validation for ObjectId (for GET by ID or DELETE by ID)
const validateTaskId = (id) => Joi.string().custom(objectIdValidation).validate(id);

module.exports = {
  validateCreateTask: (task) => createTaskSchema.validate(task, { abortEarly: false }),
  validateUpdateTask: (task) => updateTaskSchema.validate(task, { abortEarly: false }),
  validateTaskId  // New: Validation for Task ID (ObjectId)
};

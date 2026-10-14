import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// CREATE Category Validation Schema
export const createCategory = Joi.object({
  name: Joi.string().trim().min(2).required().example("Technology").messages({
    "string.empty": "Category name is required",
    "any.required": "Category name is required",
  }),
  description: Joi.string().optional().allow(null, "").example("Industrial robotics and automated machinery").messages({
    "string.base": "Description must be a valid string",
  }),
  image: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/categories/category.jpg").messages({
    "string.uri": "Category image must be a valid URL",
  }),
});

// Middleware for validating category creation
export const validateCreateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createCategory.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
    return;
  }
  next();
};

// UPDATE Category Validation Schema
export const updateCategory = Joi.object({
  name: Joi.string().trim().min(2).optional().example("Health").messages({
    "string.empty": "Category name cannot be empty",
  }),
  description: Joi.string().optional().allow(null, "").example("Updated category description").messages({
    "string.base": "Description must be a valid string",
  }),
  image: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/categories/category.jpg").messages({
    "string.uri": "Category image must be a valid URL",
  }),
});

// Middleware for validating category update
export const validateUpdateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateCategory.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
    return;
  }
  next();
};

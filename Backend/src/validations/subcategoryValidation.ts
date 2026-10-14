import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createSubcategory = Joi.object({
  name: Joi.string().trim().min(2).required().example("Lever Handles").messages({
    "string.empty": "Subcategory name is required",
    "any.required": "Subcategory name is required",
  }),
  categoryId: Joi.number().integer().positive().required().example(1).messages({
    "number.base": "Valid Category ID is required",
    "any.required": "Category ID is required",
  }),
  slug: Joi.string().trim().optional().allow(null, "").example("lever-handles"),
  description: Joi.string().optional().allow(null, "").example("Precision-engineered architectural lever handles"),
  image: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/subcategories/lever-handles.jpg"),
  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE").example("ACTIVE"),
});

export const validateCreateSubcategory = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createSubcategory.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
    return;
  }
  next();
};

export const updateSubcategory = Joi.object({
  name: Joi.string().trim().min(2).optional().example("Pull Handles").messages({
    "string.empty": "Subcategory name cannot be empty",
  }),
  categoryId: Joi.number().integer().positive().optional().example(1).messages({
    "number.base": "Category ID must be a valid number",
  }),
  slug: Joi.string().trim().optional().allow(null, "").example("pull-handles"),
  description: Joi.string().optional().allow(null, "").example("Modern stainless steel pull handles"),
  image: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/subcategories/pull-handles.jpg"),
  status: Joi.string().valid("ACTIVE", "INACTIVE").optional().example("ACTIVE"),
});

export const validateUpdateSubcategory = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateSubcategory.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
    return;
  }
  next();
};

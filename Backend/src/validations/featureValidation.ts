import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const createFeature = Joi.object({
  title: Joi.string().required().example("High Precision").messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().required().example("Provides precision tolerance up to 0.01mm.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  image: Joi.string().optional().allow(null, ""),
  productId: Joi.number().required().example(1).messages({
    "any.required": "Product ID is required",
    "number.base": "Product ID must be a number",
  }),
});

export const updateFeature = Joi.object({
  title: Joi.string().optional().allow("").example("High Precision"),
  description: Joi.string().optional().allow("").example("Provides precision tolerance up to 0.01mm."),
  image: Joi.string().optional().allow(null, ""),
  productId: Joi.number().optional().example(1),
});

export const validateCreateFeature = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createFeature.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
      errors: error.details.map((d) => d.message),
    });
    return;
  }

  next();
};

export const validateUpdateFeature = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateFeature.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
      errors: error.details.map((d) => d.message),
    });
    return;
  }

  next();
};

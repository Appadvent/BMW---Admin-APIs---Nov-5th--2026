import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createProductHeadingSchema = Joi.object({
  title: Joi.string().required().example("Engineered for Precision").messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().required().example("Explore our wide range of industrial components and specialized equipment.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
});

export const updateProductHeadingSchema = Joi.object({
  title: Joi.string().optional().example("Engineered for Precision"),
  description: Joi.string().optional().example("Explore our wide range of industrial components and specialized equipment."),
});

export const validateCreateProductHeading = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createProductHeadingSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateProductHeading = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateProductHeadingSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

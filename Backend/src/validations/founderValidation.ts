import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createFounderSchema = Joi.object({
  name: Joi.string().max(80).required().example("Jane Doe").messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
    "string.max": "Name cannot exceed 80 characters",
  }),
  title: Joi.string().max(80).required().example("CEO & Co-Founder").messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
    "string.max": "Title cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).required().example("Leading manufacturing innovation for over 15 years.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
    "string.max": "Description cannot exceed 300 characters",
  }),
  image: Joi.string().optional().allow(null, ""),
});

export const updateFounderSchema = Joi.object({
  name: Joi.string().max(80).optional().allow("").example("Jane Doe").messages({
    "string.max": "Name cannot exceed 80 characters",
  }),
  title: Joi.string().max(80).optional().allow("").example("CEO & Co-Founder").messages({
    "string.max": "Title cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).optional().allow("").example("Leading manufacturing innovation for over 15 years.").messages({
    "string.max": "Description cannot exceed 300 characters",
  }),
  image: Joi.string().allow(null, "").optional(),
  existingImage: Joi.string().allow(null, "").optional(),
});

export const validateCreateFounder = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createFounderSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateFounder = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateFounderSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

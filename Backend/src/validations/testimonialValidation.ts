import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createTestimonialSchema = Joi.object({
  name: Joi.string().trim().max(120).required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
    "string.max": "Name cannot exceed 120 characters",
  }),
  message: Joi.string().trim().max(2000).required().messages({
    "string.empty": "Message is required",
    "any.required": "Message is required",
    "string.max": "Message cannot exceed 2000 characters",
  }),
  designation: Joi.string().trim().max(120).optional().allow(null, "").messages({
    "string.max": "Designation cannot exceed 120 characters",
  }),
  image: Joi.string().trim().uri().optional().allow(null, "").messages({
    "string.uri": "Profile image must be a valid URL",
  }),
});

export const updateTestimonialSchema = Joi.object({
  name: Joi.string().trim().max(120).optional().messages({
    "string.empty": "Name cannot be empty",
    "string.max": "Name cannot exceed 120 characters",
  }),
  message: Joi.string().trim().max(2000).optional().messages({
    "string.empty": "Message cannot be empty",
    "string.max": "Message cannot exceed 2000 characters",
  }),
  designation: Joi.string().trim().max(120).optional().allow(null, "").messages({
    "string.max": "Designation cannot exceed 120 characters",
  }),
  image: Joi.string().trim().uri().optional().allow(null, "").messages({
    "string.uri": "Profile image must be a valid URL",
  }),
});

export const validateCreateTestimonial = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = createTestimonialSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateTestimonial = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = updateTestimonialSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

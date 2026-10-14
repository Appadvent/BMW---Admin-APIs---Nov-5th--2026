import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createBannerSchema = Joi.object({
  bgMediaType: Joi.string().valid("IMAGE", "VIDEO").default("IMAGE").messages({
    "any.only": "Background media type must be either IMAGE or VIDEO",
  }),
  bgMedia: Joi.string().trim().required().messages({
    "string.empty": "Background media URL is required",
    "any.required": "Background media URL is required",
  }),
  label: Joi.string().trim().max(100).optional().allow(null, "").messages({
    "string.max": "Label cannot exceed 100 characters",
  }),
  heading: Joi.string().trim().max(180).required().messages({
    "string.empty": "Heading is required",
    "any.required": "Heading is required",
    "string.max": "Heading cannot exceed 180 characters",
  }),
  description: Joi.string().trim().max(500).optional().allow(null, "").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  textAlignment: Joi.string().valid("LEFT", "CENTER", "RIGHT").default("LEFT").messages({
    "any.only": "Text alignment must be LEFT, CENTER, or RIGHT",
  }),
  primaryBtnText: Joi.string().trim().max(60).optional().allow(null, "").messages({
    "string.max": "Primary button text cannot exceed 60 characters",
  }),
  primaryBtnLink: Joi.string().trim().max(255).optional().allow(null, "").messages({
    "string.max": "Primary button link cannot exceed 255 characters",
  }),
  secondaryBtnText: Joi.string().trim().max(60).optional().allow(null, "").messages({
    "string.max": "Secondary button text cannot exceed 60 characters",
  }),
  secondaryBtnLink: Joi.string().trim().max(255).optional().allow(null, "").messages({
    "string.max": "Secondary button link cannot exceed 255 characters",
  }),
  sideImage: Joi.string().trim().optional().allow(null, ""),
  sideImagePosition: Joi.string().valid("LEFT", "RIGHT").default("RIGHT").messages({
    "any.only": "Side image position must be LEFT or RIGHT",
  }),
  sequence: Joi.number().integer().min(1).default(1),
  isActive: Joi.boolean().default(true),
});

export const updateBannerSchema = Joi.object({
  bgMediaType: Joi.string().valid("IMAGE", "VIDEO").optional().messages({
    "any.only": "Background media type must be either IMAGE or VIDEO",
  }),
  bgMedia: Joi.string().trim().optional().messages({
    "string.empty": "Background media URL cannot be empty",
  }),
  label: Joi.string().trim().max(100).optional().allow(null, "").messages({
    "string.max": "Label cannot exceed 100 characters",
  }),
  heading: Joi.string().trim().max(180).optional().messages({
    "string.empty": "Heading cannot be empty",
    "string.max": "Heading cannot exceed 180 characters",
  }),
  description: Joi.string().trim().max(500).optional().allow(null, "").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  textAlignment: Joi.string().valid("LEFT", "CENTER", "RIGHT").optional().messages({
    "any.only": "Text alignment must be LEFT, CENTER, or RIGHT",
  }),
  primaryBtnText: Joi.string().trim().max(60).optional().allow(null, "").messages({
    "string.max": "Primary button text cannot exceed 60 characters",
  }),
  primaryBtnLink: Joi.string().trim().max(255).optional().allow(null, "").messages({
    "string.max": "Primary button link cannot exceed 255 characters",
  }),
  secondaryBtnText: Joi.string().trim().max(60).optional().allow(null, "").messages({
    "string.max": "Secondary button text cannot exceed 60 characters",
  }),
  secondaryBtnLink: Joi.string().trim().max(255).optional().allow(null, "").messages({
    "string.max": "Secondary button link cannot exceed 255 characters",
  }),
  sideImage: Joi.string().trim().optional().allow(null, ""),
  sideImagePosition: Joi.string().valid("LEFT", "RIGHT").optional().messages({
    "any.only": "Side image position must be LEFT or RIGHT",
  }),
  sequence: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
});

export const validateCreateBanner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = createBannerSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateBanner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = updateBannerSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

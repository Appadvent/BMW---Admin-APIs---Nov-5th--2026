import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createHomeSchema = Joi.object({
  title: Joi.string().max(80).required().example("Precision Manufacturing").messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
    "string.max": "Title cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).required().example("State-of-the-art CNC machining and assembly solutions.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
    "string.max": "Description cannot exceed 300 characters",
  }),
  image1: Joi.string().optional().allow(null, ""),
  image2: Joi.string().optional().allow(null, ""),
  image3: Joi.string().optional().allow(null, ""),
});

export const updateHomeSchema = Joi.object({
  title: Joi.string().max(80).optional().allow("").example("Precision Manufacturing").messages({
    "string.max": "Title cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).optional().allow("").example("State-of-the-art CNC machining and assembly solutions.").messages({
    "string.max": "Description cannot exceed 300 characters",
  }),
  image1: Joi.string().optional().allow(null, ""),
  image2: Joi.string().optional().allow(null, ""),
  image3: Joi.string().optional().allow(null, ""),
});

export const validateCreateHome = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createHomeSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateHome = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateHomeSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

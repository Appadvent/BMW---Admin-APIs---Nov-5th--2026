import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createReviewSchema = Joi.object({
  name: Joi.string().max(80).required().example("Alex Taylor").messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
    "string.max": "Name cannot exceed 80 characters",
  }),
  title: Joi.string().required().example("Exceptional Build Quality").messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(300).required().example("The turnaround time and fabrication accuracy exceeded our expectations.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
    "string.max": "Description cannot exceed 300 characters",
  }),
  image: Joi.string().optional().allow(null, ""),
});

export const updateReviewSchema = Joi.object({
  name: Joi.string().max(80).optional().allow("").example("Alex Taylor").messages({
    "string.max": "Name cannot exceed 80 characters",
  }),
  title: Joi.string().optional().allow("").example("Exceptional Build Quality"),
  description: Joi.string().max(300).optional().allow("").example("The turnaround time and fabrication accuracy exceeded our expectations.").messages({
    "string.max": "Description cannot exceed 300 characters",
  }),
  image: Joi.string().optional().allow(null, ""),
});

export const validateCreateReview = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createReviewSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateReview = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateReviewSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

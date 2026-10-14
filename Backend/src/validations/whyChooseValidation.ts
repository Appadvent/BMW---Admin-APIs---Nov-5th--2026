import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const whyChooseItemSchema = Joi.object({
  id: Joi.number().optional(),
  description: Joi.string().max(120).required().example("ISO 9001 certified manufacturing standards.").messages({
    "string.empty": "Item description is required",
    "any.required": "Item description is required",
    "string.max": "Item description cannot exceed 120 characters",
  }),
});

export const createWhyChooseSchema = Joi.object({
  heading: Joi.string().max(60).required().example("Why Choose Streamline Factory").messages({
    "string.empty": "Heading is required",
    "any.required": "Heading is required",
    "string.max": "Heading cannot exceed 60 characters",
  }),
  description: Joi.string().max(300).required().example("Industry-leading precision, state-of-the-art technology, and dedicated customer support.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
    "string.max": "Description cannot exceed 300 characters",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(whyChooseItemSchema),
    Joi.string()
  ).optional().example([
    { description: "ISO 9001 certified manufacturing standards." }
  ]),
});

export const updateWhyChooseSchema = Joi.object({
  heading: Joi.string().max(60).optional().example("Why Choose Streamline Factory").messages({
    "string.max": "Heading cannot exceed 60 characters",
  }),
  description: Joi.string().max(300).optional().example("Industry-leading precision, state-of-the-art technology, and dedicated customer support.").messages({
    "string.max": "Description cannot exceed 300 characters",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(whyChooseItemSchema),
    Joi.string()
  ).optional().example([
    { description: "ISO 9001 certified manufacturing standards." }
  ]),
});

export const validateCreateWhyChoose = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createWhyChooseSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateWhyChoose = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateWhyChooseSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

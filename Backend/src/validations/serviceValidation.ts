import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const serviceItemSchema = Joi.object({
  id: Joi.number().optional(),
  title: Joi.string().max(80).required().example("Custom CNC Milling").messages({
    "string.empty": "Item title is required",
    "any.required": "Item title is required",
    "string.max": "Item title cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).required().example("High precision 5-axis milling for complex geometries.").messages({
    "string.empty": "Item description is required",
    "any.required": "Item description is required",
    "string.max": "Item description cannot exceed 300 characters",
  }),
  image: Joi.string().optional().allow(null, ""),
});

export const createServiceSchema = Joi.object({
  heading: Joi.string().max(300).required().example("Our Comprehensive Industrial Services").messages({
    "string.empty": "Heading is required",
    "any.required": "Heading is required",
    "string.max": "Heading cannot exceed 300 characters",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(serviceItemSchema).max(5),
    Joi.string()
  ).optional().example([
    { title: "Custom CNC Milling", description: "High precision 5-axis milling for complex geometries.", image: "http://localhost:9000/streamline/services/cnc.jpg" }
  ]),
});

export const updateServiceSchema = Joi.object({
  heading: Joi.string().max(300).optional().example("Our Comprehensive Industrial Services").messages({
    "string.max": "Heading cannot exceed 300 characters",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(serviceItemSchema).max(5),
    Joi.string()
  ).optional().example([
    { title: "Custom CNC Milling", description: "High precision 5-axis milling for complex geometries.", image: "http://localhost:9000/streamline/services/cnc.jpg" }
  ]),
});

export const validateCreateService = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createServiceSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateService = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateServiceSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

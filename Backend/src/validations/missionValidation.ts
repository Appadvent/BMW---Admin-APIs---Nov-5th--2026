import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const missionItemSchema = Joi.object({
  title: Joi.string().max(80).required().example("Our Mission").messages({
    "string.empty": "Item title is required",
    "any.required": "Item title is required",
    "string.max": "Item title cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).required().example("To deliver sustainable and innovative engineering solutions.").messages({
    "string.empty": "Item description is required",
    "any.required": "Item description is required",
    "string.max": "Item description cannot exceed 300 characters",
  }),
});

export const createMissionSchema = Joi.object({
  heading: Joi.string().max(80).required().example("Mission & Vision").messages({
    "string.empty": "Heading is required",
    "any.required": "Heading is required",
    "string.max": "Heading cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).required().example("Guiding principles driving our enterprise.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
    "string.max": "Description cannot exceed 300 characters",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(missionItemSchema),
    Joi.string()
  ).optional().example([
    { title: "Our Mission", description: "To deliver sustainable and innovative engineering solutions." }
  ]),
});

export const updateMissionSchema = Joi.object({
  heading: Joi.string().max(80).optional().example("Mission & Vision").messages({
    "string.max": "Heading cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).optional().example("Guiding principles driving our enterprise.").messages({
    "string.max": "Description cannot exceed 300 characters",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(missionItemSchema),
    Joi.string()
  ).optional().example([
    { title: "Our Mission", description: "To deliver sustainable and innovative engineering solutions." }
  ]),
});

export const validateCreateMission = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createMissionSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateMission = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateMissionSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

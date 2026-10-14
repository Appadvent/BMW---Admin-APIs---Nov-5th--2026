import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const benefitItemSchema = Joi.object({
  title: Joi.string().max(80).required().example("High Reliability").messages({
    "string.empty": "Item title is required",
    "any.required": "Item title is required",
    "string.max": "Item title cannot exceed 80 characters",
  }),
  description: Joi.string().max(300).required().example("Built to withstand rigorous industrial environments.").messages({
    "string.empty": "Item description is required",
    "any.required": "Item description is required",
    "string.max": "Item description cannot exceed 300 characters",
  }),
});

export const createBenefitSchema = Joi.object({
  heading: Joi.string().required().example("Why Our Solutions Deliver Value").messages({
    "string.empty": "Heading is required",
    "any.required": "Heading is required",
  }),
  description: Joi.string().required().example("Discover the core advantages of partnering with us.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(benefitItemSchema),
    Joi.string()
  ).optional().example([
    { title: "High Reliability", description: "Built to withstand rigorous industrial environments." }
  ]),
});

export const updateBenefitSchema = Joi.object({
  heading: Joi.string().optional().example("Why Our Solutions Deliver Value"),
  description: Joi.string().optional().example("Discover the core advantages of partnering with us."),
  items: Joi.alternatives().try(
    Joi.array().items(benefitItemSchema),
    Joi.string()
  ).optional().example([
    { title: "High Reliability", description: "Built to withstand rigorous industrial environments." }
  ]),
});

export const validateCreateBenefit = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createBenefitSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateBenefit = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateBenefitSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

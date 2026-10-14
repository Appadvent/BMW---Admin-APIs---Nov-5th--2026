import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const planFeatureSchema = Joi.object({
  text: Joi.string().required().example("24/7 Support").messages({
    "string.empty": "Feature text is required",
    "any.required": "Feature text is required",
  }),
});

export const createPlanSchema = Joi.object({
  name: Joi.string().required().example("Professional").messages({
    "string.empty": "Plan name is required",
    "any.required": "Plan name is required",
  }),
  price: Joi.number().allow(null).optional().example(99.99),
  priceType: Joi.string().required().example("monthly").messages({
    "string.empty": "priceType is required",
    "any.required": "priceType is required",
  }),
  buttonText: Joi.string().optional().example("Choose Plan"),
  isPopular: Joi.boolean().optional().example(false),
  features: Joi.alternatives().try(
    Joi.array().items(planFeatureSchema),
    Joi.string()
  ).optional().example([
    { text: "24/7 Dedicated Support" },
    { text: "Unlimited Fabrication Requests" }
  ]),
});

export const updatePlanSchema = Joi.object({
  name: Joi.string().optional().example("Professional"),
  price: Joi.number().allow(null).optional().example(99.99),
  priceType: Joi.string().optional().example("monthly"),
  buttonText: Joi.string().optional().example("Choose Plan"),
  isPopular: Joi.boolean().optional().example(false),
  features: Joi.alternatives().try(
    Joi.array().items(planFeatureSchema),
    Joi.string()
  ).optional().example([
    { text: "24/7 Dedicated Support" },
    { text: "Unlimited Fabrication Requests" }
  ]),
});

export const validateCreatePlan = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createPlanSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdatePlan = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updatePlanSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const faqItemSchema = Joi.object({
  question: Joi.string().required().example("What materials do you support?").messages({
    "string.empty": "Question is required",
    "any.required": "Question is required",
  }),
  answer: Joi.string().required().example("We support steel, aluminum, and custom alloys.").messages({
    "string.empty": "Answer is required",
    "any.required": "Answer is required",
  }),
});

export const createFAQSchema = Joi.object({
  heading: Joi.string().required().example("Frequently Asked Questions").messages({
    "string.empty": "Heading is required",
    "any.required": "Heading is required",
  }),
  items: Joi.alternatives().try(
    Joi.array().items(faqItemSchema),
    Joi.string()
  ).optional().example([
    { question: "What materials do you support?", answer: "We support steel, aluminum, and custom alloys." }
  ]),
});

export const updateFAQSchema = Joi.object({
  heading: Joi.string().optional().example("Frequently Asked Questions"),
  items: Joi.alternatives().try(
    Joi.array().items(faqItemSchema),
    Joi.string()
  ).optional().example([
    { question: "What materials do you support?", answer: "We support steel, aluminum, and custom alloys." }
  ]),
});

export const validateCreateFAQ = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createFAQSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateFAQ = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateFAQSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

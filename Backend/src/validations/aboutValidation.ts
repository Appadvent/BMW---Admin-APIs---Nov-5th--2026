import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const aboutItemSchema = Joi.object({
  id: Joi.number().integer().optional(),
  title: Joi.string().required().messages({
    "string.empty": "Item title is required",
    "any.required": "Item title is required",
  }),
  description: Joi.string().optional().allow(null, ""),
  icon: Joi.string().optional().allow(null, ""),
  link: Joi.string().optional().allow(null, ""),
  order: Joi.number().integer().optional().default(0),
  isActive: Joi.boolean().optional().default(true),
});

const aboutSectionItemSchema = Joi.object({
  id: Joi.number().integer().optional(),
  title: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  image: Joi.string().optional().allow(null, ""),
  icon: Joi.string().optional().allow(null, ""),
  order: Joi.number().integer().optional().default(0),
  isActive: Joi.boolean().optional().default(true),
});

const aboutSectionSchema = Joi.object({
  id: Joi.number().integer().optional(),
  title: Joi.string().required().messages({
    "string.empty": "Section title is required",
    "any.required": "Section title is required",
  }),
  subtitle: Joi.string().optional().allow(null, ""),
  badge: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  content: Joi.string().optional().allow(null, ""),
  image: Joi.string().optional().allow(null, ""),
  imagePosition: Joi.string().valid("left", "right", "top", "none").optional().default("left"),
  layout: Joi.string().optional().allow(null, "").default("default"),
  order: Joi.number().integer().optional().default(0),
  isActive: Joi.boolean().optional().default(true),
  items: Joi.array().items(aboutSectionItemSchema).optional().default([]),
});

export const createAboutSchema = Joi.object({
  badge: Joi.string().optional().allow(null, "").example("About Us"),
  title: Joi.string().optional().allow(null, "").example("Building Better Spaces Together"),
  subtitle: Joi.string().optional().allow(null, "").example("Leading Engineering & Fabrication"),
  description: Joi.string().optional().allow(null, "").example("We are dedicated to delivering state-of-the-art engineering solutions."),
  content: Joi.string().optional().allow(null, "").example("Our legacy spans over two decades of precision manufacturing."),
  image: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/about/about-main.jpg"),
  image2: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/about/about-secondary.jpg"),
  videoUrl: Joi.string().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/about/about-video.mp4"),
  layout: Joi.string().valid("image-left", "image-right", "image-top", "text-only", "centered", "split").optional().default("image-left"),
  itemsLayout: Joi.string().valid("grid", "list", "cards", "columns-2", "columns-3", "columns-4").optional().default("grid"),
  alignment: Joi.string().valid("left", "center", "right").optional().default("left"),
  ctaEnabled: Joi.boolean().optional().default(false),
  ctaText: Joi.string().optional().allow(null, "").default("Know More"),
  ctaLink: Joi.string().optional().allow(null, "").example("/contact"),
  ctaTarget: Joi.string().valid("_self", "_blank").optional().default("_self"),
  isActive: Joi.boolean().optional().default(true),
  items: Joi.array().items(aboutItemSchema).optional().default([]),
  sections: Joi.array().items(aboutSectionSchema).optional().default([]),

  // Legacy compatibility fields
  titleOne: Joi.string().optional().allow(null, ""),
  titleTwo: Joi.string().optional().allow(null, ""),
  descriptionOne: Joi.string().optional().allow(null, ""),
  descriptionTwo: Joi.string().optional().allow(null, ""),
});

export const updateAboutSchema = Joi.object({
  badge: Joi.string().optional().allow(null, "").example("About Us"),
  title: Joi.string().optional().allow(null, "").example("Building Better Spaces Together"),
  subtitle: Joi.string().optional().allow(null, "").example("Leading Engineering & Fabrication"),
  description: Joi.string().optional().allow(null, "").example("We are dedicated to delivering state-of-the-art engineering solutions."),
  content: Joi.string().optional().allow(null, "").example("Our legacy spans over two decades of precision manufacturing."),
  image: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/about/about-main.jpg"),
  image2: Joi.string().uri().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/about/about-secondary.jpg"),
  videoUrl: Joi.string().optional().allow(null, "").example("https://minioapi.appadvent.in/i-mag/about/about-video.mp4"),
  layout: Joi.string().valid("image-left", "image-right", "image-top", "text-only", "centered", "split").optional(),
  itemsLayout: Joi.string().valid("grid", "list", "cards", "columns-2", "columns-3", "columns-4").optional(),
  alignment: Joi.string().valid("left", "center", "right").optional(),
  ctaEnabled: Joi.boolean().optional(),
  ctaText: Joi.string().optional().allow(null, ""),
  ctaLink: Joi.string().optional().allow(null, ""),
  ctaTarget: Joi.string().valid("_self", "_blank").optional(),
  isActive: Joi.boolean().optional(),
  items: Joi.array().items(aboutItemSchema).optional(),
  sections: Joi.array().items(aboutSectionSchema).optional(),

  // Legacy compatibility fields
  titleOne: Joi.string().optional().allow(null, ""),
  titleTwo: Joi.string().optional().allow(null, ""),
  descriptionOne: Joi.string().optional().allow(null, ""),
  descriptionTwo: Joi.string().optional().allow(null, ""),
});

export const validateCreateAbout = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createAboutSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const validateUpdateAbout = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateAboutSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

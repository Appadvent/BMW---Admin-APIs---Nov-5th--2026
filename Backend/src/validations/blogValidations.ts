import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createBlog = Joi.object({
  title: Joi.string().required().example("How to Learn React").messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().required().example("This is a beginner’s guide to React.").messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  author: Joi.string().optional().allow("").example("Jane Doe"),
  publishedDate: Joi.date().optional().example("2025-11-15").messages({
    "date.base": "Invalid date format",
  }),
  image: Joi.string().optional().allow(null, ""),
  categoryId: Joi.number().integer().required().example(1).messages({
    "any.required": "Category ID is required",
    "number.base": "Category ID must be a number",
  }),
});

export const validateCreateBlog = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createBlog.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export const updateBlog = Joi.object({
  title: Joi.string().optional().allow("").example("Updated React Guide"),
  description: Joi.string().optional().allow("").example("Updated beginner’s guide to React."),
  author: Joi.string().optional().allow("").example("Jane Doe"),
  publishedDate: Joi.date().optional().messages({
    "date.base": "Invalid date format",
  }),
  image: Joi.string().optional().allow(null, ""),
  categoryId: Joi.number().optional().example(1),
});

export const validateUpdateBlog = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateBlog.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

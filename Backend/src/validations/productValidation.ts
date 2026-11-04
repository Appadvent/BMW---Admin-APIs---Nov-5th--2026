import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createProduct = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  image: Joi.string().optional().allow(null, "").messages({
    "string.base": "Image must be a valid URL string",
  }),
  brochure: Joi.string().optional().allow(null, "").messages({
    "string.base": "Brochure must be a valid URL string",
  }),
  tag: Joi.string().optional().allow(null, "").messages({
    "string.base": "Tag must be a valid string",
  }),
  price: Joi.number().optional().allow(null, "").messages({
    "number.base": "Price must be a valid number",
  }),
  finish: Joi.string().optional().allow(null, "").messages({
    "string.base": "Finish must be a valid string",
  }),
  oemNumber: Joi.string().optional().allow(null, "").messages({
    "string.base": "OEM number must be a valid string",
  }),
  make: Joi.string().optional().allow(null, "").messages({
    "string.base": "Make / Brand must be a valid string",
  }),
  model: Joi.string().optional().allow(null, "").messages({
    "string.base": "Model must be a valid string",
  }),
  yearRange: Joi.string().optional().allow(null, "").messages({
    "string.base": "Year range must be a valid string",
  }),
  position: Joi.string().optional().allow(null, "").messages({
    "string.base": "Position must be a valid string",
  }),
  condition: Joi.string().optional().allow(null, "").messages({
    "string.base": "Condition must be a valid string",
  }),
  categoryId: Joi.number().integer().positive().optional().allow(null).messages({
    "number.base": "Category ID must be a valid number",
  }),
  subcategoryId: Joi.number().integer().positive().optional().allow(null).messages({
    "number.base": "Subcategory ID must be a valid number",
  }),
  specifications: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        name: Joi.string().required().messages({
          "string.empty": "Specification name is required",
        }),
        value: Joi.string().required().messages({
          "string.empty": "Specification value is required",
        }),
        order: Joi.number().integer().optional(),
      })
    )
    .optional()
    .allow(null),
});

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createProduct.validate(req.body, { abortEarly: true });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
    return;
  }

  next();
};

export const updateProduct = Joi.object({
  title: Joi.string().optional().allow("").messages({
    "string.empty": "Title cannot be empty",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.empty": "Description cannot be empty",
  }),
  image: Joi.string().optional().allow(null, "").messages({
    "string.base": "Image must be a valid URL string",
  }),
  brochure: Joi.string().optional().allow(null, "").messages({
    "string.base": "Brochure must be a valid URL string",
  }),
  tag: Joi.string().optional().allow(null, "").messages({
    "string.base": "Tag must be a valid string",
  }),
  price: Joi.number().optional().allow(null, "").messages({
    "number.base": "Price must be a valid number",
  }),
  finish: Joi.string().optional().allow(null, "").messages({
    "string.base": "Finish must be a valid string",
  }),
  oemNumber: Joi.string().optional().allow(null, "").messages({
    "string.base": "OEM number must be a valid string",
  }),
  make: Joi.string().optional().allow(null, "").messages({
    "string.base": "Make / Brand must be a valid string",
  }),
  model: Joi.string().optional().allow(null, "").messages({
    "string.base": "Model must be a valid string",
  }),
  yearRange: Joi.string().optional().allow(null, "").messages({
    "string.base": "Year range must be a valid string",
  }),
  position: Joi.string().optional().allow(null, "").messages({
    "string.base": "Position must be a valid string",
  }),
  condition: Joi.string().optional().allow(null, "").messages({
    "string.base": "Condition must be a valid string",
  }),
  categoryId: Joi.number().integer().positive().optional().allow(null).messages({
    "number.base": "Category ID must be a valid number",
  }),
  subcategoryId: Joi.number().integer().positive().optional().allow(null).messages({
    "number.base": "Subcategory ID must be a valid number",
  }),
  specifications: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        name: Joi.string().required().messages({
          "string.empty": "Specification name is required",
        }),
        value: Joi.string().required().messages({
          "string.empty": "Specification value is required",
        }),
        order: Joi.number().integer().optional(),
      })
    )
    .optional()
    .allow(null),
});

export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateProduct.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
    return;
  }
  next();
};

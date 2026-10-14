import Joi from "joi";
import { Request, Response, NextFunction } from "express";
export const queryValidation = Joi.object({
   name: Joi.string().required().example("Ajay Kumar").messages({
       "string.empty": "Name is required",
       "any.required": "Name is required",
   }),
   email: Joi.string().email().required().example("ajaykumar321@yopmail.com").messages({
       "string.empty": "Email is required",
       "any.required": "Email is required",
       "string.email": "Invalid email format",
   }),
   message: Joi.string().required().example("Need custom fabrication quote.").messages({
       "string.empty": "Message is required",
       "any.required": "Message is required",
   }),
   services: Joi.string().allow("", null).optional().example("CNC Machining"),
   service: Joi.string().allow("", null).optional(),
   category: Joi.string().allow("", null).optional(),
   phone: Joi.alternatives().try(
       Joi.string().pattern(/^[0-9+ -]{7,20}$/),
       Joi.number()
   ).required().example("9876543210").messages({
       "any.required": "Phone number is required",
   }),
}).unknown(true);

export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
    const { error } = queryValidation.validate(req.body);
    if (error) {
        res.status(400).json({
            message: error.details[0].message
        })
        return
    }
    next();
}
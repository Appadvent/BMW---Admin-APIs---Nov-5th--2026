import Joi from "joi";
import { Response, Request, NextFunction } from "express";



export const adminLoginValidation = Joi.object({
    email: Joi.string().email().required().example("ajaykumar321@yopmail.com").messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: Joi.string().min(8).required().example("Ajay@1234").messages({
        "string.empty": "Password is required",
        "string.min": "Password should be at least 8 characters long",  
    }),
})

export const ValidateAdminLogin = (req: Request, res: Response, next: NextFunction) => {
    const { error } = adminLoginValidation.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return
    }
    next();
}

export const emailSendValidation = Joi.object({
    email: Joi.string().email().required().example("ajaykumar321@yopmail.com").messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    subject: Joi.string().required().example("Hello").messages({
        "string.empty": "Subject is required",
    }),
    content: Joi.string().required().example("Hello ").messages({
        "string.empty": "Content is required",
    }),
})

export const ValidateEmailSend = (req: Request, res: Response, next: NextFunction) => {
    const { error } = emailSendValidation.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return
    }
    next();
}





import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createPage = Joi.object({
    type: Joi.string().required().example("policy").messages({
        "string.empty": "Type is required",
    }),
    title: Joi.string().required().example("Privacy Policy").messages({
        "string.empty": "Title is required",
    }),
    content: Joi.string().required().example("Content for Privacy Policy").messages({
        "string.empty": "Content is required",
    }),
})

export const validateCreatePage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = createPage.validate(req.body);
    if (error) {
        res.status(400).json({
            message: error.details[0].message
        })
        return
    }
    next();
}

export const updatePage = Joi.object({
    type: Joi.string().optional().allow("").example("policy"),
    title: Joi.string().optional().allow("").example("Privacy Policy"),
    content: Joi.string().optional().allow("").example("Content for Privacy Policy"),
});

export const validateUpdatePage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = updatePage.validate(req.body);
    if (error) {
        res.status(400).json({
            message: error.details[0].message
        });
        return;
    }
    next();
};





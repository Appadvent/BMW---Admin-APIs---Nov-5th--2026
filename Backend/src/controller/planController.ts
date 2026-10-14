import { Request, Response } from "express";
import { planDao } from "../dao/plan.dao";

export const planController = {

    // CREATE PLAN
    createPlan: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, price, priceType, buttonText, features, isPopular } = req.body;

            // Check if plan already exists
            const existingPlan = await planDao.findByName(name);
            if (existingPlan) {
                res.status(400).json({ message: "Plan with this name already exists" });
                return;
            }

            const plan = await planDao.create({
                name,
                price,
                priceType,
                buttonText,
                features,
                isPopular
            });

            res.status(200).json({
                message: "Plan created successfully",
                data: plan
            });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // UPDATE PLAN
    updatePlan: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, price, priceType, buttonText, features, isPopular } = req.body;

            const existingPlan = await planDao.getById(Number(id));
            if (!existingPlan) {
                res.status(404).json({ message: "Plan not found" });
                return;
            }

            const updatedPlan = await planDao.update(Number(id), {
                name,
                price,
                priceType,
                buttonText,
                features,
                isPopular
            });

            res.status(200).json({
                message: "Plan updated successfully",
                data: updatedPlan
            });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // DELETE PLAN
    deletePlan: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const existingPlan = await planDao.getById(Number(id));
            if (!existingPlan) {
                res.status(404).json({ message: "Plan not found" });
                return;
            }

            await planDao.delete(Number(id));

            res.status(200).json({ message: "Plan deleted successfully" });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // GET ALL PLANS
    getPlans: async (req: Request, res: Response): Promise<void> => {
        try {
            const plans = await planDao.getAll();

            res.status(200).json({
                message: "Plans fetched successfully",
                data: plans
            });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // GET PLAN BY ID
    getPlanById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const plan = await planDao.getById(Number(id));
            if (!plan) {
                res.status(404).json({ message: "Plan not found" });
                return;
            }

            res.status(200).json({
                message: "Plan fetched successfully",
                data: plan
            });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

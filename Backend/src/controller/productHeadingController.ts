import { Request, Response } from "express";
import { ProductHeadingDao } from "../dao/productHeading.dao";

export const ProductHeadingController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const headings = await ProductHeadingDao.getAllProductHeadings();
      res.json(headings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const heading = await ProductHeadingDao.getProductHeadingById(id);
      if (!heading) {res.status(404).json({ error: "ProductHeading not found" });
      return
    }
      res.json(heading);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      const heading = await ProductHeadingDao.createProductHeading({ title, description });
      res.status(201).json(heading);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { title, description } = req.body;
      const heading = await ProductHeadingDao.updateProductHeading(id, { title, description });
      res.json(heading);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await ProductHeadingDao.deleteProductHeading(id);
      res.json({ message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};

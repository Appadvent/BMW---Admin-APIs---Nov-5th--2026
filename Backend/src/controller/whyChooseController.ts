import { Request, Response } from "express";
import { WhyChooseDao } from "../dao/whyChoose.dao";

export const WhyChooseController = {
  createWhyChoose: async (req: Request, res: Response) => {
    try {
      const { heading, description, items } = req.body;

      const parsedItems = Array.isArray(items) ? items : JSON.parse(items);

      const data = await WhyChooseDao.createWhyChoose({
        heading,
        description,
        items: parsedItems,
      });

      res.status(201).json({
        success: true,
        message: "Why Choose created successfully",
        data,
      });
    } catch (error) {
      console.error("Create WhyChoose Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getAllWhyChoose: async (req: Request, res: Response) => {
    try {
      const list = await WhyChooseDao.getAllWhyChoose();
      res.status(200).json({ success: true, data: list });
    } catch (error) {
      console.error("Get WhyChoose Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getWhyChooseById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const data = await WhyChooseDao.getWhyChooseById(id);

      if (!data) {
         res
          .status(404)
          .json({ success: false, message: "Why Choose not found" });
          return
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Get WhyChoose Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateWhyChoose: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { heading, description, items } = req.body;

      const existing = await WhyChooseDao.getWhyChooseById(id);
      if (!existing) {
         res
          .status(404)
          .json({ success: false, message: "Why Choose not found" });
          return
      }

      const parsedItems = Array.isArray(items) ? items : JSON.parse(items);

      const updated = await WhyChooseDao.updateWhyChoose(id, {
        heading,
        description,
        items: parsedItems,
      });

      res.status(200).json({
        success: true,
        message: "Why Choose updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Update WhyChoose Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  deleteWhyChoose: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const existing = await WhyChooseDao.getWhyChooseById(id);
      if (!existing) {
         res
          .status(404)
          .json({ success: false, message: "Why Choose not found" });
          return
      }

      await WhyChooseDao.deleteWhyChoose(id);

      res.status(200).json({
        success: true,
        message: "Why Choose deleted successfully",
      });
    } catch (error) {
      console.error("Delete WhyChoose Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
};

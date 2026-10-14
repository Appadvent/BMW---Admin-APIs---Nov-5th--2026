import { Request, Response } from "express";
import { FAQDao } from "../dao/faq.dao";

export const FAQController = {
  createFAQSection: async (req: Request, res: Response) => {
    try {
      const { heading, items } = req.body;
      const parsedItems = Array.isArray(items)
        ? items
        : typeof items === "string"
        ? JSON.parse(items)
        : [];

      const data = await FAQDao.createFAQSection({
        heading,
        items: parsedItems,
      });

      res.status(201).json({
        success: true,
        message: "FAQ Section created successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  getAllFAQSections: async (req: Request, res: Response) => {
    try {
      const list = await FAQDao.getAllFAQSections();
      res.status(200).json({ success: true, data: list });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getFAQSectionById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await FAQDao.getFAQSectionById(id);

      if (!data) {
        res
          .status(404)
          .json({ success: false, message: "FAQ Section not found" });
          return
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateFAQSection: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { heading, items } = req.body;

      const existing = await FAQDao.getFAQSectionById(id);
      if (!existing){
        res
          .status(404)
          .json({ success: false, message: "FAQ Section not found" });
          return
      }
      const parsedItems = Array.isArray(items)
        ? items
        : typeof items === "string"
        ? JSON.parse(items)
        : [];

      const updated = await FAQDao.updateFAQSection(id, {
        heading,
        items: parsedItems,
      });

      res.status(200).json({
        success: true,
        message: "FAQ Section updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  deleteFAQSection: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existing = await FAQDao.getFAQSectionById(id);

      if (!existing){
         res
          .status(404)
          .json({ success: false, message: "FAQ Section not found" });
          return
      }
      await FAQDao.deleteFAQSection(id);

      res.status(200).json({
        success: true,
        message: "FAQ Section deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
};

import { Request, Response } from "express";
import { FounderDao } from "../dao/founder.dao";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const FounderController = {
  createFounder: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, title, description, image } = req.body;

      const founder = await FounderDao.createFounder({
        name,
        title,
        description,
        image: typeof image === "string" ? image : null,
      });

      res.status(201).json({
        success: true,
        message: "Founder created successfully",
        data: founder,
      });
    } catch (error) {
      console.error("Create Founder Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getAllFounders: async (req: Request, res: Response): Promise<void> => {
    try {
      const founders = await FounderDao.getAllFounders();
      res.status(200).json({ success: true, data: founders });
    } catch (error) {
      console.error("Get Founders Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getFounderById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const founder = await FounderDao.getFounderById(id);
      if (!founder) {
        res.status(404).json({ success: false, message: "Founder not found" });
        return;
      }
      res.status(200).json({ success: true, data: founder });
    } catch (error) {
      console.error("Get Founder Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateFounder: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { name, title, description, image, existingImage } = req.body;

      // check exist
      const existing = await FounderDao.getFounderById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Founder not found" });
        return;
      }

      let newImage: string | null | undefined = existing.image ?? null;

      if (image !== undefined) {
        newImage = image;
        if (existing.image && existing.image !== image) {
          await deleteFileFromMinIO(existing.image);
        }
      } else if (existingImage === "null" || existingImage === null) {
        newImage = null;
        if (existing.image) {
          await deleteFileFromMinIO(existing.image);
        }
      }

      const updated = await FounderDao.updateFounder(id, {
        name,
        title,
        description,
        image: newImage,
      });

      res.status(200).json({ success: true, message: "Founder updated", data: updated });
    } catch (error) {
      console.error("Update Founder Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  deleteFounder: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const existing = await FounderDao.getFounderById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Founder not found" });
        return;
      }

      // delete image from MinIO
      if (existing.image) {
        await deleteFileFromMinIO(existing.image);
      }

      await FounderDao.deleteFounder(id);
      res.status(200).json({ success: true, message: "Founder deleted" });
    } catch (error) {
      console.error("Delete Founder Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
};

import { Request, Response } from "express";
import { HomeDao } from "../dao/home.dao";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const HomeController = {
  createHome: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, image1, image2, image3 } = req.body;

      const home = await HomeDao.createHome({
        title,
        description,
        image1: typeof image1 === "string" ? image1 : null,
        image2: typeof image2 === "string" ? image2 : null,
        image3: typeof image3 === "string" ? image3 : null,
      });

      res.status(201).json({ success: true, data: home });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },

  getHomes: async (req: Request, res: Response): Promise<void> => {
    try {
      const homes = await HomeDao.getHomes();
      res.status(200).json({ success: true, data: homes });
    } catch {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },

  updateHome: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, image1, image2, image3 } = req.body;

      const existing = await HomeDao.getHomeById(Number(id));
      if (!existing) {
        res.status(404).json({ success: false, message: "Not found" });
        return;
      }

      const updatedData: any = { title, description };
      const images = { image1, image2, image3 };

      const imgFields = ["image1", "image2", "image3"] as const;

      for (const field of imgFields) {
        if (images[field] !== undefined) {
          if (existing[field] && existing[field] !== images[field]) {
            await deleteFileFromMinIO(existing[field] as string);
          }
          updatedData[field] = images[field] ? String(images[field]) : null;
        }
      }

      const home = await HomeDao.updateHome(Number(id), updatedData);

      res.status(200).json({ success: true, data: home });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },

  deleteHome: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existing = await HomeDao.getHomeById(Number(id));
      if (!existing) {
        res.status(404).json({ success: false, message: "Not found" });
        return;
      }
      const imgFields = ["image1", "image2", "image3"] as const;

      for (const img of imgFields) {
        if (existing[img]) {
          await deleteFileFromMinIO(existing[img] as string);
        }
      }

      await HomeDao.deleteHome(Number(id));

      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
};

import { Request, Response } from "express";
import { MissionVisionDao } from "../dao/mission.dao";

export const MissionVisionController = {
  createMissionVision: async (req: Request, res: Response) => {
    try {
      const { heading, description, items } = req.body;

      const parsedItems =
        Array.isArray(items)
          ? items
          : typeof items === "string"
          ? JSON.parse(items)
          : [];

      const data = await MissionVisionDao.createMissionVision({
        heading,
        description,
        items: parsedItems,
      });

      res.status(201).json({
        success: true,
        message: "Mission & Vision created successfully",
        data,
      });
    } catch (error: any) {
      console.error("Create MissionVision Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  getAllMissionVision: async (req: Request, res: Response) => {
    try {
      const list = await MissionVisionDao.getAllMissionVision();
      res.status(200).json({ success: true, data: list });
    } catch (error) {
      console.error("Get MissionVision Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getMissionVisionById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await MissionVisionDao.getMissionVisionById(id);

      if (!data) {
        res
          .status(404)
          .json({ success: false, message: "Mission & Vision not found" });
          return
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Get MissionVision Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateMissionVision: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { heading, description, items } = req.body;

      const existing = await MissionVisionDao.getMissionVisionById(id);
      if (!existing) {
        res
          .status(404)
          .json({ success: false, message: "Mission & Vision not found" });
          return
      }

      const parsedItems =
        Array.isArray(items)
          ? items
          : typeof items === "string"
          ? JSON.parse(items)
          : [];

      const updated = await MissionVisionDao.updateMissionVision(id, {
        heading,
        description,
        items: parsedItems,
      });

      res.status(200).json({
        success: true,
        message: "Mission & Vision updated successfully",
        data: updated,
      });
    } catch (error: any) {
      console.error("Update MissionVision Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  deleteMissionVision: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const existing = await MissionVisionDao.getMissionVisionById(id);
      if (!existing) {
         res
          .status(404)
          .json({ success: false, message: "Mission & Vision not found" });
          return 
      }

      await MissionVisionDao.deleteMissionVision(id);

      res.status(200).json({
        success: true,
        message: "Mission & Vision deleted successfully",
      });
    } catch (error) {
      console.error("Delete MissionVision Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};

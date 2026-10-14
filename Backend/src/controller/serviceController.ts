import { Request, Response } from "express";
import { ServiceDao } from "../dao/service.dao";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const ServiceController = {
  // CREATE SERVICE (Heading + Items)
  createService: async (req: Request, res: Response): Promise<void> => {
    try {
      const { heading, items } = req.body;
      const parsedItems = typeof items === "string" ? JSON.parse(items || "[]") : (items || []);

      const formattedItems = parsedItems.map((item: any) => ({
        title: item.title,
        description: item.description,
        image: typeof item.image === "string" ? item.image : null,
      }));

      if (formattedItems.length > 5) {
        res.status(400).json({
          success: false,
          message: "A service cannot have more than 5 items.",
        });
        return;
      }

      const newService = await ServiceDao.createService({
        heading,
        items: formattedItems,
      });

      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: newService,
      });
    } catch (error) {
      console.log("Create Service Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // GET ALL SERVICES
  getAllServices: async (req: Request, res: Response): Promise<void> => {
    try {
      const services = await ServiceDao.getAllServices();
      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // GET SERVICE BY ID
  getServiceById: async (req: Request, res: Response): Promise<void> => {
    try {
      const service = await ServiceDao.getServiceById(Number(req.params.id));
      if (!service) {
        res.status(404).json({ success: false, message: "Service not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateService: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { heading, items } = req.body;

      const existing = await ServiceDao.getServiceById(Number(id));
      if (!existing) {
        res.status(404).json({ success: false, message: "Service not found" });
        return;
      }

      const parsedItems = typeof items === "string" ? JSON.parse(items || "[]") : (items || []);

      if (parsedItems.length > 5) {
        res.status(400).json({
          success: false,
          message: "A service cannot have more than 5 items.",
        });
        return;
      }

      const updatedItems = parsedItems.map((item: any) => ({
        id: item.id ?? undefined,
        title: item.title,
        description: item.description,
        image: typeof item.image === "string" ? item.image : null,
      }));

      const updatedService = await ServiceDao.updateService(Number(id), heading, updatedItems);

      res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: updatedService,
      });
    } catch (error) {
      console.log("Update Service Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  deleteService: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existing = await ServiceDao.getServiceById(Number(id));
      if (!existing) {
        res.status(404).json({ success: false, message: "Service not found" });
        return;
      }

      // delete every item image from MinIO
      for (const item of existing.items) {
        if (item.image) {
          await deleteFileFromMinIO(item.image);
        }
      }

      await ServiceDao.deleteService(Number(id));

      res.status(200).json({
        success: true,
        message: "Service deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
};

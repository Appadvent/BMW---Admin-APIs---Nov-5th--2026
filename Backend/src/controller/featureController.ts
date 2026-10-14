import { Request, Response } from "express";
import { RESPONSE_MESSAGES } from "../constants/response";
import { FeatureDao } from "../dao/feature.dao";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const FeatureController = {
  // Create Feature
  createFeature: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, productId, image } = req.body;

      const product = await FeatureDao.findProductById(Number(productId));
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found." });
        return;
      }

      const existingCount = await FeatureDao.getFeatureCountByProduct(Number(productId));
      if (existingCount >= 10) {
        res.status(400).json({
          success: false,
          message: "A product can have a maximum of 10 features.",
        });
        return;
      }

      const feature = await FeatureDao.createFeature({
        title,
        description,
        image: typeof image === "string" ? image : undefined,
        productId: Number(productId),
      });

      res.status(201).json({
        success: true,
        message: "Feature created successfully.",
        data: feature,
      });
    } catch (error) {
      console.error("Create Feature Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // Get All Features
  getAllFeatures: async (req: Request, res: Response): Promise<void> => {
    try {
      const features = await FeatureDao.getAllFeatures();
      res.status(200).json({ success: true, data: features });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // Get Feature by ID
  getFeatureById: async (req: Request, res: Response): Promise<void> => {
    try {
      const feature = await FeatureDao.getFeatureById(Number(req.params.id));
      if (!feature) {
        res.status(404).json({ success: false, message: "Feature not found" });
        return;
      }
      res.status(200).json({ success: true, data: feature });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // Get Features by Product
  getFeaturesByProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const features = await FeatureDao.getFeaturesByProduct(Number(req.params.productId));
      res.status(200).json({ success: true, data: features });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateFeature: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, image, productId } = req.body;

      // 1. Find existing feature
      const existingFeature = await FeatureDao.getFeatureById(Number(id));
      if (!existingFeature) {
        res.status(404).json({
          success: false,
          message: "Feature not found",
        });
        return;
      }

      // If new image URL passed and differs from existing, delete old one
      if (image !== undefined && existingFeature.image && existingFeature.image !== image) {
        await deleteFileFromMinIO(existingFeature.image);
      }

      // 2. Update DB
      const updatedFeature = await FeatureDao.updateFeature(Number(id), {
        title,
        description,
        image: image !== undefined ? (typeof image === "string" ? image : undefined) : existingFeature.image,
        productId: productId ? Number(productId) : undefined,
      });

      res.status(200).json({
        success: true,
        message: "Feature updated successfully",
        data: updatedFeature,
      });
    } catch (error) {
      console.error("Update Feature Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  deleteFeature: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      // 1. Get feature first (to get image URL)
      const feature = await FeatureDao.getFeatureById(id);

      if (!feature) {
        res.status(404).json({
          success: false,
          message: "Feature not found",
        });
        return;
      }

      // 2. Delete image from MinIO if exists
      if (feature.image) {
        await deleteFileFromMinIO(feature.image);
      }

      // 3. Delete feature from DB
      await FeatureDao.deleteFeature(id);

      res.status(200).json({
        success: true,
        message: "Feature deleted successfully",
      });
    } catch (error) {
      console.error("Delete Feature Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};

import { Request, Response } from "express";
import { SubcategoryDao } from "../dao/subcategory.dao";
import { CategoryDao } from "../dao/category.dao";
import { RESPONSE_MESSAGES } from "../constants/response";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const SubcategoryController = {
  // CREATE SUBCATEGORY
  createSubcategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, categoryId, slug, description, image, status } = req.body;

      // Validate parent category exists
      const categoryExists = await CategoryDao.getCategoryById(Number(categoryId));
      if (!categoryExists) {
        res.status(400).json({
          success: false,
          message: "Parent category not found.",
        });
        return;
      }

      // Check duplicate in same category
      const duplicate = await SubcategoryDao.findByNameAndCategory(Number(categoryId), name.trim());
      if (duplicate) {
        res.status(400).json({
          success: false,
          message: "A subcategory with this name already exists in this category.",
        });
        return;
      }

      const subcategory = await SubcategoryDao.createSubcategory({
        name: name.trim(),
        categoryId: Number(categoryId),
        slug: slug ? slug.trim() : undefined,
        description: typeof description === "string" ? description.trim() : undefined,
        image: typeof image === "string" ? image : undefined,
        status: status || "ACTIVE",
      });

      res.status(201).json({
        success: true,
        message: "Subcategory created successfully.",
        data: subcategory,
      });
    } catch (error: any) {
      console.error("Create Subcategory Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // GET ALL SUBCATEGORIES
  getAllSubcategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
      const status = req.query.status as string | undefined;

      const subcategories = await SubcategoryDao.getAllSubcategories({
        categoryId: !isNaN(Number(categoryId)) ? categoryId : undefined,
        status,
      });

      res.status(200).json({
        success: true,
        data: subcategories,
      });
    } catch (error: any) {
      console.error("Get All Subcategories Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // GET BY ID
  getSubcategoryById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const subcategory = await SubcategoryDao.getSubcategoryById(Number(id));

      if (!subcategory) {
        res.status(404).json({
          success: false,
          message: "Subcategory not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: subcategory,
      });
    } catch (error: any) {
      console.error("Get Subcategory By ID Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // UPDATE
  updateSubcategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, categoryId, slug, description, image, status } = req.body;

      const existing = await SubcategoryDao.getSubcategoryById(Number(id));
      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Subcategory not found.",
        });
        return;
      }

      const targetCategoryId = categoryId ? Number(categoryId) : existing.categoryId;

      // Validate target category if changed
      if (categoryId && Number(categoryId) !== existing.categoryId) {
        const cat = await CategoryDao.getCategoryById(Number(categoryId));
        if (!cat) {
          res.status(400).json({
            success: false,
            message: "Target parent category not found.",
          });
          return;
        }
      }

      // Check name uniqueness in target category
      if (name && (name.trim() !== existing.name || targetCategoryId !== existing.categoryId)) {
        const duplicate = await SubcategoryDao.findByNameAndCategory(targetCategoryId, name.trim());
        if (duplicate && duplicate.id !== Number(id)) {
          res.status(400).json({
            success: false,
            message: "A subcategory with this name already exists in this category.",
          });
          return;
        }
      }

      // If new image provided and differs from existing, delete old image from MinIO
      if (image !== undefined && existing.image && existing.image !== image) {
        await deleteFileFromMinIO(existing.image);
      }

      const updated = await SubcategoryDao.updateSubcategory(Number(id), {
        name: name !== undefined ? name.trim() : existing.name,
        categoryId: targetCategoryId,
        slug: slug !== undefined ? (slug ? slug.trim() : null) : existing.slug,
        description: description !== undefined ? (description ? description.trim() : null) : existing.description,
        image: image !== undefined ? (typeof image === "string" ? image : null) : existing.image,
        status: status !== undefined ? status : existing.status,
      });

      res.status(200).json({
        success: true,
        message: "Subcategory updated successfully.",
        data: updated,
      });
    } catch (error: any) {
      console.error("Update Subcategory Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // DELETE
  deleteSubcategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existing = await SubcategoryDao.getSubcategoryById(Number(id));
      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Subcategory not found.",
        });
        return;
      }

      if (existing.image) {
        await deleteFileFromMinIO(existing.image);
      }

      await SubcategoryDao.deleteSubcategory(Number(id));

      res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully.",
      });
    } catch (error: any) {
      console.error("Delete Subcategory Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};

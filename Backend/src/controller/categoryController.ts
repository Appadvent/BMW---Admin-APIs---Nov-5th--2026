import { Request, Response } from "express";
import { CategoryDao } from "../dao/category.dao";
import { RESPONSE_MESSAGES } from "../constants/response";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const CategoryController = {
  // CREATE CATEGORY
  createCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, image } = req.body;

      // Check for duplicate
      const existingCategory = await CategoryDao.findCategoryByName(name);
      if (existingCategory) {
        res.status(400).json({
          success: false,
          message: "A category with this name already exists.",
        });
        return;
      }

      const category = await CategoryDao.createCategory({
        name,
        description: typeof description === "string" ? description : undefined,
        image: typeof image === "string" ? image : undefined,
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: category,
      });
    } catch (error: any) {
      console.error("Create Category Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // READ ALL
  getAllCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await CategoryDao.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      console.error("Get All Categories Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // READ BY ID
  getCategoryById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await CategoryDao.getCategoryById(Number(id));

      if (!category) {
        res.status(404).json({
          success: false,
          message: "Category not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      console.error("Get Category By ID Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // UPDATE
  updateCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, image } = req.body;

      const existingCategory = await CategoryDao.getCategoryById(Number(id));
      if (!existingCategory) {
        res.status(404).json({
          success: false,
          message: "Category not found.",
        });
        return;
      }

      // If category name is changed, check for duplicate
      if (name && name !== existingCategory.name) {
        const duplicateCategory = await CategoryDao.findCategoryByName(name);
        if (duplicateCategory && duplicateCategory.id !== Number(id)) {
          res.status(400).json({
            success: false,
            message: "A category with this name already exists.",
          });
          return;
        }
      }

      // If a new image URL is passed and differs from existing, delete old image from MinIO
      if (image !== undefined && existingCategory.image && existingCategory.image !== image) {
        await deleteFileFromMinIO(existingCategory.image);
      }

      const updatedCategory = await CategoryDao.updateCategory(Number(id), {
        name,
        description: description !== undefined ? (typeof description === "string" ? description : undefined) : existingCategory.description,
        image: image !== undefined ? (typeof image === "string" ? image : undefined) : existingCategory.image,
      });

      res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        data: updatedCategory,
      });
    } catch (error: any) {
      console.error("Update Category Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // DELETE
  deleteCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existingCategory = await CategoryDao.getCategoryById(Number(id));
      if (!existingCategory) {
        res.status(404).json({
          success: false,
          message: "Category not found.",
        });
        return;
      }

      // Delete image from MinIO if exists
      if (existingCategory.image) {
        await deleteFileFromMinIO(existingCategory.image);
      }

      const deletedCategory = await CategoryDao.deleteCategory(Number(id));

      res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
        data: deletedCategory,
      });
    } catch (error: any) {
      console.error("Delete Category Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },
};

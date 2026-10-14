import { Request, Response } from "express";
import { ProductDao } from "../dao/product.dao";
import { CategoryDao } from "../dao/category.dao";
import { SubcategoryDao } from "../dao/subcategory.dao";
import { RESPONSE_MESSAGES } from "../constants/response";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const ProductController = {
  createProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        title,
        description,
        image,
        brochure,
        categoryId,
        subcategoryId,
        tag,
        oemNumber,
        make,
        model,
        yearRange,
        position,
        condition,
        specifications,
      } = req.body;

      let resolvedCategoryId =
        categoryId !== undefined && categoryId !== null && categoryId !== ""
          ? Number(categoryId)
          : null;
      let resolvedSubcategoryId =
        subcategoryId !== undefined && subcategoryId !== null && subcategoryId !== ""
          ? Number(subcategoryId)
          : null;

      // Validate subcategory if provided
      if (resolvedSubcategoryId) {
        const subcategory = await SubcategoryDao.getSubcategoryById(resolvedSubcategoryId);
        if (!subcategory) {
          res.status(400).json({
            success: false,
            message: "Subcategory not found.",
          });
          return;
        }

        // If categoryId wasn't passed directly, infer from subcategory
        if (!resolvedCategoryId) {
          resolvedCategoryId = subcategory.categoryId;
        }
      }

      // Validate categoryId if provided
      if (resolvedCategoryId) {
        const categoryExists = await CategoryDao.getCategoryById(resolvedCategoryId);
        if (!categoryExists) {
          res.status(400).json({
            success: false,
            message: "Category not found.",
          });
          return;
        }
      }

      const product = await ProductDao.createProduct({
        title,
        description,
        image: typeof image === "string" ? image : undefined,
        brochure: typeof brochure === "string" ? brochure : undefined,
        tag: typeof tag === "string" && tag.trim() ? tag.trim() : null,
        oemNumber: typeof oemNumber === "string" && oemNumber.trim() ? oemNumber.trim() : undefined,
        make: typeof make === "string" && make.trim() ? make.trim() : undefined,
        model: typeof model === "string" && model.trim() ? model.trim() : undefined,
        yearRange: typeof yearRange === "string" && yearRange.trim() ? yearRange.trim() : undefined,
        position: typeof position === "string" && position.trim() ? position.trim() : undefined,
        condition: typeof condition === "string" && condition.trim() ? condition.trim() : undefined,
        categoryId: resolvedCategoryId,
        subcategoryId: resolvedSubcategoryId,
        specifications: Array.isArray(specifications) ? specifications : undefined,
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: product,
      });
    } catch (error: any) {
      if (error.message === "Product title already exists") {
        res.status(400).json({
          success: false,
          message: "Product title already exists.",
        });
        return;
      }

      console.error("Create Product Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  getAllProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const tag = req.query.tag as string | undefined;
      const make = req.query.make as string | undefined;
      const model = req.query.model as string | undefined;
      const oemNumber = (req.query.oemNumber || req.query.oem) as string | undefined;

      const categoryParam = req.query.categoryId || req.query.category;
      const categoryId =
        categoryParam !== undefined && categoryParam !== "" && !isNaN(Number(categoryParam))
          ? Number(categoryParam)
          : undefined;

      const subcategoryParam = req.query.subcategoryId || req.query.subcategory;
      const subcategoryId =
        subcategoryParam !== undefined && subcategoryParam !== "" && !isNaN(Number(subcategoryParam))
          ? Number(subcategoryParam)
          : undefined;

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 100;

      const { products, pagination } = await ProductDao.getAllProducts({
        page,
        limit,
        search,
        categoryId,
        subcategoryId,
        tag,
        make,
        model,
        oemNumber,
      });

      res.status(200).json({
        success: true,
        data: products,
        pagination,
      });
    } catch (error: any) {
      console.error("Get All Products Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  getProductById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await ProductDao.getProductById(Number(id));

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      console.error("Get Product By ID Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  updateProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        image,
        brochure,
        categoryId,
        subcategoryId,
        tag,
        oemNumber,
        make,
        model,
        yearRange,
        position,
        condition,
        specifications,
      } = req.body;

      const existingProduct = await ProductDao.getProductById(Number(id));

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      let resolvedCategoryId =
        categoryId !== undefined
          ? categoryId !== null && categoryId !== ""
            ? Number(categoryId)
            : null
          : existingProduct.categoryId;

      let resolvedSubcategoryId =
        subcategoryId !== undefined
          ? subcategoryId !== null && subcategoryId !== ""
            ? Number(subcategoryId)
            : null
          : existingProduct.subcategoryId;

      // Validate subcategoryId if provided and not null
      if (resolvedSubcategoryId) {
        const subcategory = await SubcategoryDao.getSubcategoryById(resolvedSubcategoryId);
        if (!subcategory) {
          res.status(400).json({
            success: false,
            message: "Subcategory not found.",
          });
          return;
        }

        if (!resolvedCategoryId) {
          resolvedCategoryId = subcategory.categoryId;
        }
      }

      // Validate categoryId if provided and not null
      if (resolvedCategoryId) {
        const categoryExists = await CategoryDao.getCategoryById(resolvedCategoryId);
        if (!categoryExists) {
          res.status(400).json({
            success: false,
            message: "Category not found.",
          });
          return;
        }
      }

      // If a new image URL is passed and differs from existing, delete old image from MinIO
      if (image !== undefined && existingProduct.image && existingProduct.image !== image) {
        await deleteFileFromMinIO(existingProduct.image);
      }
      
      if (brochure !== undefined && existingProduct.brochure && existingProduct.brochure !== brochure) {
        await deleteFileFromMinIO(existingProduct.brochure);
      }

      const updatedProduct = await ProductDao.updateProduct(Number(id), {
        title,
        description,
        image: image !== undefined ? (typeof image === "string" ? image : undefined) : existingProduct.image,
        brochure: brochure !== undefined ? (typeof brochure === "string" ? brochure : undefined) : existingProduct.brochure,
        tag: tag !== undefined ? (tag ? String(tag).trim() : null) : (existingProduct as any).tag,
        oemNumber: oemNumber !== undefined ? (oemNumber ? String(oemNumber).trim() : null) : (existingProduct as any).oemNumber,
        make: make !== undefined ? (make ? String(make).trim() : null) : (existingProduct as any).make,
        model: model !== undefined ? (model ? String(model).trim() : null) : (existingProduct as any).model,
        yearRange: yearRange !== undefined ? (yearRange ? String(yearRange).trim() : null) : (existingProduct as any).yearRange,
        position: position !== undefined ? (position ? String(position).trim() : null) : (existingProduct as any).position,
        condition: condition !== undefined ? (condition ? String(condition).trim() : null) : (existingProduct as any).condition,
        categoryId: resolvedCategoryId,
        subcategoryId: resolvedSubcategoryId,
        specifications: Array.isArray(specifications) ? specifications : undefined,
      });

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error: any) {
      console.error("Update Product Error:", error);
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  },

  deleteProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // 1. Find product first (to get image URL)
      const product = await ProductDao.getProductById(Number(id));
      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      // 2. Delete product image and brochure from MinIO
      if (product.image) {
        await deleteFileFromMinIO(product.image);
      }
      if (product.brochure) {
        await deleteFileFromMinIO(product.brochure);
      }

      // 3. Delete all associated feature images from MinIO
      if (product.features && Array.isArray(product.features)) {
        for (const feat of product.features) {
          if (feat.image) {
            await deleteFileFromMinIO(feat.image);
          }
        }
      }

      // 4. Delete product from DB
      const deletedProduct = await ProductDao.deleteProduct(Number(id));

      if (!deletedProduct) {
        res.status(400).json({
          success: false,
          message: "Please delete associated features before deleting the product",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      });
    } catch (error: any) {
      console.error("Delete Product Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },
};

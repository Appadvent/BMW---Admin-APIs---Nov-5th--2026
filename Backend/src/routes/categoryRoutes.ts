import express from "express";
import { CategoryController } from "../controller/categoryController";
import { validateCreateCategory, validateUpdateCategory } from "../validations/categoryValidation";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const router = express.Router();

// CREATE CATEGORY
router.post(
  "/create",
  adminAuthMiddleware,
  validateCreateCategory,
  CategoryController.createCategory
  /* 
    #swagger.tags = ['Category']
    #swagger.summary = 'Create a new category'
    #swagger.description = 'Create a new product/blog category with name and optional image URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Category creation data',
        required: true,
        schema: { $ref: '#/definitions/createCategorySchema' }
    }
    #swagger.responses[201] = {
        description: 'Category created successfully',
        schema: {
            success: true,
            message: "Category created successfully.",
            data: {
                id: 1,
                name: "Technology",
                image: "https://minioapi.appadvent.in/i-mag/categories/tech.jpg",
                createdAt: "2025-11-10T10:00:00.000Z"
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Validation failed or duplicate category name',
        schema: {
            success: false,
            message: "Category name is required"
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET ALL CATEGORIES (Public Storefront API)
router.get(
  "/",
  CategoryController.getAllCategories
  /* 
    #swagger.tags = ['Category']
    #swagger.summary = 'Get all categories'
    #swagger.description = 'Fetch list of all categories with product and blog counts.'
    #swagger.responses[200] = {
        description: 'List of all categories fetched successfully',
        schema: {
            success: true,
            data: [
                {
                    id: 1,
                    name: "Technology",
                    image: "https://minioapi.appadvent.in/i-mag/categories/tech.jpg",
                    createdAt: "2025-11-10T10:00:00.000Z",
                    _count: {
                        products: 5,
                        blogs: 2
                    }
                }
            ]
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET CATEGORY BY ID (Public Storefront API)
router.get(
  "/:id",
  CategoryController.getCategoryById
  /* 
    #swagger.tags = ['Category']
    #swagger.summary = 'Get single category by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Category ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Category fetched successfully',
        schema: {
            success: true,
            data: {
                id: 1,
                name: "Technology",
                image: "https://minioapi.appadvent.in/i-mag/categories/tech.jpg",
                createdAt: "2025-11-10T10:00:00.000Z",
                products: [],
                blogs: []
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Category not found',
        schema: {
            success: false,
            message: "Category not found."
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// UPDATE CATEGORY (PATCH)
router.patch(
  "/:id",
  adminAuthMiddleware,
  validateUpdateCategory,
  CategoryController.updateCategory
  /* 
    #swagger.tags = ['Category']
    #swagger.summary = 'Update an existing category'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Category ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Category update data',
        required: true,
        schema: { $ref: '#/definitions/updateCategorySchema' }
    }
    #swagger.responses[200] = {
        description: 'Category updated successfully',
        schema: {
            success: true,
            message: "Category updated successfully.",
            data: {
                id: 1,
                name: "Updated Technology",
                image: "https://minioapi.appadvent.in/i-mag/categories/tech.jpg",
                createdAt: "2025-11-10T10:00:00.000Z"
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Validation error'
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[404] = {
        description: 'Category not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// UPDATE CATEGORY (PUT)
router.put(
  "/:id",
  adminAuthMiddleware,
  validateUpdateCategory,
  CategoryController.updateCategory
);

// DELETE CATEGORY
router.delete(
  "/:id",
  adminAuthMiddleware,
  CategoryController.deleteCategory
  /* 
    #swagger.tags = ['Category']
    #swagger.summary = 'Delete a category by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Category ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Category deleted successfully',
        schema: {
            success: true,
            message: "Category deleted successfully."
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[404] = {
        description: 'Category not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

export default router;

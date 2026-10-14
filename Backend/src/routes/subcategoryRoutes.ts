import express from "express";
import { SubcategoryController } from "../controller/subcategoryController";
import {
  validateCreateSubcategory,
  validateUpdateSubcategory,
} from "../validations/subcategoryValidation";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const router = express.Router();

// CREATE SUBCATEGORY (Protected)
router.post(
  "/create",
  adminAuthMiddleware,
  validateCreateSubcategory,
  SubcategoryController.createSubcategory
  /* 
    #swagger.tags = ['Subcategory']
    #swagger.summary = 'Create a new subcategory'
    #swagger.description = 'Create a new subcategory under an existing parent category. Requires Bearer token.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Subcategory creation data',
        required: true,
        schema: { $ref: '#/definitions/createSubcategorySchema' }
    }
    #swagger.responses[201] = {
        description: 'Subcategory created successfully',
        schema: {
            success: true,
            message: "Subcategory created successfully.",
            data: {
                id: 1,
                name: "Lever Handles",
                slug: "lever-handles",
                description: "Precision-engineered architectural lever handles",
                image: "https://minioapi.appadvent.in/i-mag/subcategories/lever-handles.jpg",
                status: true,
                categoryId: 1,
                createdAt: "2026-10-13T10:00:00.000Z",
                updatedAt: "2026-10-13T10:00:00.000Z",
                category: {
                    id: 1,
                    name: "Door Hardware"
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Validation failed or category not found',
        schema: {
            success: false,
            message: "Subcategory with this name already exists in this category"
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized - Bearer token required'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// CREATE SUBCATEGORY ALIAS (POST /)
router.post(
  "/",
  adminAuthMiddleware,
  validateCreateSubcategory,
  SubcategoryController.createSubcategory
);

// GET ALL SUBCATEGORIES (Public Storefront API)
router.get(
  "/",
  SubcategoryController.getAllSubcategories
  /* 
    #swagger.tags = ['Subcategory']
    #swagger.summary = 'Get all subcategories (Public)'
    #swagger.description = 'Fetch public list of subcategories with parent category details and product counts. Can be filtered by categoryId and status.'
    #swagger.parameters['categoryId'] = {
        in: 'query',
        description: 'Filter subcategories by parent category ID',
        required: false,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['status'] = {
        in: 'query',
        description: 'Filter by active status (ACTIVE, INACTIVE, true, false)',
        required: false,
        type: 'string',
        example: 'ACTIVE'
    }
    #swagger.responses[200] = {
        description: 'List of subcategories fetched successfully',
        schema: {
            success: true,
            data: [
                {
                    id: 1,
                    name: "Lever Handles",
                    slug: "lever-handles",
                    description: "Precision-engineered architectural lever handles",
                    image: "https://minioapi.appadvent.in/i-mag/subcategories/lever-handles.jpg",
                    status: true,
                    categoryId: 1,
                    createdAt: "2026-10-13T10:00:00.000Z",
                    category: {
                        id: 1,
                        name: "Door Hardware",
                        slug: "door-hardware"
                    },
                    _count: {
                        products: 12
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

// GET ALL SUBCATEGORIES ALIAS (GET /list - Public Storefront API)
router.get(
  "/list",
  SubcategoryController.getAllSubcategories
  /* 
    #swagger.tags = ['Subcategory']
    #swagger.summary = 'Get all subcategories list alias (Public)'
    #swagger.description = 'Alias endpoint to fetch list of subcategories.'
    #swagger.parameters['categoryId'] = {
        in: 'query',
        description: 'Filter subcategories by parent category ID',
        required: false,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'List of subcategories fetched successfully'
    }
  */
);

// GET SUBCATEGORY BY ID (Public Storefront API)
router.get(
  "/:id",
  SubcategoryController.getSubcategoryById
  /* 
    #swagger.tags = ['Subcategory']
    #swagger.summary = 'Get single subcategory by ID (Public)'
    #swagger.description = 'Fetch a single subcategory by its primary ID, including parent category and product count.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Subcategory ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Subcategory fetched successfully',
        schema: {
            success: true,
            data: {
                id: 1,
                name: "Lever Handles",
                slug: "lever-handles",
                description: "Precision-engineered architectural lever handles",
                image: "https://minioapi.appadvent.in/i-mag/subcategories/lever-handles.jpg",
                status: true,
                categoryId: 1,
                category: {
                    id: 1,
                    name: "Door Hardware"
                },
                _count: {
                    products: 12
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Subcategory not found',
        schema: {
            success: false,
            message: "Subcategory not found."
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// UPDATE SUBCATEGORY (Protected)
router.put(
  "/:id",
  adminAuthMiddleware,
  validateUpdateSubcategory,
  SubcategoryController.updateSubcategory
  /* 
    #swagger.tags = ['Subcategory']
    #swagger.summary = 'Update subcategory'
    #swagger.description = 'Update an existing subcategory by ID. Requires Bearer token.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Subcategory ID to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Subcategory update data',
        required: true,
        schema: { $ref: '#/definitions/updateSubcategorySchema' }
    }
    #swagger.responses[200] = {
        description: 'Subcategory updated successfully',
        schema: {
            success: true,
            message: "Subcategory updated successfully.",
            data: {
                id: 1,
                name: "Updated Pull Handles",
                categoryId: 1,
                status: true
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Validation failed or duplicate name'
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[404] = {
        description: 'Subcategory not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// UPDATE SUBCATEGORY PATCH ALIAS
router.patch(
  "/:id",
  adminAuthMiddleware,
  validateUpdateSubcategory,
  SubcategoryController.updateSubcategory
);

// DELETE SUBCATEGORY (Protected)
router.delete(
  "/:id",
  adminAuthMiddleware,
  SubcategoryController.deleteSubcategory
  /* 
    #swagger.tags = ['Subcategory']
    #swagger.summary = 'Delete subcategory'
    #swagger.description = 'Delete a subcategory by ID. Cleans up associated MinIO images and disassociates linked products. Requires Bearer token.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Subcategory ID to delete',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Subcategory deleted successfully',
        schema: {
            success: true,
            message: "Subcategory deleted successfully."
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[404] = {
        description: 'Subcategory not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

export default router;

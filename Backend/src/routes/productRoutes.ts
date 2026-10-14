import express from "express";
import { ProductController } from "../controller/index";
import { validateCreateProduct, validateUpdateProduct } from "../validations/productValidation";

const router = express.Router();

// CREATE PRODUCT
router.post(
  "/create",
  validateCreateProduct,
  ProductController.createProduct
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Create a new product'
    #swagger.description = 'Create a new product with title, description, and an optional image URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product data',
        required: true,
        schema: {
            title: 'Premium Package',
            description: 'This is a premium product description.',
            image: 'http://localhost:9000/streamline/products/example.jpg'
        }
    }
    #swagger.responses[201] = {
        description: 'Product created successfully',
        schema: {
            success: true,
            message: "Product created successfully.",
            data: {
                id: 1,
                title: "Premium Package",
                description: "This is a premium product description.",
                image: "http://localhost:9000/streamline/products/example.jpg",
                createdAt: "2025-11-10T10:00:00.000Z"
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Validation failed or duplicate title',
        schema: {
            success: false,
            message: "Title is required"
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET ALL PRODUCTS
router.get(
  "/",
  ProductController.getAllProducts
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Get all products with pagination'
    #swagger.description = 'Fetch products with server-side pagination and search filter.'
    #swagger.parameters['page'] = {
        in: 'query',
        type: 'integer',
        required: false,
        description: 'Page number (default: 1)',
        example: 1
    }
    #swagger.parameters['limit'] = {
        in: 'query',
        type: 'integer',
        required: false,
        description: 'Number of items per page (default: 10)',
        example: 10
    }
    #swagger.parameters['search'] = {
        in: 'query',
        type: 'string',
        required: false,
        description: 'Search products by title or description'
    }
    #swagger.parameters['categoryId'] = {
        in: 'query',
        type: 'integer',
        required: false,
        description: 'Filter products by parent Category ID'
    }
    #swagger.parameters['subcategoryId'] = {
        in: 'query',
        type: 'integer',
        required: false,
        description: 'Filter products by Subcategory ID'
    }
    #swagger.responses[200] = {
        description: 'List of products fetched successfully with pagination metadata',
        schema: {
            success: true,
            data: [
                {
                    id: 1,
                    title: "Industrial Conveyor Belt",
                    description: "High performance conveyor system.",
                    image: "https://minioapi.appadvent.in/i-mag/products/conveyor.jpg",
                    createdAt: "2025-11-10T10:00:00.000Z"
                }
            ],
            pagination: {
                total: 50,
                page: 1,
                limit: 10,
                totalPages: 5
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET PRODUCT BY ID
router.get(
  "/:id",
  ProductController.getProductById
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Get a single product by its ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Product ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Product fetched successfully',
        schema: {
            success: true,
            data: {
                id: 1,
                title: "Premium Package",
                description: "This is a premium product description.",
                image: "http://localhost:9000/streamline/products/image1.jpg",
                createdAt: "2025-11-10T10:00:00.000Z"
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: {
            success: false,
            message: "Product not found."
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// UPDATE PRODUCT
router.patch(
  "/:id",
  validateUpdateProduct,
  ProductController.updateProduct
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Update a product by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Product ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product update data',
        required: true,
        schema: {
            title: 'Updated Package Name',
            description: 'Updated description content.',
            image: 'http://localhost:9000/streamline/products/updated.jpg'
        }
    }
    #swagger.responses[200] = {
        description: 'Product updated successfully',
        schema: {
            success: true,
            message: "Product updated successfully",
            data: {
                id: 1,
                title: "Updated Package Name",
                description: "Updated description content.",
                image: "http://localhost:9000/streamline/products/updated.jpg"
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: {
            success: false,
            message: "Product not found"
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// DELETE PRODUCT
router.delete(
  "/:id",
  ProductController.deleteProduct
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Delete a product by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Product ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Product deleted successfully',
        schema: {
            success: true,
            message: "Product deleted successfully",
            data: {
                id: 1,
                title: "Premium Package",
                description: "This is a premium product description.",
                image: "http://localhost:9000/streamline/products/image1.jpg"
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: {
            success: false,
            message: "Product not found"
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

export default router;

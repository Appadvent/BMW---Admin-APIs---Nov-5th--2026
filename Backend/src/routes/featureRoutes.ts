import express from "express";
import { FeatureController } from "../controller/featureController";
import { validateCreateFeature, validateUpdateFeature } from "../validations/featureValidation";

const router = express.Router();

// CREATE FEATURE
router.post(
  "/",
  validateCreateFeature,
  FeatureController.createFeature
  /* 
    #swagger.tags = ['Feature']
    #swagger.summary = 'Create a new feature'
    #swagger.description = 'Create a feature linked to a specific product with an optional image URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Feature data',
        required: true,
        schema: {
            title: 'High Precision',
            description: 'Provides precision tolerance up to 0.01mm.',
            productId: 1,
            image: 'http://localhost:9000/streamline/features/feature.jpg'
        }
    }
    #swagger.responses[201] = {
        description: 'Feature created successfully',
        schema: {
            success: true,
            message: 'Feature created successfully.',
            data: {
                id: 1,
                title: 'High Precision',
                description: 'Provides precision tolerance up to 0.01mm.',
                image: 'http://localhost:9000/streamline/features/feature.jpg',
                productId: 1,
                createdAt: '2025-11-10T10:00:00.000Z'
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: { success: false, message: 'Product not found.' }
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// GET ALL FEATURES
router.get(
  "/",
  FeatureController.getAllFeatures
  /* 
    #swagger.tags = ['Feature']
    #swagger.summary = 'Get all features'
    #swagger.description = 'Fetch all features across all products.'
    #swagger.responses[200] = {
        description: 'Features fetched successfully'
    }
  */
);

// GET FEATURES BY PRODUCT
router.get(
  "/product/:productId",
  FeatureController.getFeaturesByProduct
  /* 
    #swagger.tags = ['Feature']
    #swagger.summary = 'Get features by product ID'
    #swagger.parameters['productId'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Features for product fetched successfully'
    }
  */
);

// UPDATE FEATURE
router.patch(
  "/:id",
  validateUpdateFeature,
  FeatureController.updateFeature
  /* 
    #swagger.tags = ['Feature']
    #swagger.summary = 'Update feature by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Feature update payload',
        required: true,
        schema: {
            title: 'High Precision',
            description: 'Provides precision tolerance up to 0.01mm.',
            image: 'http://localhost:9000/streamline/features/feature.jpg',
            productId: 1
        }
    }
    #swagger.responses[200] = {
        description: 'Feature updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Feature not found'
    }
  */
);

// DELETE FEATURE
router.delete(
  "/:id",
  FeatureController.deleteFeature
  /* 
    #swagger.tags = ['Feature']
    #swagger.summary = 'Delete feature by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Feature ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Feature deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Feature not found'
    }
  */
);

export default router;

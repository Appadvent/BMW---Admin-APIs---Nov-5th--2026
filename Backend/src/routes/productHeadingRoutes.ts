import { Router } from "express";
import { ProductHeadingController } from "../controller/productHeadingController";
import { validateCreateProductHeading, validateUpdateProductHeading } from "../validations/productHeadingValidation";

const router = Router();

// GET ALL
router.get(
  "/",
  ProductHeadingController.getAll
  /* 
    #swagger.tags = ['ProductHeading']
    #swagger.summary = 'Get all product headings'
    #swagger.responses[200] = {
        description: 'Product headings fetched successfully'
    }
  */
);

// GET BY ID
router.get(
  "/:id",
  ProductHeadingController.getById
  /* 
    #swagger.tags = ['ProductHeading']
    #swagger.summary = 'Get product heading by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Product heading fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Product heading not found'
    }
  */
);

// CREATE
router.post(
  "/",
  validateCreateProductHeading,
  ProductHeadingController.create
  /* 
    #swagger.tags = ['ProductHeading']
    #swagger.summary = 'Create product heading'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/createProductHeadingSchema' }
    }
    #swagger.responses[201] = {
        description: 'Product heading created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// UPDATE
router.put(
  "/:id",
  validateUpdateProductHeading,
  ProductHeadingController.update
  /* 
    #swagger.tags = ['ProductHeading']
    #swagger.summary = 'Update product heading by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/updateProductHeadingSchema' }
    }
    #swagger.responses[200] = {
        description: 'Product heading updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Product heading not found'
    }
  */
);

// DELETE
router.delete(
  "/:id",
  ProductHeadingController.delete
  /* 
    #swagger.tags = ['ProductHeading']
    #swagger.summary = 'Delete product heading by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Product heading deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Product heading not found'
    }
  */
);

export default router;

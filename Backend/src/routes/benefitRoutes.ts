import { Router } from "express";
import { BenefitController } from "../controller/benefitController";
import { validateCreateBenefit, validateUpdateBenefit } from "../validations/benefitValidation";

const router = Router();

// GET ALL
router.get(
  "/",
  BenefitController.getAllBenefits
  /* 
    #swagger.tags = ['Benefit']
    #swagger.summary = 'Get all benefits'
    #swagger.description = 'Fetch all benefit sections with items.'
    #swagger.responses[200] = {
        description: 'List of benefits fetched successfully',
        schema: {
            success: true,
            data: [
                {
                    id: 1,
                    heading: 'Why Our Solutions Deliver Value',
                    description: 'Discover the core advantages.',
                    items: [
                        { id: 1, title: 'High Reliability', description: 'Built to withstand rigorous environments.' }
                    ]
                }
            ]
        }
    }
  */
);

// GET BY ID
router.get(
  "/:id",
  BenefitController.getBenefitById
  /* 
    #swagger.tags = ['Benefit']
    #swagger.summary = 'Get benefit by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Benefit section fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Benefit not found'
    }
  */
);

// CREATE
router.post(
  "/",
  validateCreateBenefit,
  BenefitController.createBenefit
  /* 
    #swagger.tags = ['Benefit']
    #swagger.summary = 'Create a new benefit section'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/createBenefitSchema' }
    }
    #swagger.responses[201] = {
        description: 'Benefit created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// UPDATE
router.put(
  "/:id",
  validateUpdateBenefit,
  BenefitController.updateBenefit
  /* 
    #swagger.tags = ['Benefit']
    #swagger.summary = 'Update a benefit section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/updateBenefitSchema' }
    }
    #swagger.responses[200] = {
        description: 'Benefit updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Benefit not found'
    }
  */
);

// DELETE
router.delete(
  "/:id",
  BenefitController.deleteBenefit
  /* 
    #swagger.tags = ['Benefit']
    #swagger.summary = 'Delete a benefit section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Benefit deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Benefit not found'
    }
  */
);

export default router;

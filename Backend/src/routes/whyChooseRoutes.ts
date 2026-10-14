import { Router } from "express";
import { WhyChooseController } from "../controller/whyChooseController";
import { validateCreateWhyChoose, validateUpdateWhyChoose } from "../validations/whyChooseValidation";

const router = Router();

// CREATE
router.post(
  "/",
  validateCreateWhyChoose,
  WhyChooseController.createWhyChoose
  /* 
    #swagger.tags = ['WhyChoose']
    #swagger.summary = 'Create Why Choose Us section'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/createWhyChooseSchema' }
    }
    #swagger.responses[201] = {
        description: 'Why Choose created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// GET ALL
router.get(
  "/",
  WhyChooseController.getAllWhyChoose
  /* 
    #swagger.tags = ['WhyChoose']
    #swagger.summary = 'Get all Why Choose sections'
    #swagger.responses[200] = {
        description: 'Why Choose sections fetched successfully'
    }
  */
);

// GET BY ID
router.get(
  "/:id",
  WhyChooseController.getWhyChooseById
  /* 
    #swagger.tags = ['WhyChoose']
    #swagger.summary = 'Get Why Choose section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Why Choose section fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Why Choose not found'
    }
  */
);

// UPDATE
router.put(
  "/:id",
  validateUpdateWhyChoose,
  WhyChooseController.updateWhyChoose
  /* 
    #swagger.tags = ['WhyChoose']
    #swagger.summary = 'Update Why Choose section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/updateWhyChooseSchema' }
    }
    #swagger.responses[200] = {
        description: 'Why Choose updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Why Choose not found'
    }
  */
);

// DELETE
router.delete(
  "/:id",
  WhyChooseController.deleteWhyChoose
  /* 
    #swagger.tags = ['WhyChoose']
    #swagger.summary = 'Delete Why Choose section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Why Choose deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Why Choose not found'
    }
  */
);

export default router;

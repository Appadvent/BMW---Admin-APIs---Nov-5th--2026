import { Router } from "express";
import { planController } from "../controller/planController";
import { validateCreatePlan, validateUpdatePlan } from "../validations/planValidation";

const router = Router();

// CREATE PLAN
router.post(
  "/",
  validateCreatePlan,
  planController.createPlan
  /* 
    #swagger.tags = ['Plan']
    #swagger.summary = 'Create a subscription plan'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/createPlanSchema' }
    }
    #swagger.responses[200] = {
        description: 'Plan created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed or plan already exists'
    }
  */
);

// GET ALL PLANS
router.get(
  "/",
  planController.getPlans
  /* 
    #swagger.tags = ['Plan']
    #swagger.summary = 'Get all plans'
    #swagger.responses[200] = {
        description: 'Plans fetched successfully'
    }
  */
);

// GET PLAN BY ID
router.get(
  "/:id",
  planController.getPlanById
  /* 
    #swagger.tags = ['Plan']
    #swagger.summary = 'Get plan by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Plan fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Plan not found'
    }
  */
);

// UPDATE PLAN
router.put(
  "/:id",
  validateUpdatePlan,
  planController.updatePlan
  /* 
    #swagger.tags = ['Plan']
    #swagger.summary = 'Update plan by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/updatePlanSchema' }
    }
    #swagger.responses[200] = {
        description: 'Plan updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Plan not found'
    }
  */
);

// DELETE PLAN
router.delete(
  "/:id",
  planController.deletePlan
  /* 
    #swagger.tags = ['Plan']
    #swagger.summary = 'Delete plan by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Plan deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Plan not found'
    }
  */
);

export default router;

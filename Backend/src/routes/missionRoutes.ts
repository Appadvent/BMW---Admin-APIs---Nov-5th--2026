import { Router } from "express";
import { MissionVisionController } from "../controller/missionController";
import { validateCreateMission, validateUpdateMission } from "../validations/missionValidation";

const router = Router();

// CREATE
router.post(
  "/",
  validateCreateMission,
  MissionVisionController.createMissionVision
  /* 
    #swagger.tags = ['MissionVision']
    #swagger.summary = 'Create Mission & Vision section'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/createMissionSchema' }
    }
    #swagger.responses[201] = {
        description: 'Mission & Vision created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// GET ALL
router.get(
  "/",
  MissionVisionController.getAllMissionVision
  /* 
    #swagger.tags = ['MissionVision']
    #swagger.summary = 'Get all Mission & Vision sections'
    #swagger.responses[200] = {
        description: 'List of Mission & Vision sections fetched successfully'
    }
  */
);

// GET BY ID
router.get(
  "/:id",
  MissionVisionController.getMissionVisionById
  /* 
    #swagger.tags = ['MissionVision']
    #swagger.summary = 'Get Mission & Vision section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Mission & Vision section fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Mission & Vision not found'
    }
  */
);

// UPDATE
router.put(
  "/:id",
  validateUpdateMission,
  MissionVisionController.updateMissionVision
  /* 
    #swagger.tags = ['MissionVision']
    #swagger.summary = 'Update Mission & Vision section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/updateMissionSchema' }
    }
    #swagger.responses[200] = {
        description: 'Mission & Vision updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Mission & Vision not found'
    }
  */
);

// DELETE
router.delete(
  "/:id",
  MissionVisionController.deleteMissionVision
  /* 
    #swagger.tags = ['MissionVision']
    #swagger.summary = 'Delete Mission & Vision section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Mission & Vision deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Mission & Vision not found'
    }
  */
);

export default router;

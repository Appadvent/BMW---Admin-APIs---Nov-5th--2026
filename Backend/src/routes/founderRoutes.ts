import { Router } from "express";
import { FounderController } from "../controller/founderController";
import { validateCreateFounder, validateUpdateFounder } from "../validations/founderValidation";

const router = Router();

// CREATE FOUNDER
router.post(
  "/",
  validateCreateFounder,
  FounderController.createFounder
  /* 
    #swagger.tags = ['Founders']
    #swagger.summary = 'Create a founder profile'
    #swagger.description = 'Create a new founder profile with name, title, description, and optional profile image URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Founder payload',
        required: true,
        schema: {
            name: 'Jane Doe',
            title: 'CEO & Co-Founder',
            description: 'Leading manufacturing innovation for over 15 years.',
            image: 'http://localhost:9000/streamline/founders/jane.jpg'
        }
    }
    #swagger.responses[201] = {
        description: 'Founder created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// GET ALL FOUNDERS
router.get(
  "/",
  FounderController.getAllFounders
  /* 
    #swagger.tags = ['Founders']
    #swagger.summary = 'Get all founders'
    #swagger.description = 'Fetch all founder profiles.'
    #swagger.responses[200] = {
        description: 'Founders fetched successfully'
    }
  */
);

// GET FOUNDER BY ID
router.get(
  "/:id",
  FounderController.getFounderById
  /* 
    #swagger.tags = ['Founders']
    #swagger.summary = 'Get founder by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Founder fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Founder not found'
    }
  */
);

// UPDATE FOUNDER
router.patch(
  "/:id",
  validateUpdateFounder,
  FounderController.updateFounder
  /* 
    #swagger.tags = ['Founders']
    #swagger.summary = 'Update founder by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Founder update payload',
        required: true,
        schema: {
            name: 'Jane Doe',
            title: 'CEO & Co-Founder',
            description: 'Leading manufacturing innovation for over 15 years.',
            image: 'http://localhost:9000/streamline/founders/jane.jpg'
        }
    }
    #swagger.responses[200] = {
        description: 'Founder updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Founder not found'
    }
  */
);

// DELETE FOUNDER
router.delete(
  "/:id",
  FounderController.deleteFounder
  /* 
    #swagger.tags = ['Founders']
    #swagger.summary = 'Delete founder by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Founder ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Founder deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Founder not found'
    }
  */
);

export default router;

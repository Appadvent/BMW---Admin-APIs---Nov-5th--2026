import express from "express";
import { ServiceController } from "../controller/serviceController";
import { validateCreateService, validateUpdateService } from "../validations/serviceValidation";

const router = express.Router();

// CREATE SERVICE
router.post(
  "/",
  validateCreateService,
  ServiceController.createService
  /* 
    #swagger.tags = ['Services']
    #swagger.summary = 'Create a service section'
    #swagger.description = 'Create an industrial service heading and up to 5 service items with optional image URLs.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Service payload',
        required: true,
        schema: {
            heading: 'Our Comprehensive Industrial Services',
            items: [
                { title: 'Custom CNC Milling', description: 'High precision 5-axis milling.', image: 'http://localhost:9000/streamline/services/cnc.jpg' }
            ]
        }
    }
    #swagger.responses[201] = {
        description: 'Service created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed or item limit exceeded'
    }
  */
);

// GET ALL SERVICES
router.get(
  "/",
  ServiceController.getAllServices
  /* 
    #swagger.tags = ['Services']
    #swagger.summary = 'Get all services'
    #swagger.description = 'Fetch all service headings and their items.'
    #swagger.responses[200] = {
        description: 'Services fetched successfully'
    }
  */
);

// GET SERVICE BY ID
router.get(
  "/:id",
  ServiceController.getServiceById
  /* 
    #swagger.tags = ['Services']
    #swagger.summary = 'Get service by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Service fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Service not found'
    }
  */
);

// UPDATE SERVICE
router.patch(
  "/:id",
  validateUpdateService,
  ServiceController.updateService
  /* 
    #swagger.tags = ['Services']
    #swagger.summary = 'Update service by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Service update payload',
        required: true,
        schema: {
            heading: 'Our Comprehensive Industrial Services',
            items: [
                { title: 'Custom CNC Milling', description: 'High precision 5-axis milling.', image: 'http://localhost:9000/streamline/services/cnc.jpg' }
            ]
        }
    }
    #swagger.responses[200] = {
        description: 'Service updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Service not found'
    }
  */
);

// DELETE SERVICE
router.delete(
  "/:id",
  ServiceController.deleteService
  /* 
    #swagger.tags = ['Services']
    #swagger.summary = 'Delete service by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Service deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Service not found'
    }
  */
);

export default router;

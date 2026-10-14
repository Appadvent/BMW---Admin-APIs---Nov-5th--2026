import { Router } from "express";
import { HomeController } from "../controller/homeController";
import { validateCreateHome, validateUpdateHome } from "../validations/homeValidation";

const router = Router();

// CREATE HOME
router.post(
  "/",
  validateCreateHome,
  HomeController.createHome
  /* 
    #swagger.tags = ['Home']
    #swagger.summary = 'Create home entry'
    #swagger.description = 'Create a home showcase entry with title, description, and up to 3 optional image URLs.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Home entry payload',
        required: true,
        schema: {
            title: 'Precision Manufacturing',
            description: 'State-of-the-art CNC machining.',
            image1: 'http://localhost:9000/streamline/home/image1.jpg',
            image2: 'http://localhost:9000/streamline/home/image2.jpg',
            image3: 'http://localhost:9000/streamline/home/image3.jpg'
        }
    }
    #swagger.responses[201] = {
        description: 'Home entry created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// GET HOMES
router.get(
  "/",
  HomeController.getHomes
  /* 
    #swagger.tags = ['Home']
    #swagger.summary = 'Get all home entries'
    #swagger.description = 'Fetch all home showcase entries.'
    #swagger.responses[200] = {
        description: 'Home entries fetched successfully'
    }
  */
);

// UPDATE HOME
router.patch(
  "/:id",
  validateUpdateHome,
  HomeController.updateHome
  /* 
    #swagger.tags = ['Home']
    #swagger.summary = 'Update home entry by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Home entry update payload',
        required: true,
        schema: {
            title: 'Precision Manufacturing',
            description: 'State-of-the-art CNC machining.',
            image1: 'http://localhost:9000/streamline/home/image1.jpg',
            image2: 'http://localhost:9000/streamline/home/image2.jpg',
            image3: 'http://localhost:9000/streamline/home/image3.jpg'
        }
    }
    #swagger.responses[200] = {
        description: 'Home entry updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Home entry not found'
    }
  */
);

// DELETE HOME
router.delete(
  "/:id",
  HomeController.deleteHome
  /* 
    #swagger.tags = ['Home']
    #swagger.summary = 'Delete home entry by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Home entry deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Home entry not found'
    }
  */
);

export default router;

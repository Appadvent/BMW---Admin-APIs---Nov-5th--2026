import { Router } from "express";
import { AboutController } from "../controller/aboutController";
import { validateCreateAbout, validateUpdateAbout } from "../validations/aboutValidation";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const router = Router();

// CREATE ABOUT
router.post(
  "/",
  adminAuthMiddleware,
  validateCreateAbout,
  AboutController.createAbout
  /* 
    #swagger.tags = ['About']
    #swagger.summary = 'Create About section'
    #swagger.description = 'Create a new dynamic About section with media, layout config, CTA, and items.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'About section payload',
        required: true,
        schema: { $ref: '#/definitions/createAboutSchema' }
    }
    #swagger.responses[201] = {
        description: 'About section created successfully',
        schema: {
            success: true,
            message: 'About section created successfully.',
            data: {
                id: 1,
                badge: 'About Us',
                title: 'Building Better Spaces Together',
                subtitle: 'Leading Engineering & Fabrication',
                description: 'Delivering top-tier fabrication solutions.',
                content: 'Committed to precision engineering and quality.',
                image: 'https://minioapi.appadvent.in/i-mag/about/main.jpg',
                layout: 'image-left',
                itemsLayout: 'grid',
                alignment: 'left',
                ctaEnabled: true,
                ctaText: 'Know More',
                ctaLink: '/contact',
                items: [],
                createdAt: '2025-11-10T10:00:00.000Z'
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET ALL ABOUT (Public Storefront API)
router.get(
  "/",
  AboutController.getAllAbout
  /* 
    #swagger.tags = ['About']
    #swagger.summary = 'Get all About sections'
    #swagger.description = 'Fetch all About sections stored in the database with nested dynamic items.'
    #swagger.responses[200] = {
        description: 'About sections fetched successfully',
        schema: {
            success: true,
            data: [
                {
                    id: 1,
                    badge: 'About Us',
                    title: 'Building Better Spaces Together',
                    subtitle: 'Our Core Philosophy',
                    description: 'Delivering top-tier fabrication solutions.',
                    content: 'Committed to precision engineering and quality.',
                    image: 'https://minioapi.appadvent.in/i-mag/about/main.jpg',
                    layout: 'image-left',
                    items: [],
                    createdAt: '2025-11-10T10:00:00.000Z'
                }
            ]
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET ABOUT BY ID (Public Storefront API)
router.get(
  "/:id",
  AboutController.getAboutById
  /* 
    #swagger.tags = ['About']
    #swagger.summary = 'Get About section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'About ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'About section fetched successfully',
        schema: {
            success: true,
            data: {
                id: 1,
                title: 'Crafting Excellence',
                subtitle: 'Our Core Philosophy',
                description: 'Delivering top-tier fabrication solutions.',
                content: 'Committed to precision engineering and quality.',
                image: 'https://minioapi.appadvent.in/i-mag/about/main.jpg',
                items: [],
                createdAt: '2025-11-10T10:00:00.000Z'
            }
        }
    }
    #swagger.responses[404] = {
        description: 'About section not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// UPDATE ABOUT (PATCH)
router.patch(
  "/:id",
  adminAuthMiddleware,
  validateUpdateAbout,
  AboutController.updateAbout
  /* 
    #swagger.tags = ['About']
    #swagger.summary = 'Update About section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'About ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'About update payload',
        required: true,
        schema: { $ref: '#/definitions/updateAboutSchema' }
    }
    #swagger.responses[200] = {
        description: 'About section updated successfully',
        schema: {
            success: true,
            message: 'About section updated successfully.',
            data: {
                id: 1,
                title: 'Crafting Excellence',
                subtitle: 'Our Core Philosophy',
                description: 'Delivering top-tier fabrication solutions.',
                content: 'Committed to precision engineering and quality.',
                updatedAt: '2025-11-10T11:00:00.000Z'
            }
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[404] = {
        description: 'About section not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// UPDATE ABOUT (PUT)
router.put(
  "/:id",
  adminAuthMiddleware,
  validateUpdateAbout,
  AboutController.updateAbout
);

// DELETE ABOUT
router.delete(
  "/:id",
  adminAuthMiddleware,
  AboutController.deleteAbout
  /* 
    #swagger.tags = ['About']
    #swagger.summary = 'Delete About section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'About ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'About section deleted successfully',
        schema: {
            success: true,
            message: 'About section deleted successfully.'
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized'
    }
    #swagger.responses[404] = {
        description: 'About section not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

export default router;

import { Router } from "express";
import { TestimonialController } from "../controller/testimonialController";
import {
  validateCreateTestimonial,
  validateUpdateTestimonial,
} from "../validations/testimonialValidation";

const router = Router();

// CREATE TESTIMONIAL
router.post(
  "/",
  validateCreateTestimonial,
  TestimonialController.createTestimonial
  /* 
    #swagger.tags = ['Testimonials']
    #swagger.summary = 'Create a customer testimonial'
    #swagger.description = 'Submit a client testimonial with client name, message, designation, and optional profile image URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Testimonial payload',
        required: true,
        schema: {
            name: 'Sarah Jenkins',
            message: 'Streamline Factory delivered exceptional turnkey precision tooling ahead of schedule.',
            designation: 'Operations Director, Apex Industrial',
            image: 'http://localhost:9000/streamline/testimonials/sarah.jpg'
        }
    }
    #swagger.responses[201] = {
        description: 'Testimonial created successfully'
    }
  */
);

// GET ALL TESTIMONIALS (PUBLIC / ADMIN)
router.get(
  "/",
  TestimonialController.getAllTestimonials
  /* 
    #swagger.tags = ['Testimonials']
    #swagger.summary = 'Get all testimonials'
    #swagger.description = 'Fetch all customer testimonials with server-side pagination, search, and newest-first ordering.'
    #swagger.parameters['page'] = {
        in: 'query',
        description: 'Page number',
        required: false,
        type: 'integer',
        default: 1
    }
    #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Number of items per page',
        required: false,
        type: 'integer',
        default: 10
    }
    #swagger.parameters['search'] = {
        in: 'query',
        description: 'Search by client name, message, or designation',
        required: false,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Testimonials fetched successfully'
    }
  */
);

// GET TESTIMONIAL BY ID
router.get(
  "/:id",
  TestimonialController.getTestimonialById
  /* 
    #swagger.tags = ['Testimonials']
    #swagger.summary = 'Get testimonial by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Testimonial fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Testimonial not found'
    }
  */
);

// UPDATE TESTIMONIAL
router.patch(
  "/:id",
  validateUpdateTestimonial,
  TestimonialController.updateTestimonial
  /* 
    #swagger.tags = ['Testimonials']
    #swagger.summary = 'Update testimonial by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Testimonial update payload',
        required: true,
        schema: {
            name: 'Sarah Jenkins',
            message: 'Updated client testimonial text.',
            designation: 'VP of Manufacturing, Apex Global',
            image: 'http://localhost:9000/streamline/testimonials/sarah.jpg'
        }
    }
    #swagger.responses[200] = {
        description: 'Testimonial updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Testimonial not found'
    }
  */
);

// DELETE TESTIMONIAL
router.delete(
  "/:id",
  TestimonialController.deleteTestimonial
  /* 
    #swagger.tags = ['Testimonials']
    #swagger.summary = 'Delete testimonial by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Testimonial deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Testimonial not found'
    }
  */
);

export default router;

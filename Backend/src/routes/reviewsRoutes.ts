import { Router } from "express";
import { ReviewController } from "../controller/reviewsController";
import { validateCreateReview, validateUpdateReview } from "../validations/reviewsValidation";

const router = Router();

// CREATE REVIEW
router.post(
  "/",
  validateCreateReview,
  ReviewController.createReview
  /* 
    #swagger.tags = ['Reviews']
    #swagger.summary = 'Create a customer review'
    #swagger.description = 'Submit a client review with rating title, reviewer name, description, and optional photo URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Review payload',
        required: true,
        schema: {
            name: 'Alex Taylor',
            title: 'Exceptional Build Quality',
            description: 'Turnaround time exceeded our expectations.',
            image: 'http://localhost:9000/streamline/reviews/alex.jpg'
        }
    }
    #swagger.responses[201] = {
        description: 'Review created successfully'
    }
    #swagger.responses[400] = {
        description: 'Validation failed or review title already exists'
    }
  */
);

// GET ALL REVIEWS
router.get(
  "/",
  ReviewController.getAllReviews
  /* 
    #swagger.tags = ['Reviews']
    #swagger.summary = 'Get all reviews'
    #swagger.description = 'Fetch all customer reviews.'
    #swagger.responses[200] = {
        description: 'Reviews fetched successfully'
    }
  */
);

// GET REVIEW BY ID
router.get(
  "/:id",
  ReviewController.getReviewById
  /* 
    #swagger.tags = ['Reviews']
    #swagger.summary = 'Get review by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Review fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Review not found'
    }
  */
);

// UPDATE REVIEW
router.patch(
  "/:id",
  validateUpdateReview,
  ReviewController.updateReview
  /* 
    #swagger.tags = ['Reviews']
    #swagger.summary = 'Update review by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Review update payload',
        required: true,
        schema: {
            name: 'Alex Taylor',
            title: 'Exceptional Build Quality',
            description: 'Turnaround time exceeded our expectations.',
            image: 'http://localhost:9000/streamline/reviews/alex.jpg'
        }
    }
    #swagger.responses[200] = {
        description: 'Review updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Review not found'
    }
  */
);

// DELETE REVIEW
router.delete(
  "/:id",
  ReviewController.deleteReview
  /* 
    #swagger.tags = ['Reviews']
    #swagger.summary = 'Delete review by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Review ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Review deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Review not found'
    }
  */
);

export default router;

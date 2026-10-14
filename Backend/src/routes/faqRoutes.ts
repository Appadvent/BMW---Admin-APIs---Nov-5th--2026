import { Router } from "express";
import { FAQController } from "../controller/faqController";
import { validateCreateFAQ, validateUpdateFAQ } from "../validations/faqValidation";

const router = Router();

// CREATE FAQ SECTION
router.post(
  "/",
  validateCreateFAQ,
  FAQController.createFAQSection
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Create FAQ section'
    #swagger.description = 'Create a new FAQ section with items.'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/createFAQSchema' }
    }
    #swagger.responses[201] = {
        description: 'FAQ Section created successfully',
        schema: {
            success: true,
            message: 'FAQ Section created successfully',
            data: {
                id: 1,
                heading: 'Frequently Asked Questions',
                items: [
                    { id: 1, question: 'What materials do you support?', answer: 'Steel and aluminum alloys.' }
                ]
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Validation failed'
    }
  */
);

// GET ALL FAQ SECTIONS
router.get(
  "/",
  FAQController.getAllFAQSections
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Get all FAQ sections'
    #swagger.description = 'Fetch all FAQ sections and their questions.'
    #swagger.responses[200] = {
        description: 'FAQ sections fetched successfully'
    }
  */
);

// GET FAQ SECTION BY ID
router.get(
  "/:id",
  FAQController.getFAQSectionById
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Get FAQ section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'FAQ section fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'FAQ Section not found'
    }
  */
);

// UPDATE FAQ SECTION
router.patch(
  "/:id",
  validateUpdateFAQ,
  FAQController.updateFAQSection
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Update FAQ section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/definitions/updateFAQSchema' }
    }
    #swagger.responses[200] = {
        description: 'FAQ section updated successfully'
    }
    #swagger.responses[404] = {
        description: 'FAQ Section not found'
    }
  */
);

// DELETE FAQ SECTION
router.delete(
  "/:id",
  FAQController.deleteFAQSection
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Delete FAQ section by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'FAQ section deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'FAQ Section not found'
    }
  */
);

export default router;

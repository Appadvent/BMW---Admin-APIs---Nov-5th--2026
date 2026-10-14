import { pagesController } from "../controller/index";
import { Router } from "express";
import { validateCreatePage, validateUpdatePage } from "../validations/pageValidation";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const router = Router();

router
  .post(
    "/create",
    adminAuthMiddleware,
    validateCreatePage,
    pagesController.createPage
    /* 
      #swagger.tags = ['Page']
      #swagger.summary = 'Create page'
      #swagger.description = 'Create a static page (e.g. privacy policy, terms).'
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Create page data',
          required: true,
          schema: { $ref: '#/definitions/createPageSchema' }
      }
      #swagger.responses[200] = {
          description: 'Page created successfully',
          schema: {
              success: true,
              data: {
                  page: {
                      id: 1,
                      type: 'policy',
                      title: 'Privacy Policy',
                      content: 'Page content...',
                      createdAt: '2025-11-10T10:00:00.000Z',
                      updatedAt: '2025-11-10T10:00:00.000Z'
                  }
              }
          }
      }
      #swagger.responses[400] = {
          description: 'Validation failed or page type already exists'
      }
    */
  )
  .get(
    "/get-pages",
    pagesController.getPages
    /* 
      #swagger.tags = ['Page']
      #swagger.summary = 'Get all pages'
      #swagger.description = 'Fetch all static pages.'
      #swagger.responses[200] = {
          description: 'Pages fetched successfully',
          schema: {
              success: true,
              data: {
                  pages: [
                      {
                          id: 1,
                          type: 'policy',
                          title: 'Privacy Policy',
                          content: 'Page content...',
                          createdAt: '2025-11-10T10:00:00.000Z',
                          updatedAt: '2025-11-10T10:00:00.000Z'
                      }
                  ]
              }
          }
      }
    */
  )
  .patch(
    "/update/:id",
    adminAuthMiddleware,
    validateUpdatePage,
    pagesController.updatePage
    /* 
      #swagger.tags = ['Page']
      #swagger.summary = 'Update page by ID'
      #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          example: 1
      }
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Update page data',
          required: true,
          schema: { $ref: '#/definitions/updatePageSchema' }
      }
      #swagger.responses[200] = {
          description: 'Page updated successfully'
      }
      #swagger.responses[400] = {
          description: 'Page not found'
      }
    */
  )
  .delete(
    "/delete/:id",
    adminAuthMiddleware,
    pagesController.deletePage
    /* 
      #swagger.tags = ['Page']
      #swagger.summary = 'Delete page by ID'
      #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          example: 1
      }
      #swagger.responses[200] = {
          description: 'Page deleted successfully'
      }
      #swagger.responses[400] = {
          description: 'Page not found'
      }
    */
  );

export default router;
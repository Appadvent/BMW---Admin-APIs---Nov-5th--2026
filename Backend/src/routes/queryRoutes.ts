import { Router } from "express";
import { queryController } from "../controller/index";
import { validateQuery } from "../validations/queryValidation";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const router = Router();

router
  .post(
    "/create",
    validateQuery,
    queryController.contactUs
    /* 
      #swagger.tags = ['Query']
      #swagger.summary = 'Submit user contact inquiry'
      #swagger.description = 'Submit a contact form query.'
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Query data',
          required: true,
          schema: { $ref: '#/definitions/querySchema' }
      }
      #swagger.responses[200] = {
          description: 'Query submitted successfully',
          schema: {
              success: true,
              data: {
                  result: {
                      id: 1,
                      name: 'Ajay Kumar',
                      email: 'ajay@example.com',
                      message: 'Need custom fabrication quote.',
                      phone: '9876543210',
                      services: 'CNC Machining',
                      createdAt: '2025-11-10T10:00:00.000Z',
                      updatedAt: '2025-11-10T10:00:00.000Z'
                  }
              }
          }
      }
      #swagger.responses[400] = {
          description: 'Validation failed'
      }
    */
  )
  .get(
    "/get-queries",
    adminAuthMiddleware,
    queryController.getQueries
    /* 
      #swagger.tags = ['Query']
      #swagger.summary = 'Get all contact queries with pagination'
      #swagger.description = 'Fetch submitted contact inquiries with pagination and multi-field search (Admin only).'
      #swagger.parameters['page'] = {
          in: 'query',
          type: 'integer',
          required: false,
          description: 'Page number (default: 1)',
          example: 1
      }
      #swagger.parameters['limit'] = {
          in: 'query',
          type: 'integer',
          required: false,
          description: 'Number of items per page (default: 10)',
          example: 10
      }
      #swagger.parameters['search'] = {
          in: 'query',
          type: 'string',
          required: false,
          description: 'Search inquiries by name, email, phone, service, or message'
      }
      #swagger.responses[200] = {
          description: 'Queries fetched successfully with pagination metadata',
          schema: {
              success: true,
              data: {
                  queries: [
                      {
                          id: 1,
                          name: 'Ajay Kumar',
                          email: 'ajay@example.com',
                          message: 'Need custom fabrication quote.',
                          phone: '9876543210',
                          services: 'CNC Machining',
                          createdAt: '2025-11-10T10:00:00.000Z'
                      }
                  ],
                  pagination: {
                      total: 25,
                      page: 1,
                      limit: 10,
                      totalPages: 3
                  }
              }
          }
      }
    */
  )
  .delete(
    "/delete-query/:id",
    adminAuthMiddleware,
    queryController.deleteQuery
    /* 
      #swagger.tags = ['Query']
      #swagger.summary = 'Delete contact query by ID'
      #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          example: 1
      }
      #swagger.responses[200] = {
          description: 'Query deleted successfully'
      }
    */
  );

export default router;
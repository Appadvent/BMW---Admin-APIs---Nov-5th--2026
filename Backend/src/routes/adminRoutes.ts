import { Router } from "express";
import { adminController } from "../controller/index";
import { ValidateAdminLogin, ValidateEmailSend } from "../validations/adminValidation";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const router = Router();

router.post(
  "/login",
  ValidateAdminLogin,
  adminController.loginUser
  /* 
    #swagger.tags = ['Admin']
    #swagger.summary = 'Admin login'
    #swagger.description = 'Authenticate an administrator and receive a JWT Bearer token.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Admin credentials',
        required: true,
        schema: { $ref: '#/definitions/adminLoginSchema' }
    }
    #swagger.responses[200] = {
        description: 'Admin logged in successfully',
        schema: {
            message: 'User logged in successfully',
            data: { id: 1, name: 'Admin Name', email: 'admin@example.com' },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
    }
    #swagger.responses[400] = {
        description: 'Invalid credentials or user not found'
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

router.get(
  "/stats",
  adminAuthMiddleware,
  adminController.getDashboardStats
  /* 
    #swagger.tags = ['Admin']
    #swagger.summary = 'Get dashboard statistics'
    #swagger.description = 'Fetch aggregated counts and recent queries with optional date range or presets.'
    #swagger.parameters['startDate'] = {
        in: 'query',
        type: 'string',
        required: false,
        description: 'Start date (YYYY-MM-DD or ISO string)'
    }
    #swagger.parameters['endDate'] = {
        in: 'query',
        type: 'string',
        required: false,
        description: 'End date (YYYY-MM-DD or ISO string)'
    }
    #swagger.parameters['range'] = {
        in: 'query',
        type: 'string',
        required: false,
        description: 'Preset range: today | yesterday | week | month | year | all'
    }
    #swagger.responses[200] = {
        description: 'Statistics fetched successfully'
    }
  */
);

router.post(
  "/send-email",
  ValidateEmailSend,
  adminController.sendEmail
  /* 
    #swagger.tags = ['Admin']
    #swagger.summary = 'Send email response to customer'
    #swagger.description = 'Send a direct email reply to a customer inquiry using Gmail SMTP.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Email payload with recipient, subject, and content',
        required: true,
        schema: { $ref: '#/definitions/emailSendSchema' }
    }
    #swagger.responses[200] = {
        description: 'Email sent successfully',
        schema: {
            statusCode: 200,
            type: 'EMAIL_SENT',
            message: 'Email sent successfully'
        }
    }
    #swagger.responses[400] = {
        description: 'Validation error'
    }
    #swagger.responses[500] = {
        description: 'Failed to send email'
    }
  */
);

export default router;
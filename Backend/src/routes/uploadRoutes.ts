import { Router } from "express";
import upload from "../middlewares/upload.middleware";
import { uploadController } from "../controller/uploadController";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  uploadController.uploadFile
  /* 
    #swagger.tags = ['Upload']
    #swagger.summary = 'Upload a single file to MinIO storage'
    #swagger.description = 'Upload an image or document to MinIO Object Storage bucket.'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['file'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'File to upload'
    }
    #swagger.parameters['folder'] = {
        in: 'formData',
        type: 'string',
        required: false,
        description: 'Destination folder in MinIO bucket (e.g. products, features, blogs)',
        example: 'products'
    }
    #swagger.responses[200] = {
        description: 'File uploaded successfully',
        schema: {
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: 'https://minioapi.appadvent.in/i-mag/products/1790589653307-image.jpg',
                key: 'products/1790589653307-image.jpg',
                name: 'image.jpg',
                size: 1048576,
                mimetype: 'image/jpeg'
            }
        }
    }
    #swagger.responses[400] = {
        description: 'No file uploaded or invalid file type'
    }
    #swagger.responses[500] = {
        description: 'MinIO upload failure'
    }
  */
);

router.post(
  "/multiple",
  upload.array("files", 10),
  uploadController.uploadFile
  /* 
    #swagger.tags = ['Upload']
    #swagger.summary = 'Upload multiple files to MinIO storage'
    #swagger.description = 'Upload up to 10 files simultaneously to MinIO bucket.'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['files'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'Files to upload'
    }
    #swagger.parameters['folder'] = {
        in: 'formData',
        type: 'string',
        required: false,
        description: 'Destination folder in MinIO bucket',
        example: 'products'
    }
    #swagger.responses[200] = {
        description: 'Files uploaded successfully',
        schema: {
            success: true,
            message: 'Files uploaded successfully',
            data: [
                {
                    url: 'https://minioapi.appadvent.in/i-mag/products/1790589653307-image1.jpg',
                    key: 'products/1790589653307-image1.jpg'
                }
            ]
        }
    }
    #swagger.responses[400] = {
        description: 'No files provided'
    }
  */
);

router.delete(
  "/",
  uploadController.deleteFile
  /* 
    #swagger.tags = ['Upload']
    #swagger.summary = 'Delete a file from MinIO storage'
    #swagger.description = 'Delete an image or document from MinIO by its accessible URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'File URL payload',
        schema: { $ref: '#/definitions/deleteUploadSchema' }
    }
    #swagger.responses[200] = {
        description: 'File deleted successfully',
        schema: {
            success: true,
            message: 'File deleted successfully from storage'
        }
    }
    #swagger.responses[400] = {
        description: 'URL is required'
    }
  */
);

router.get(
  "/",
  uploadController.listFiles
  /* 
    #swagger.tags = ['Upload']
    #swagger.summary = 'List all files from MinIO storage'
    #swagger.description = 'List all files, optionally filtering by folder.'
    #swagger.parameters['folder'] = {
        in: 'query',
        type: 'string',
        required: false,
        description: 'Folder prefix'
    }
    #swagger.responses[200] = {
        description: 'Files fetched successfully'
    }
  */
);

export default router;

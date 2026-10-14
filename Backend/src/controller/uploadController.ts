import { Request, Response } from "express";
import { uploadFileToMinIO, deleteFileFromMinIO, extractMinIOKey, listAllFilesFromMinIO } from "../utils/minioStorage";

export const uploadController = {
  /**
   * Upload single or multiple files to MinIO
   * POST /api/upload
   */
  uploadFile: async (req: Request, res: Response): Promise<void> => {
    try {
      const folder = (req.body.folder as string) || "uploads";

      // Single file upload
      if (req.file) {
        const url = await uploadFileToMinIO(req.file, folder);
        const key = extractMinIOKey(url);

        res.status(200).json({
          success: true,
          message: "File uploaded successfully",
          data: {
            url,
            key,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
          },
        });
        return;
      }

      // Multiple files upload
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const uploaded = await Promise.all(
          req.files.map(async (file) => {
            const url = await uploadFileToMinIO(file, folder);
            return {
              url,
              key: extractMinIOKey(url),
              originalName: file.originalname,
              size: file.size,
              mimetype: file.mimetype,
            };
          })
        );

        res.status(200).json({
          success: true,
          message: `${uploaded.length} files uploaded successfully`,
          data: uploaded,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: "No file was uploaded in the request",
      });
    } catch (error: any) {
      console.error("[Upload Error]:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to upload file to MinIO",
      });
    }
  },

  /**
   * Delete a file from MinIO by URL or key
   * DELETE /api/upload
   */
  deleteFile: async (req: Request, res: Response): Promise<void> => {
    try {
      const fileUrl = (req.body?.url as string) || (req.query?.url as string) || (req.body?.key as string) || (req.query?.key as string);

      if (!fileUrl) {
        res.status(400).json({
          success: false,
          message: "Please provide a 'url' or 'key' to delete",
        });
        return;
      }

      await deleteFileFromMinIO(fileUrl);

      res.status(200).json({
        success: true,
        message: "File deleted successfully from storage",
      });
    } catch (error: any) {
      console.error("[Delete File Error]:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete file from MinIO",
      });
    }
  },

  /**
   * List all files from MinIO
   * GET /api/upload
   */
  listFiles: async (req: Request, res: Response): Promise<void> => {
    try {
      const folder = (req.query.folder as string) || "";
      const files = await listAllFilesFromMinIO(folder);

      res.status(200).json({
        success: true,
        message: "Files fetched successfully",
        data: files,
      });
    } catch (error: any) {
      console.error("[List Files Error]:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch files from MinIO",
      });
    }
  },
};

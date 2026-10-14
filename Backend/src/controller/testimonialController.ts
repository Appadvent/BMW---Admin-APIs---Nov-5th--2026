import { Request, Response } from "express";
import { TestimonialDao } from "../dao/testimonial.dao";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const TestimonialController = {
  // CREATE TESTIMONIAL
  createTestimonial: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, message, image, designation } = req.body;

      const testimonial = await TestimonialDao.createTestimonial({
        name: name.trim(),
        message: message.trim(),
        image: typeof image === "string" && image.trim() ? image.trim() : null,
        designation:
          typeof designation === "string" && designation.trim()
            ? designation.trim()
            : null,
      });

      res.status(201).json({
        success: true,
        message: "Testimonial created successfully.",
        data: testimonial,
      });
    } catch (error: any) {
      console.error("Create Testimonial Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // GET ALL TESTIMONIALS (PAGINATED & SEARCHABLE)
  getAllTestimonials: async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const { testimonials, pagination } = await TestimonialDao.getAllTestimonials({
        page,
        limit,
        search,
      });

      res.status(200).json({
        success: true,
        data: testimonials,
        pagination,
      });
    } catch (error: any) {
      console.error("Get Testimonials Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // GET TESTIMONIAL BY ID
  getTestimonialById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const testimonial = await TestimonialDao.getTestimonialById(Number(id));

      if (!testimonial) {
        res.status(404).json({
          success: false,
          message: "Testimonial not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: testimonial,
      });
    } catch (error: any) {
      console.error("Get Testimonial Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // UPDATE TESTIMONIAL
  updateTestimonial: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, message, image, designation } = req.body;

      const existing = await TestimonialDao.getTestimonialById(Number(id));
      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Testimonial not found",
        });
        return;
      }

      // Cleanup previous image if replaced with a different URL
      if (image !== undefined && existing.image && existing.image !== image) {
        try {
          await deleteFileFromMinIO(existing.image);
        } catch (cleanupErr) {
          console.warn("MinIO cleanup warning:", cleanupErr);
        }
      }

      const updated = await TestimonialDao.updateTestimonial(Number(id), {
        name: name !== undefined ? name.trim() : undefined,
        message: message !== undefined ? message.trim() : undefined,
        image:
          image !== undefined
            ? typeof image === "string" && image.trim()
              ? image.trim()
              : null
            : undefined,
        designation:
          designation !== undefined
            ? typeof designation === "string" && designation.trim()
              ? designation.trim()
              : null
            : undefined,
      });

      res.status(200).json({
        success: true,
        message: "Testimonial updated successfully.",
        data: updated,
      });
    } catch (error: any) {
      console.error("Update Testimonial Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // DELETE TESTIMONIAL
  deleteTestimonial: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const existing = await TestimonialDao.getTestimonialById(Number(id));

      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Testimonial not found",
        });
        return;
      }

      if (existing.image) {
        try {
          await deleteFileFromMinIO(existing.image);
        } catch (cleanupErr) {
          console.warn("MinIO cleanup warning:", cleanupErr);
        }
      }

      await TestimonialDao.deleteTestimonial(Number(id));

      res.status(200).json({
        success: true,
        message: "Testimonial deleted successfully.",
      });
    } catch (error: any) {
      console.error("Delete Testimonial Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};

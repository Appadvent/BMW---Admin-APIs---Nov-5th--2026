import { Request, Response } from "express";
import { ReviewDao } from "../dao/review.dao";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const ReviewController = {
  // CREATE REVIEW
  createReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, title, description, image } = req.body;

      const review = await ReviewDao.createReview({
        name,
        title,
        description,
        image: typeof image === "string" ? image : undefined,
      });

      res.status(201).json({
        success: true,
        message: "Review created successfully.",
        data: review,
      });
    } catch (error: any) {
      if (error.message === "Review title already exists") {
        res.status(400).json({
          success: false,
          message: "Review title already exists.",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  // GET ALL REVIEWS
  getAllReviews: async (req: Request, res: Response): Promise<void> => {
    try {
      const reviews = await ReviewDao.getAllReviews();
      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  // GET REVIEW BY ID
  getReviewById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const review = await ReviewDao.getReviewById(Number(id));

      if (!review) {
        res.status(404).json({
          success: false,
          message: "Review not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  updateReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, title, description, image } = req.body;

      const existingReview = await ReviewDao.getReviewById(Number(id));
      if (!existingReview) {
        res.status(404).json({ success: false, message: "Review not found" });
        return;
      }

      if (image !== undefined && existingReview.image && existingReview.image !== image) {
        await deleteFileFromMinIO(existingReview.image);
      }

      const updatedReview = await ReviewDao.updateReview(Number(id), {
        name,
        title,
        description,
        image: image !== undefined ? (typeof image === "string" ? image : undefined) : existingReview.image,
      });

      res.status(200).json({
        success: true,
        message: "Review updated successfully.",
        data: updatedReview,
      });
    } catch (error: any) {
      if (error.message === "Review title already exists") {
        res.status(400).json({
          success: false,
          message: "Review title already exists.",
        });
        return;
      }

      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // DELETE REVIEW
  deleteReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const review = await ReviewDao.getReviewById(Number(id));
      if (!review) {
        res.status(404).json({
          success: false,
          message: "Review not found",
        });
        return;
      }

      // delete image from MinIO if exists
      if (review.image) {
        await deleteFileFromMinIO(review.image);
      }

      await ReviewDao.deleteReview(Number(id));

      res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};

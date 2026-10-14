import { Request, Response } from "express";
import { RESPONSE_MESSAGES } from "../constants/response";
import { BlogDao } from "../dao/blog.dao";
import { deleteFileFromMinIO } from "../utils/minioStorage";

export const BlogController = {
  createBlog: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, categoryId, author, publishedDate, image } = req.body;

      const category = await BlogDao.findCategoryById(Number(categoryId));
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found." });
        return;
      }

      const blog = await BlogDao.createBlog({
        title,
        description,
        image: typeof image === "string" ? image : undefined,
        categoryId: Number(categoryId),
        author,
        publishedDate,
      });

      res.status(201).json({
        success: true,
        message: "Blog created successfully.",
        data: blog,
      });
    } catch (error) {
      console.error("Create Blog Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getAllBlogs: async (req: Request, res: Response): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const { blogs, total } = await BlogDao.getAllBlogs(page, limit);
      res.status(200).json({
        success: true,
        data: blogs,
        pagination: {
          total,
          page: page || 1,
          limit: limit || total,
          totalPages: limit ? Math.ceil(total / limit) : 1,
        },
      });
    } catch (error) {
      console.error("Get All Blogs Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  getBlogById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const blog = await BlogDao.getBlogById(Number(id));

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      console.error("Get Blog by ID Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  getBlogsByCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = Number(req.params.id);
      const blogs = await BlogDao.getBlogsByCategory(categoryId);
      res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      console.error("Get Blogs by Category Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  updateBlog: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, categoryId, author, publishedDate, image } = req.body;

      // 1. Get existing blog
      const existingBlog = await BlogDao.getBlogById(Number(id));
      if (!existingBlog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });
        return;
      }

      // If new image passed and differs from existing, delete old one
      if (image !== undefined && existingBlog.image && existingBlog.image !== image) {
        await deleteFileFromMinIO(existingBlog.image);
      }

      // 2. Validate category if provided
      if (categoryId) {
        const category = await BlogDao.findCategoryById(Number(categoryId));
        if (!category) {
          res.status(404).json({
            success: false,
            message: "Category not found",
          });
          return;
        }
      }

      // 3. Update blog in DB
      const updatedBlog = await BlogDao.updateBlog(Number(id), {
        title,
        description,
        categoryId: categoryId ? Number(categoryId) : undefined,
        image: image !== undefined ? (typeof image === "string" ? image : undefined) : existingBlog.image,
        publishedDate,
        author,
      });

      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: updatedBlog,
      });
    } catch (error) {
      console.error("Update Blog Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  deleteBlog: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // 1. Fetch blog to get image URL
      const blog = await BlogDao.getBlogById(Number(id));
      if (!blog) {
        res.status(404).json({ success: false, message: "Blog not found." });
        return;
      }

      // 2. Delete image from MinIO
      if (blog.image) {
        await deleteFileFromMinIO(blog.image);
      }

      // 3. Delete blog from DB
      const deletedBlog = await BlogDao.deleteBlog(Number(id));

      res.status(200).json({
        success: true,
        message: "Blog deleted successfully.",
        data: deletedBlog,
      });
    } catch (error) {
      console.error("Delete Blog Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },
};

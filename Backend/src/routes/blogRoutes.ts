import express from "express";
import { BlogController } from "../controller/blogController";
import { validateCreateBlog, validateUpdateBlog } from "../validations/blogValidations";

const router = express.Router();

// CREATE BLOG
router.post(
  "/blogs",
  validateCreateBlog,
  BlogController.createBlog
  /* 
    #swagger.tags = ['Blog']
    #swagger.summary = 'Create a new blog'
    #swagger.description = 'Create a new blog post linked with a category and optional cover image URL.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Blog creation payload',
        required: true,
        schema: {
            title: 'How to Learn React',
            description: 'A comprehensive beginner guide.',
            categoryId: 1,
            author: 'Jane Doe',
            publishedDate: '2025-11-15',
            image: 'http://localhost:9000/streamline/blogs/cover.jpg'
        }
    }
    #swagger.responses[201] = {
        description: 'Blog created successfully',
        schema: {
            success: true,
            message: 'Blog created successfully.',
            data: {
                id: 1,
                title: 'How to Learn React',
                description: 'A comprehensive beginner guide.',
                image: 'http://localhost:9000/streamline/blogs/cover.jpg',
                categoryId: 1,
                author: 'Jane Doe',
                publishedDate: '2025-11-15T00:00:00.000Z',
                createdAt: '2025-11-10T10:00:00.000Z'
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Category not found',
        schema: { success: false, message: 'Category not found.' }
    }
    #swagger.responses[400] = {
        description: 'Validation failed',
        schema: { success: false, message: 'Title is required' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET ALL BLOGS
router.get(
  "/blogs",
  BlogController.getAllBlogs
  /* 
    #swagger.tags = ['Blog']
    #swagger.summary = 'Get all blogs'
    #swagger.description = 'Fetch all published blog posts.'
    #swagger.responses[200] = {
        description: 'Blogs fetched successfully',
        schema: {
            success: true,
            data: [
                {
                    id: 1,
                    title: 'How to Learn React',
                    description: 'A beginner guide.',
                    image: 'https://example.com/blog.jpg',
                    categoryId: 1,
                    author: 'Jane Doe',
                    publishedDate: '2025-11-15T00:00:00.000Z',
                    createdAt: '2025-11-10T10:00:00.000Z'
                }
            ]
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET BLOG BY ID
router.get(
  "/blogs/:id",
  BlogController.getBlogById
  /* 
    #swagger.tags = ['Blog']
    #swagger.summary = 'Get a single blog by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Blog ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Blog fetched successfully',
        schema: {
            success: true,
            data: {
                id: 1,
                title: 'How to Learn React',
                description: 'A beginner guide.',
                image: 'https://example.com/blog.jpg',
                categoryId: 1,
                author: 'Jane Doe',
                publishedDate: '2025-11-15T00:00:00.000Z',
                createdAt: '2025-11-10T10:00:00.000Z'
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Blog not found',
        schema: { success: false, message: 'Blog not found' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error'
    }
  */
);

// GET BLOGS BY CATEGORY
router.get(
  "/category/:id",
  BlogController.getBlogsByCategory
  /* 
    #swagger.tags = ['Blog']
    #swagger.summary = 'Get blogs by category ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Category ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Blogs for category fetched successfully'
    }
    #swagger.responses[404] = {
        description: 'Blog not found',
        schema: { success: false, message: 'Blog not found' }
    }
  */
);

// UPDATE BLOG
router.patch(
  "/blogs/:id",
  validateUpdateBlog,
  BlogController.updateBlog
  /* 
    #swagger.tags = ['Blog']
    #swagger.summary = 'Update blog by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Blog ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Blog update payload',
        required: true,
        schema: {
            title: 'Updated React Guide',
            description: 'Updated description',
            categoryId: 1,
            author: 'Jane Doe',
            publishedDate: '2025-11-15',
            image: 'http://localhost:9000/streamline/blogs/cover.jpg'
        }
    }
    #swagger.responses[200] = {
        description: 'Blog updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Blog or category not found'
    }
  */
);

// DELETE BLOG
router.delete(
  "/blogs/:id",
  BlogController.deleteBlog
  /* 
    #swagger.tags = ['Blog']
    #swagger.summary = 'Delete blog by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Blog ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Blog deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Blog not found'
    }
  */
);

export default router;

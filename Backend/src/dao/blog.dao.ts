import prisma from "../config/db.config";
import sanitizeHtml from "sanitize-html";


export const BlogDao = {
  

//  createBlog: async (data: {
//     title: string;
//     description: string;
//     image?: string;
//     categoryId: number;
//     author:string
//   }) => {
//     const safeDescription = sanitizeHtml(data.description, {
//       allowedTags: [
//         "h1", "h2", "h3", "h4", "h5", "h6",
//         "p", "b", "i", "strong", "em", "u", "a", "ul", "ol", "li", "br", "img"
//       ],
//       allowedAttributes: {
//         a: ["href", "target"],
//         img: ["src", "alt"]
//       },
//     });

//     return await prisma.blog.create({
//       data: {
//         title: data.title,
//         description: safeDescription,
//         image: data.image,
//         categoryId: data.categoryId,
//         author:data.author
//       },
//       include: { category: true },
//     });
//   },
createBlog: async (data: {
  title: string;
  description: string;
  image?: string;
  categoryId: number;
  author?: string;
  publishedDate?: Date; // add optional createdAt
}) => {
  const safeDescription = sanitizeHtml(data.description, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "b", "i", "strong", "em", "u", "a", "ul", "ol", "li", "br", "img"
    ],
    allowedAttributes: {
      a: ["href", "target"],
      img: ["src", "alt"]
    },
  });

  return await prisma.blog.create({
    data: {
      title: data.title,
      description: safeDescription,
      image: data.image,
      categoryId: data.categoryId,
      author: data.author,
     publishedDate: data.publishedDate ? new Date(data.publishedDate) : new Date(),
    },
    include: { category: true },
  });
},

  getBlogById: async (id: number) => {
  return await prisma.blog.findUnique({
    where: { id },
    include: { category: true },
  });
},
 

  // Get all blogs with optional pagination
  getAllBlogs: async (page?: number, limit?: number) => {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit ? Number(limit) : undefined;
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip,
        take,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count(),
    ]);
    return { blogs, total };
  },

  // Get blogs by category
  getBlogsByCategory: async (categoryId: number) => {
    return await prisma.blog.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  },

  // Check if category exists
  findCategoryById: async (id: number) => {
    return await prisma.category.findUnique({
      where: { id },
    });
  },

//   updateBlog: async (id: number, data: any) => {
//     return await prisma.blog.update({
//       where: { id },
//       data,
//       include: { category: true },
//     });
//   },

updateBlog: async (id: number, data: {
    title?: string;
    description?: string;
    image?: string | null;
    categoryId?: number;
    author?: string;
    publishedDate?: Date;
  }) => {
    const safeDescription = sanitizeHtml(data.description || "", {
      allowedTags: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "b", "i", "strong", "em", "u",
        "a", "ul", "ol", "li", "br", "img"
      ],
      allowedAttributes: {
        a: ["href", "target"],
        img: ["src", "alt"]
      },
    });

    return await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        description: safeDescription,
        image: data.image,
        categoryId: data.categoryId,
        author: data.author,
        publishedDate: data.publishedDate ? new Date(data.publishedDate) : undefined,
      },
      include: { category: true },
    });
  },


deleteBlog: async (id: number) => {
    return await prisma.blog.delete({
      where: { id },
    });
  },

};

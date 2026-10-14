import prisma from "../config/db.config";

export const CategoryDao = {
  createCategory: async (data: {
    name: string;
    description?: string | null;
    image?: string | null;
  }) => {
    return await prisma.category.create({ data });
  },

  getAllCategories: async () => {
    return await prisma.category.findMany({
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            status: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            products: true,
            blogs: true,
            subcategories: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getCategoryById: async (id: number) => {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            status: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        products: true,
        blogs: true,
        _count: {
          select: {
            products: true,
            blogs: true,
            subcategories: true,
          },
        },
      },
    });
  },

  findCategoryByName: async (name: string) => {
    return await prisma.category.findUnique({
      where: { name },
    });
  },

  updateCategory: async (
    id: number,
    data: {
      name?: string;
      description?: string | null;
      image?: string | null;
    }
  ) => {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  deleteCategory: async (id: number) => {
    return await prisma.category.delete({
      where: { id },
    });
  },
};

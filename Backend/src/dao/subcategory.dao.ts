import prisma from "../config/db.config";

export const SubcategoryDao = {
  createSubcategory: async (data: {
    name: string;
    categoryId: number;
    slug?: string | null;
    description?: string | null;
    image?: string | null;
    status?: string;
  }) => {
    return await prisma.subcategory.create({
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  },

  getAllSubcategories: async (params?: { categoryId?: number; status?: string }) => {
    const where: any = {};
    if (params?.categoryId) {
      where.categoryId = Number(params.categoryId);
    }
    if (params?.status) {
      where.status = params.status;
    }

    return await prisma.subcategory.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getSubcategoryById: async (id: number) => {
    return await prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        products: {
          take: 10,
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  },

  findByNameAndCategory: async (categoryId: number, name: string) => {
    return await prisma.subcategory.findUnique({
      where: {
        categoryId_name: {
          categoryId,
          name,
        },
      },
    });
  },

  updateSubcategory: async (
    id: number,
    data: {
      name?: string;
      categoryId?: number;
      slug?: string | null;
      description?: string | null;
      image?: string | null;
      status?: string;
    }
  ) => {
    return await prisma.subcategory.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  },

  deleteSubcategory: async (id: number) => {
    return await prisma.subcategory.delete({
      where: { id },
    });
  },
};

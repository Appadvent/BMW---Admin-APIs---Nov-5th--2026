
import prisma from "../config/db.config";

export const ProductHeadingDao = {
  createProductHeading: async (data: {
    title: string;
    description: string;
  }) => {
    return await prisma.productHeading.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });
  },

  getAllProductHeadings: async () => {
    return await prisma.productHeading.findMany({
      orderBy: { id: "desc" },
    });
  },

  getProductHeadingById: async (id: number) => {
    return await prisma.productHeading.findUnique({
      where: { id },
    });
  },

  updateProductHeading: async (
    id: number,
    data: {
      title?: string;
      description?: string;
    }
  ) => {
    return await prisma.productHeading.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
      },
    });
  },

  deleteProductHeading: async (id: number) => {
    return await prisma.productHeading.delete({
      where: { id },
    });
  },
};

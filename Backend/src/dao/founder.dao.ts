import prisma from "../config/db.config";

export const FounderDao = {
  createFounder: async (data: {
    name: string;
    title: string;
    description: string;
    image?: string | null;
  }) => {
    return await prisma.founder.create({
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        image: data.image ?? null,
      },
    });
  },

  getAllFounders: async () => {
    return await prisma.founder.findMany({
      orderBy: { id: "desc" },
    });
  },

  getFounderById: async (id: number) => {
    return await prisma.founder.findUnique({
      where: { id },
    });
  },

  updateFounder: async (id: number, data: {
    name?: string;
    title?: string;
    description?: string;
    image?: string | null;
  }) => {
    return await prisma.founder.update({
      where: { id },
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        image: data.image ?? undefined,
      },
    });
  },

  deleteFounder: async (id: number) => {
    return await prisma.founder.delete({
      where: { id },
    });
  },
};

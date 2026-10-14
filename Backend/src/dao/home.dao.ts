import prisma from "../config/db.config";

export const HomeDao = {
  createHome: async (data: any) => {
    return prisma.home.create({ data });
  },

  getHomes: async () => {
    return prisma.home.findMany({
      orderBy: { id: "desc" },
    });
  },

  getHomeById: async (id: number) => {
    return prisma.home.findUnique({ where: { id } });
  },

  updateHome: async (id: number, data: any) => {
    return prisma.home.update({
      where: { id },
      data,
    });
  },

  deleteHome: async (id: number) => {
    return prisma.home.delete({
      where: { id },
    });
  },
};
